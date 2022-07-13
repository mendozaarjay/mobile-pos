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
@Component({
  selector: 'app-tenderdeclaration',
  templateUrl: './tenderdeclaration.page.html',
  styleUrls: ['./tenderdeclaration.page.scss'],
})
export class TenderdeclarationPage implements OnInit {
  php1000: number = 0;
  php500: number = 0;
  php200: number = 0;
  php100: number = 0;
  php50: number = 0;
  php20: number = 0;
  php10: number = 0;
  php5: number = 0;
  php1: number = 0;
  cent1: number = 0;
  totalphp1000: number = 0;
  totalphp500: number = 0;
  totalphp200: number = 0;
  totalphp100: number = 0;
  totalphp50: number = 0;
  totalphp20: number = 0;
  totalphp10: number = 0;
  totalphp5: number = 0;
  totalphp1: number = 0;
  totalcent1: number = 0;
  totalconfirmed: number = 0;
  comment: string = '';
  isConfirmed: boolean = false;
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
  async recalculateAll() {
    this.totalphp1000 = this.php1000 * 1000;
    this.totalphp500 = this.php500 * 500;
    this.totalphp200 = this.php200 * 200;
    this.totalphp100 = this.php100 * 100;
    this.totalphp50 = this.php50 * 50;
    this.totalphp20 = this.php20 * 20;
    this.totalphp10 = this.php10 * 10;
    this.totalphp5 = this.php5 * 5;
    this.totalphp1 = this.php1 * 1;
    this.totalcent1 = this.cent1 * 1;

    const totalCents = this.totalcent1 / 100;
    this.totalconfirmed =
      this.totalphp1000 +
      this.totalphp500 +
      this.totalphp200 +
      this.totalphp100 +
      this.totalphp50 +
      this.totalphp20 +
      this.totalphp10 +
      this.totalphp5 +
      this.totalphp1 +
      totalCents;
  }
  async confirmTender() {
    const baseUrl =
      this.constant.apiEndPoint +
      '/ticket/settenderdeclaration?id=' +
      this.constant.cashierShiftId +
      '&v1000=' +
      this.php1000 +
      '&v500=' +
      this.php500 +
      '&v200=' +
      this.php200 +
      '&v100=' +
      this.php100 +
      '&v50=' +
      this.php50 +
      '&v20=' +
      this.php20 +
      '&v10=' +
      this.php10 +
      '&v5=' +
      this.php5 +
      '&v1=' +
      this.php1 +
      '&vcent=' +
      this.cent1 +
      '&comment=' +
      this.comment;

    this.httpClient.get<any>(baseUrl).subscribe(
      (result) => {
        if (result.includes('success')) {
          this.isConfirmed = true;
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  async printTender() {
    const baseUrl =
      this.constant.apiEndPoint +
      '/ticket/gettenderdeclaration?gateid=' +
      this.constant.gateId +
      '&id=' +
      this.constant.cashierShiftId;

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
    this.logOut();
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait while printing tender declaration...',
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
    console.log(result);
    const { role, data } = await loading.onDidDismiss();
  }
  async goBack() {
    this.router.navigateByUrl('/home');
  }
  async logOut() {
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
