import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { AuditLogService } from '../services/audit-log.service';
import { DynamicPrinterService } from '../services/dynamic-printer.service';
import { ReadingsService } from '../services/readings.service';

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
    private auditLogs: AuditLogService
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
      .buttonClicked('Perform Z Reading Button')
      .subscribe((a) => {});
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait while creating Z reading...',
      duration: 2000,
    });

    await loading.present();
    this.service.performZReading().subscribe((readingdata) => {
      this.srNo = readingdata;
    });
    const { role, data } = await loading.onDidDismiss();
  }

  async printZReading() {
    this.auditLogs
      .buttonClicked('Print Z Reading Button')
      .subscribe((a) => {});
    this.service.getZReadingPrintable(this.srNo).subscribe((data) => {
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
}
