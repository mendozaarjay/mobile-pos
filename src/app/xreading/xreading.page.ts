import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { PrintService } from '../services/print.service';
import EscPosEncoder from 'esc-pos-encoder-ionic';
import { commands } from '../services/printer-commands';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../config/constants';
import {
  PrinterToUse,
  ThermalPrinterPlugin,
} from 'thermal-printer-cordova-plugin/src';
// eslint-disable-next-line @typescript-eslint/naming-convention, no-var
declare let ThermalPrinter: ThermalPrinterPlugin;
@Component({
  selector: 'app-xreading',
  templateUrl: './xreading.page.html',
  styleUrls: ['./xreading.page.scss'],
})
export class XreadingPage implements OnInit {
  sRNo: string;
  constructor(
    public loadingController: LoadingController,
    public print: PrintService,
    private httpClient: HttpClient,
    private constant: Constants
  ) {}

  ngOnInit() {
    this.loadXReading();
  }

  loadXReading() {
    const baseUrl =
      this.constant.apiEndPoint +
      '/ticket/xreadingtoday?gateid=' +
      this.constant.gateId;

    this.httpClient.get<any>(baseUrl).subscribe((readingdata) => {
      if (readingdata.length > 0) {
        this.sRNo = readingdata;
      }
    });
  }
  async performXReading() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait while creating x reading...',
      duration: 2000,
    });

    await loading.present();
    const baseUrl =
      this.constant.apiEndPoint +
      '/ticket/performxreading?gateid=' +
      this.constant.gateId;

    this.httpClient.get<any>(baseUrl).subscribe((readingdata) => {
      this.sRNo = readingdata;
      console.log(readingdata);
    });
    const { role, data } = await loading.onDidDismiss();
  }

  async printXReading() {
    const baseUrl =
      this.constant.apiEndPoint +
      '/ticket/xreading?gateid=' +
      this.constant.gateId +
      '&srno=' +
      this.sRNo;

    this.httpClient.get<any>(baseUrl).subscribe((readingdata) => {
      console.log(readingdata.Header);
      console.log(readingdata.Body);
      this.printData(readingdata.Header, readingdata.Body);
    });
  }

  async printData(header, printingdata) {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait while printing X reading...',
      duration: 3000,
    });
    await loading.present();
    ThermalPrinter.printFormattedText(
      {
        type: 'bluetooth',
        id: this.constant.bluetoothAddress,
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
