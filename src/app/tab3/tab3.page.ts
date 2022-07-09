import { Component } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../config/constants';
import { ParkerType } from '../models/ParkerType';
import { Observable } from 'rxjs';
import { AlertController } from '@ionic/angular';
import { PrintService } from '../services/print.service';
import EscPosEncoder from 'esc-pos-encoder-ionic';
import { commands } from '../services/printer-commands';
import { DiscountType } from '../models/DiscountType';
import { TransactionType } from '../models/TransactionType';
@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
})
export class Tab3Page {
  handlerMessage: string;
  constructor(
    public loadingController: LoadingController,
    private httpClient: HttpClient,
    private constant: Constants,
    public alertController: AlertController,
    public print: PrintService
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
    const baseUrl =
      this.constant.apiEndPoint +
      '/ticket/resetcounter?gateid=' +
      this.constant.gateId;
    this.httpClient.get<any>(baseUrl).subscribe((result) => {
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
}
