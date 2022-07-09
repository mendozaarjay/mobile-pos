import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from '../config/constants';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  username: string = '';
  password: string = '';

  constructor(
    private router: Router,
    private httpClient: HttpClient,
    private constants: Constants,
    public alertController: AlertController
  ) {}

  ngOnInit() {}

  async SignIn() {
    this.router.navigateByUrl('/home');
  }
  async SignInNew() {
    if (this.username === '' || this.password === '') {
      this.showLoginError();
      return;
    }
    const baseUrl =
      this.constants.apiEndPoint +
      '/ticket/isvaliduser?username=' +
      this.username +
      '&password=' +
      this.password +
      '&gateid=' +
      this.constants.gateId;
    this.httpClient.get<any>(baseUrl).subscribe(
      (res) => {
        if (res.IsValid === false) {
          this.showLoginError();
        } else {
          console.log(res);
          this.constants.userId = res.Id;
          this.checkChangeFund(this.constants.userId);
        }
      },
      (error) => {
        console.log(error);
        this.printError(error);
      }
    );
  }
  async showLoginError() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Login Failed',
      message: 'Please verify your username and password',
      buttons: ['OK'],
    });
    await alert.present();
  }
  async printError(message: string) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Login Failed',
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
  async checkChangeFund(userid: any) {
    const baseUrl =
      this.constants.apiEndPoint +
      '/ticket/checkchangefund?userid=' +
      userid +
      '&gateid=' +
      this.constants.gateId;
    this.httpClient.get<any>(baseUrl).subscribe(
      (result) => {
        console.log(result);
        this.constants.cashierShiftId = result.Id;
        this.getParkerTypes();
        if (result.WithChangeFund === true) {
          this.router.navigateByUrl('/home');
        } else {
          this.router.navigateByUrl('/changefund');
        }
      },
      (error) => {
        console.log(error);
        this.printError(error);
      }
    );
  }
  async getParkerTypes() {
    const baseUrl = this.constants.apiEndPoint + '/ticket/parkertypes';
    this.httpClient.get<any>(baseUrl).subscribe((res) => {
      res.forEach((element) => {
        if (element.isDefault === true) {
          this.constants.defaultParkerType = element.Id;
        }
      });
    });
  }
}
