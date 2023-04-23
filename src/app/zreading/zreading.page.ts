/* eslint-disable @typescript-eslint/member-ordering */
import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuditLogService } from '../services/audit-log.service';
import { DynamicPrinterService } from '../services/dynamic-printer.service';
import { ReadingsService } from '../services/readings.service';
import { UserLogInService } from '../services/user-log-in.service';

@Component({
  selector: 'app-zreading',
  templateUrl: './zreading.page.html',
  styleUrls: ['./zreading.page.scss'],
})
export class ZreadingPage implements OnInit {
  srNo: string;
  constructor(
    public loadingController: LoadingController,
    private service: ReadingsService,
    private printer: DynamicPrinterService,
    private auditLogs: AuditLogService,
    private loginService: UserLogInService,
    public alertController: AlertController
  ) {}
  ngOnInit() {
    this.loadZReading();
  }

  loadZReading() {
    this.service.loadGeneratedZReading().subscribe((data) => {
      if (data.length > 0) {
        this.srNo = data;
      }
    });
  }
  async performZReading() {
    this.auditLogs
      .buttonClicked('Perform Z Reading Button', this.userId)
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
      message: 'Please wait while creating Z reading...',
      duration: 2000,
    });

    await loading.present();
    this.service.performZReading(this.userId).subscribe((readingdata) => {
      console.log(readingdata);
      this.srNo = readingdata;
    });
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
  async printZReading() {
    this.auditLogs
      .buttonClicked('Print Z Reading Button', this.userId)
      .subscribe((a) => {});
    this.service
      .getZReadingPrintable(this.srNo, this.userId)
      .subscribe((data) => {
        this.printData(data.Body);
      });
  }

  async printData(reading: string) {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait while printing Z reading...',
      duration: 3000,
    });
    await loading.present();
    this.printer.print(reading);
    const { role, data } = await loading.onDidDismiss();
  }
  username = '';
  userId = '';
  cashierShiftId = '';
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
  }
}
