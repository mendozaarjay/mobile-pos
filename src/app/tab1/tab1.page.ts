import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Printer, PrintOptions } from '@ionic-native/printer/ngx';
import { LoadingController } from '@ionic/angular';
import { Constants } from '../config/constants';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnInit {
  constructor(
    private printer: Printer,
    private httpClient: HttpClient,
    public loadingController: LoadingController,
    private constant: Constants
  ) {}
  ngOnInit() {}

  async printMe() {
    console.log('clicked');
    if (this.printer.isAvailable()) {
      const loading = await this.loadingController.create({
        cssClass: 'my-custom-class',
        message: 'Please wait...',
      });
      loading.present();
      const options: PrintOptions = {
        monochrome: true,
      };
      this.httpClient
        .get<any>(
          'http://192.168.219.173:2336/api/ticket/PrintTicket?ticketno=RT80000038&plateno=avc'
        )
        .subscribe((data) => {
          this.printer.print('base64://' + data, options);
          loading.dismiss();
        });
    } else {
      console.log('test failed');
    }
  }
  async logOut() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait while shifting out.....',
      duration: 2000,
    });

    await loading.present();
    const baseUrl =
      this.constant.apiEndPoint +
      '/ticket/signout?userid=' +
      this.constant.userId +
      '&gateid=' +
      this.constant.gateId;

    this.httpClient.get<any>(baseUrl).subscribe((readingdata) => {
      console.log(readingdata);
    });
  }
}
