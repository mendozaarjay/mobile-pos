import { Component, OnInit } from '@angular/core';
import { LoadingController, Platform } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../config/constants';
import { Printer, PrintOptions } from '@awesome-cordova-plugins/printer/ngx';
import { Device } from '@ionic-native/device/ngx';
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
    private device: Device
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
      '&plateNo=' +
      this.plateNo;
    this.httpClient.get<any>(baseUrl).subscribe((ticketdata) => {
      // this.printTicketNo(ticketdata);
      this.myCompanyName = ticketdata.Company;
      this.myAddress1 = ticketdata.Address1;
      this.myAddress2 = ticketdata.Address2;
      this.myAddress3 = ticketdata.Address3;
      this.myPlateNo = ticketdata.PlateNo;
      this.myTicketNo = ticketdata.TicketNo;
      this.myTimeIn = ticketdata.TimeIn;
      this.myTerminal = ticketdata.Terminal;
      this.myLocation = ticketdata.Location;
      this.loadNextTicket();
    });


    await this.loadNextTicket();
    this.plateNo = '';
    const { role, data } = await loading.onDidDismiss();
  }

  async loadNextTicket() {
    const gateId = 8;
    const nextTicketUrl =
      this.constant.apiEndPoint + '/ticket/GetNextTicket?gate=' + gateId;
    this.httpClient.get<any>(nextTicketUrl).subscribe((ticketdata) => {
      this.ticketNo = ticketdata;
    });
  }
  printTicketNo(base64String) {
    const content = document.getElementById('printer').innerHTML;
    const option: PrintOptions = {
      autoFit: true,
      monochrome: true,
      margin: false,

    };
    this.printer.isAvailable().then(() => {
      this.printer.print(content, option);
    });

  }
}
