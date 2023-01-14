import { Component } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Constants } from '../config/constants';
import { AlertController } from '@ionic/angular';
import { AuditLogService } from '../services/audit-log.service';
import { SettingsService } from '../services/settings.service';
import { GateInformation } from '../models/GateInformation';
@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
})
export class Tab3Page {
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
    this.auditLogs.buttonClicked('Reset Handheld Button');
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
  ionViewWillEnter() {
    this.printer = this.constant.bluetoothAddress;
    this.service.getGateInfo().subscribe((data) => {
      this.settings = data;
    });
  }
}
