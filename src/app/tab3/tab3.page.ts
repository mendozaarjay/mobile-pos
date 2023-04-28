/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/member-ordering */
import { Component, ViewChild } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Constants } from '../config/constants';
import { AlertController } from '@ionic/angular';
import { AuditLogService } from '../services/audit-log.service';
import { SettingsService } from '../services/settings.service';
import { GateInformation } from '../models/GateInformation';
import { UserAccessMatrix } from '../models/UserAcessMatrix';
import { StatusComponent } from '../components/status/status.component';
import { interval } from 'rxjs';
@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
})
export class Tab3Page {
  @ViewChild(StatusComponent) statusComponent!: StatusComponent;
  handlerMessage: string;
  printer: string;
  settings: GateInformation = {} as GateInformation;
  constructor(
    public loadingController: LoadingController,
    private constant: Constants,
    public alertController: AlertController,
    private auditLogs: AuditLogService,
    private service: SettingsService
  ) {}

  async showWarning() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirmation',
      message: 'Do you really want to reset the handheld data?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            this.handlerMessage = 'Alert canceled';
          },
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: () => {
            this.handlerMessage = 'Alert confirmed';
          },
        },
      ],
    });
    await alert.present();
    const { role, data } = await alert.onDidDismiss();
    if (role === 'confirm') {
      this.resetHandHeld();
    }
  }
  async resetHandHeld() {
    this.auditLogs
      .buttonClicked('Reset Handheld Button', this.userId)
      .subscribe(() => {});
    this.service.resetHandled().subscribe((result) => {
      this.showMessage(result);
    });
  }
  async showMessage(result: any) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Cannot Continue',
      message: result,
      buttons: ['OK'],
    });
    await alert.present();
  }
  username = '';
  userId = '';
  cashierShiftId = '';
  resetButtonAccess: boolean = false;
  ionViewWillEnter() {
    interval(5000).subscribe(() => {
      this.statusComponent.checkApiStatus();
    });
    this.printer = this.constant.bluetoothAddress;
    this.service.getGateInfo().subscribe((data) => {
      this.settings = data;
    });
    const userInfoString = localStorage.getItem('userInfo');
    if (userInfoString) {
      const userInfo = JSON.parse(userInfoString);
      const cashierId = userInfo.Id;
      const cashierName = userInfo.Name;
      this.username = cashierName;
      this.userId = cashierId;
    }
    const cashierShiftId = localStorage.getItem('cashierShiftId');
    this.cashierShiftId = cashierShiftId;

    const userAccessStr = localStorage.getItem('userAccess');
    if (userAccessStr) {
      const userAccess = JSON.parse(userAccessStr) as UserAccessMatrix[];
      console.log(userAccess);
      this.resetButtonAccess = userAccess.some(
        (a) => a.code === 'HHPOSRESET' && a.canAccess
      );
    }
  }
}
