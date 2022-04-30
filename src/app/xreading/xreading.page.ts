import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { PrintService } from '../services/print.service';
import EscPosEncoder from 'esc-pos-encoder-ionic';
import { commands } from '../services/printer-commands';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../config/constants';
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
    const encoder = new EscPosEncoder();
    const result = encoder.initialize();

    result
      .codepage('cp936')
      .align('center')
      .raw(commands.TEXT_FORMAT.TXT_NORMAL)
      .line(header)
      .align('left')
      .line(printingdata)
      .raw(commands.TEXT_FORMAT.TXT_NORMAL)
      .text(commands.HORIZONTAL_LINE.HR_58MM)
      .text(commands.HORIZONTAL_LINE.HR2_58MM)
      .newline()
      .raw(commands.TEXT_FORMAT.TXT_NORMAL)
      .newline()
      .newline();
    this.print.sendToBluetoothPrinter(
      this.constant.bluetoothAddress,
      result.encode()
    );
    const { role, data } = await loading.onDidDismiss();
  }
}
