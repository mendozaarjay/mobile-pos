/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/member-ordering */
import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuditLogService } from '../services/audit-log.service';
import { DynamicPrinterService } from '../services/dynamic-printer.service';
import { ReadingsService } from '../services/readings.service';
import { UserLogInService } from '../services/user-log-in.service';

@Component({
  selector: 'app-yreading',
  templateUrl: './yreading.page.html',
  styleUrls: ['./yreading.page.scss'],
})
export class YreadingPage implements OnInit {
  srNo: string;
  constructor(
    public loadingController: LoadingController,
    private service: ReadingsService,
    private printer: DynamicPrinterService,
    private auditLogs: AuditLogService,
    public alertController: AlertController,
    private loginService: UserLogInService
  ) {}

  ngOnInit() {
    this.loadYReading();
  }

  loadYReading() {
    this.service.loadGeneratedYReading().subscribe((data) => {
      if (data.length > 0) {
        this.srNo = data;
      }
    });
  }
  async performYReading() {
    this.auditLogs
      .buttonClicked('Perform Y Reading Button', this.userId)
      .subscribe((a) => {});

    const shouldReturn = await new Promise((resolve) => {
      this.loginService.checkIfWithYReading().subscribe((result) => {
        if (result) {
          this.showWithYReading();
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });

    if (shouldReturn) {
      return;
    }

    if (this.withReading) {
      this.showWithReading();
      return;
    }

    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait while creating Y reading...',
      duration: 2000,
    });


    await loading.present();
    this.service.performYReading(this.userId).subscribe((readingdata) => {
      this.srNo = readingdata;
    });
    const { role, data } = await loading.onDidDismiss();
  }


  async printYReading() {
    this.auditLogs
      .buttonClicked('Print Y Reading Button', this.userId)
      .subscribe((a) => {});
    this.service.getYReadingPrintable(this.srNo).subscribe((data) => {
      console.log(data.Body);
      this.printData(data.Body);
    });
  }

  async printData(reading: string) {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait while printing Y reading...',
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
  async showWithYReading() {
    const alert = await this.alertController.create({
      header: 'Cannot Continue.',
      message: 'There is already a Y Reading for today.',
      buttons: ['OK'],
    });
    await alert.present();
  }

  username = '';
  userId = '';
  cashierShiftId = '';
  withReading: boolean = false;
  withYReading: boolean = false;

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

    const withYReadingString = localStorage.getItem('withYReading');
    this.withYReading = withYReadingString === '1';
  }
}
