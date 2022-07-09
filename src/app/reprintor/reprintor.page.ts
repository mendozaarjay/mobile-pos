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
    });
  }
  async printData(printingdata) {
    const encoder = new EscPosEncoder();
    const result = encoder.initialize();

    result
      .codepage('cp936')
      .align('center')
      .raw(commands.TEXT_FORMAT.TXT_NORMAL)
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
  }
}
