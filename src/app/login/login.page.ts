import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from '../config/constants';
import { AlertController } from '@ionic/angular';
import { UserLogInService } from '../services/user-log-in.service';
import { AuditLogService } from '../services/audit-log.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  username = '';
  password = '';

  constructor(
    private router: Router,
    private constants: Constants,
    public alertController: AlertController,
    private service: UserLogInService,
    private auditLogs: AuditLogService
  ) {}

  ngOnInit() {}

  // eslint-disable-next-line @typescript-eslint/naming-convention
  async SignInNew() {
    if (this.username === '' || this.password === '') {
      this.showLoginError();
      return;
    }
    this.service.checkUser(this.username, this.password).subscribe(
      (result) => {
        if (!result.IsValid) {
          this.auditLogs.userLoginError(this.username).subscribe((a) => {});
          this.showLoginError();
        } else {
          this.constants.userId = result.Id;
          this.constants.username = result.Name;
          this.auditLogs.userLogin(this.username).subscribe((a) => {});
          this.checkChangeFund(result.Id);
        }
      },
      (error) => {
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
    this.service.checkChangeFund(userid).subscribe(
      (result) => {
        this.constants.cashierShiftId = result.Id;
        this.service.setParkingTypes();
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
}
