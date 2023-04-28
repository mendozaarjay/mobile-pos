import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from '../config/constants';
import { AlertController } from '@ionic/angular';
import { UserLogInService } from '../services/user-log-in.service';
import { AuditLogService } from '../services/audit-log.service';
import { UserAccessMatrix } from '../models/UserAcessMatrix';
import { StatusService } from '../services/status.service';
import { StatusComponent } from '../components/status/status.component';
import { interval } from 'rxjs';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  @ViewChild(StatusComponent) statusComponent!: StatusComponent;
  username = '';
  password = '';
  version = '';
  statusText = 'Offline';
  statusColor = 'danger';
  constructor(
    private router: Router,
    private constants: Constants,
    public alertController: AlertController,
    private service: UserLogInService,
    private auditLogs: AuditLogService,
    private statusService: StatusService
  ) {}

  ngOnInit() {
    this.version = this.constants.version;
    this.checkApiStatus();
  }

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
          localStorage.setItem('userInfo', JSON.stringify(result));
          this.auditLogs
            .userLogin(this.username, result.Id)
            .subscribe((a) => {});
          // this.checkChangeFund(result.Id);
          this.checkUserAccess(result.Id);
          this.checkIfWithReading();
          this.checkIfWithYReading();
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
        localStorage.setItem('cashierShiftId', result.Id);
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
  async checkUserAccess(userId: string) {
    this.service
      .getUserAccess(userId)
      .subscribe((result: UserAccessMatrix[]) => {
        localStorage.setItem('userAccess', JSON.stringify(result));

        if (result.find((a) => a.code === 'HHPOSIOR')) {
          this.checkChangeFund(userId);
        } else {
          this.router.navigateByUrl('/home');
        }
      });
  }
  async checkIfWithReading() {
    this.service.checkIfWithReading().subscribe((result) => {
      if (result) {
        localStorage.setItem('withReading', '1');
      } else {
        localStorage.setItem('withReading', '0');
      }
    });
  }
  async checkIfWithYReading() {
    this.service.checkIfWithYReading().subscribe((result) => {
      if (result) {
        localStorage.setItem('withYReading', '1');
      } else {
        localStorage.setItem('withYReading', '0');
      }
    });
  }
  checkApiStatus() {
    this.statusService.checkApiStatus().subscribe(
      (status) => {
        if (status) {
          this.statusText = 'Online';
          this.statusColor = 'success';
        } else {
          this.statusText = 'Offline';
          this.statusColor = 'medium';
        }
      },
      (error) => {
        console.log('Error checking API status:', error);
        this.statusText = 'Offline';
        this.statusColor = 'medium';
      }
    );
  }
  ionViewWillEnter() {
    interval(5000).subscribe(() => {
      this.statusComponent.checkApiStatus();
    });
  }
}
