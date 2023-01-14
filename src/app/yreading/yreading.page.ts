import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { AuditLogService } from '../services/audit-log.service';
import { DynamicPrinterService } from '../services/dynamic-printer.service';
import { ReadingsService } from '../services/readings.service';

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
    private auditLogs: AuditLogService
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
      .buttonClicked('Perform Y Reading Button')
      .subscribe((a) => {});
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait while creating Y reading...',
      duration: 2000,
    });

    await loading.present();
    this.service.performYReading().subscribe((readingdata) => {
      this.srNo = readingdata;
    });
    const { role, data } = await loading.onDidDismiss();
  }

  async printYReading() {
    this.auditLogs
      .buttonClicked('Print Y Reading Button')
      .subscribe((a) => {});
    this.service.getYReadingPrintable(this.srNo).subscribe((data) => {
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
}
