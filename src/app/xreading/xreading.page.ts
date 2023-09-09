/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/member-ordering */
import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuditLogService } from '../services/audit-log.service';
import { DynamicPrinterService } from '../services/dynamic-printer.service';
import { ReadingsService } from '../services/readings.service';
import { UserLogInService } from '../services/user-log-in.service';
@Component({
  selector: 'app-xreading',
  templateUrl: './xreading.page.html',
  styleUrls: ['./xreading.page.scss'],
})
export class XreadingPage implements OnInit {
  sRNo: string;
  constructor(
    public loadingController: LoadingController,
    private service: ReadingsService,
    private printer: DynamicPrinterService,
    private auditLogs: AuditLogService,
    public alertController: AlertController,
    private loginService: UserLogInService
  ) {}

  ngOnInit() {
    this.loadXReading();
  }
  loadXReading() {
    this.service.loadGeneratedXReading().subscribe((data) => {
      if (data.length > 0) {
        this.sRNo = data;
      }
    });
  }
  async performXReading() {
    this.auditLogs
      .buttonClicked('Perform X Reading Button', this.userId)
      .subscribe((a) => {});

    const shouldReturn = await new Promise((resolve) => {
      this.loginService.checkIfWithReading().subscribe((result) => {
        if (result) {
          this.showWithReading();
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });

    if (shouldReturn) {
      return;
    }

    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait while creating x reading...',
      duration: 2000,
    });
    await loading.present();

    this.service.performXReading().subscribe((readingdata) => {
      this.sRNo = readingdata;
      if (readingdata.Success === '0') {
        alert('You have to log out before performing X reading.');
        this.sRNo = '';
      } else {
        this.sRNo = readingdata.Returned;
      }
    });
    const { role, data } = await loading.onDidDismiss();
  }

  async printXReading() {
    this.auditLogs
      .buttonClicked('Print X Reading Button', this.userId)
      .subscribe((a) => {});

    if (!this.withReading) {
      this.service.getXReadingPrintable(this.sRNo).subscribe((readingdata) => {
        console.log(readingdata.Body);
        this.printData(readingdata.Body);
      });
    } else {
      this.showWithReading();
    }
  }

  async printData(reading: string) {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait while printing X reading...',
      duration: 3000,
    });
    await loading.present();
    this.printer.print(reading);
    const { role, data } = await loading.onDidDismiss();
  }
  async showWithReading() {
    const alert = await this.alertController.create({
      header: 'Cannot Continue.',
      message: 'There is already a Z Reading for today.',
      buttons: ['OK'],
    });
    await alert.present();
  }
  username = '';
  userId = '';
  cashierShiftId = '';
  withReading: boolean = false;
  ionViewWillEnter() {
    const userInfoString = localStorage.getItem('userInfo');
    if (userInfoString) {
      const userInfo = JSON.parse(userInfoString);
      const cashierId = userInfo.Id;
      const cashierName = userInfo.Name;
      this.username = cashierName;
      this.userId = cashierId;
    }
    const cashierShiftId = localStorage.getItem('cashierShiftId');
    this.cashierShiftId = cashierShiftId;
    const withReadingString = localStorage.getItem('withReading');
    this.withReading = withReadingString === '1';
  }
}
