import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { DynamicPrinterService } from '../services/dynamic-printer.service';
import { ChangeFundService } from '../services/change-fund.service';
import { AuditLogService } from '../services/audit-log.service';
@Component({
  selector: 'app-changefund',
  templateUrl: './changefund.page.html',
  styleUrls: ['./changefund.page.scss'],
})
export class ChangefundPage implements OnInit {
  changefund = 0.0;
  constructor(
    private router: Router,
    public alertController: AlertController,
    public loadingController: LoadingController,
    private printer: DynamicPrinterService,
    private service: ChangeFundService,
    private auditLogs: AuditLogService
  ) {}

  ngOnInit() {}
  async confirmChangeFund() {
    this.service.confirmChangeFund(this.changefund).subscribe(
      (result) => {
        if (result.includes('success')) {
          this.printChangeFund();
          this.auditLogs.changeFund(this.changefund).subscribe((a) => {});
          this.router.navigateByUrl('/home');
        }
      },
      (error) => {
        this.printError(error);
      }
    );
  }
  async printError(message: string) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Change Fund',
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  async printChangeFund() {
    this.service.getChangeFund().subscribe(
      (result) => {
        this.printData(result.Body);
      },
      (error) => {
        console.log(error);
      }
    );
  }
  async printData(printingdata) {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait while printing tender declaration...',
      duration: 3000,
    });
    await loading.present();
    this.printer.print(printingdata);
    const { role, data } = await loading.onDidDismiss();
  }
}
