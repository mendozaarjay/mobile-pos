import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { ReadingItem } from '../models/ReadingItem.model';
import { AuditLogService } from '../services/audit-log.service';
import { DynamicPrinterService } from '../services/dynamic-printer.service';
import { ReadingsService } from '../services/readings.service';

@Component({
  selector: 'app-reprintreadings',
  templateUrl: './reprintreadings.page.html',
  styleUrls: ['./reprintreadings.page.scss'],
})
export class ReprintreadingsPage implements OnInit {
  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  keyword: string = '';
  readingType: string;
  readingItems: ReadingItem[] = [];
  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  readingTitle: string = '';
  constructor(
    public alertController: AlertController,
    private service: ReadingsService,
    private printer: DynamicPrinterService,
    public loadingController: LoadingController,
    private auditLogs: AuditLogService
  ) {}

  ngOnInit() {}

  async loadData() {
    if (!this.readingType) {
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'Cannot Continue',
        message: 'Please select reading type to continue.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }
    this.auditLogs.searchReading(this.readingTitle).subscribe((a) => {});
    this.readingItems = [];
    this.service
      .getReadingItems(this.readingType, this.keyword)
      .subscribe((data) => {
        this.readingItems = data;
      });
  }
  async reprintReading(srno: string, type: string) {
    this.auditLogs.reprintReadings(this.readingTitle).subscribe((a) => {});
    this.service.reprintReadings(type, srno).subscribe((data) => {
      console.log(data);
      this.printData(data.Body);
    });
  }
  async typeChanged() {
    this.readingItems = [];
    if (this.readingType === 'XR') {
      this.readingTitle = 'X Readings';
    }

    if (this.readingType === 'YR') {
      this.readingTitle = 'Y Readings';
    }

    if (this.readingType === 'ZR') {
      this.readingTitle = 'Z Readings';
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
}
