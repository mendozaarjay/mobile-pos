import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from '../config/constants';
import { AlertController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Printer, PrintOptions } from '@awesome-cordova-plugins/printer/ngx';
import { Device } from '@ionic-native/device/ngx';
import { PrintService } from '../services/print.service';
import EscPosEncoder from 'esc-pos-encoder-ionic';
import { commands } from '../services/printer-commands';
import {
  PrinterToUse,
  ThermalPrinterPlugin,
} from 'thermal-printer-cordova-plugin/src';
// eslint-disable-next-line @typescript-eslint/naming-convention, no-var
declare let ThermalPrinter: ThermalPrinterPlugin;
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
    public loadingController: LoadingController,
    private printer: Printer,
    private device: Device,
    public print: PrintService
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
          this.printChangeFund();
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

  async printChangeFund() {
    const baseUrl =
      this.constants.apiEndPoint +
      '/ticket/getchangefundprint?gateid=' +
      this.constants.gateId +
      '&id=' +
      this.constants.cashierShiftId;

    this.httpClient.get<any>(baseUrl).subscribe(
      (result) => {
        console.log(result.Header);
        console.log(result.Body);
        this.printData(result.Header, result.Body);
      },
      (error) => {
        console.log(error);
      }
    );
  }
  async printData(header, printingdata) {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait while printing tender declaration...',
      duration: 3000,
    });
    await loading.present();
    ThermalPrinter.printFormattedText(
      {
        type: 'bluetooth',
        id: this.constants.bluetoothAddress,
        text: printingdata,
      },
      function () {
        console.log('Successfully printed!');
      },
      function (error) {
        console.error('Printing error', error);
      }
    );
    const { role, data } = await loading.onDidDismiss();
  }
}
