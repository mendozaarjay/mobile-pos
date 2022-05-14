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
@Component({
  selector: 'app-issueticket',
  templateUrl: './issueticket.page.html',
  styleUrls: ['./issueticket.page.scss'],
})
export class IssueticketPage implements OnInit {
  plateNo: string = '';
  ticketNo: string = '';

  myCompanyName: string;
  myAddress1: string;
  myAddress2: string;
  myAddress3: string;
  myTIN: string;
  myPlateNo: string;
  myTicketNo: string;
  myTimeIn: string;
  myTerminal: string;
  myLocation: string;
  constructor(
    public loadingController: LoadingController,
    private httpClient: HttpClient,
    private constant: Constants,
    private printer: Printer,
    private platform: Platform,
    private device: Device,
    public print: PrintService
  ) {}

  ngOnInit() {
    this.loadNextTicket();
  }
  async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait while printing ticket...',
      duration: 2000,
    });
    await loading.present();

    const baseUrl =
      this.constant.apiEndPoint +
      '/ticket/printticket?ticketNo=' +
      this.ticketNo +
      '&gateid=' +
      this.constant.gateId +
      '&plateNo=' +
      this.plateNo;
    this.httpClient.get<any>(baseUrl).subscribe((ticketdata) => {
      this.printTicketNo(ticketdata.Printable, ticketdata.TicketNo);
      this.loadNextTicket();
    });

    await this.loadNextTicket();
    this.plateNo = '';
    const { role, data } = await loading.onDidDismiss();
  }

  async loadNextTicket() {
    const nextTicketUrl =
      this.constant.apiEndPoint +
      '/ticket/GetNextTicket?gate=' +
      this.constant.gateId;
    this.httpClient.get<any>(nextTicketUrl).subscribe((ticketdata) => {
      this.ticketNo = ticketdata;
    });
  }
  async printTicketNo(printingdata, ticketno) {
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
      .qrcode(ticketno)
      .newline()
      .newline();
    this.print.sendToBluetoothPrinter(
      this.constant.bluetoothAddress,
      result.encode()
    );
  }
}
