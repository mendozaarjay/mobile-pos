import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { AuditLogService } from '../services/audit-log.service';
import { DynamicPrinterService } from '../services/dynamic-printer.service';
import { ReadingsService } from '../services/readings.service';
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
    private auditLogs: AuditLogService
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
      .buttonClicked('Perform X Reading Button')
      .subscribe((a) => {});
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
    this.auditLogs.buttonClicked('Print X Reading Button').subscribe((a) => {});
    this.service.getXReadingPrintable(this.sRNo).subscribe((readingdata) => {
      this.printData(readingdata.Body);
    });
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
}
