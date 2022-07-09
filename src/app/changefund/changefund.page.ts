import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from '../config/constants';
import { AlertController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
@Component({
  selector: 'app-changefund',
  templateUrl: './changefund.page.html',
  styleUrls: ['./changefund.page.scss'],
})
export class ChangefundPage implements OnInit {
  changefund: number = 0.0;
  constructor(
    private router: Router,
    private httpClient: HttpClient,
    private constants: Constants,
    public alertController: AlertController,
    public loadingController: LoadingController
  ) {}

  ngOnInit() {}
  async confirmChangeFund() {
    const baseUrl =
      this.constants.apiEndPoint +
      '/ticket/setchangefund?id=' +
      this.constants.cashierShiftId +
      '&fund=' +
      this.changefund;

    this.httpClient.get<any>(baseUrl).subscribe(
      (result) => {
        if (result.includes('success')) {
          this.router.navigateByUrl('/home');
        }
      },
      (error) => {
        this.printError(error);
      }
    );
  }
  async printError(message: string) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Change Fund',
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
