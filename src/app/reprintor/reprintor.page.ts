import { Component, OnInit } from '@angular/core';
import { LoadingController, Platform } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../config/constants';
import { Printer, PrintOptions } from '@awesome-cordova-plugins/printer/ngx';
import { Device } from '@ionic-native/device/ngx';
import { PrintService } from '../services/print.service';
import EscPosEncoder from 'esc-pos-encoder-ionic';
import { commands } from '../services/printer-commands';
import { Router } from '@angular/router';
import { OfficialReceipt } from '../models/OfficialReceipt';
import {
  PrinterToUse,
  ThermalPrinterPlugin,
} from 'thermal-printer-cordova-plugin/src';
// eslint-disable-next-line @typescript-eslint/naming-convention, no-var
declare let ThermalPrinter: ThermalPrinterPlugin;
@Component({
  selector: 'app-reprintor',
  templateUrl: './reprintor.page.html',
  styleUrls: ['./reprintor.page.scss'],
})
export class ReprintorPage implements OnInit {
  officialreceiptlist: OfficialReceipt[] = [];
  keyword: string = '';
  constructor(
    public loadingController: LoadingController,
    private httpClient: HttpClient,
    private constant: Constants,
    private printer: Printer,
    private platform: Platform,
    private device: Device,
    public print: PrintService,
    private router: Router
  ) {}

  ngOnInit() {}

  async loadData() {
    this.officialreceiptlist = [];
    const baseUrl =
      this.constant.apiEndPoint +
      '/ticket/searchor?gateid=' +
      this.constant.gateId +
      '&keyword=' +
      this.keyword;

    this.httpClient.get<any>(baseUrl).subscribe((data) => {
      data.forEach((item) => {
        const oritem = new OfficialReceipt();
        oritem.id = item.Id;
        oritem.gate = item.Gate;
        oritem.ornumber = item.ORNumber;
        oritem.plateno = item.PlateNo;
        oritem.paymentdate = item.PaymentDate;
        this.officialreceiptlist.push(oritem);
      });
    });
    console.log(this.officialreceiptlist);
  }
  async reprint(id: any) {
    const baseUrl =
      this.constant.apiEndPoint +
      '/ticket/reprintofficialreceipt?transitid=' +
      id;
    this.httpClient.get<any>(baseUrl).subscribe((data) => {
      console.log(data.Printable);
      this.printData(1,data.Printable);
    });
  }
  async printData(header, printingdata) {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait while printing official receipt...',
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
