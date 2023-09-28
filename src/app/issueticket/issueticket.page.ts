/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/member-ordering */
import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, LoadingController, Platform } from '@ionic/angular';
import { AuditLogService } from '../services/audit-log.service';
import { DynamicPrinterService } from '../services/dynamic-printer.service';
import { TicketIssuanceService } from '../services/ticket-issuance.service';
import { UserLogInService } from '../services/user-log-in.service';
import { StatusComponent } from '../components/status/status.component';
import { interval } from 'rxjs';
@Component({
  selector: 'app-issueticket',
  templateUrl: './issueticket.page.html',
  styleUrls: ['./issueticket.page.scss'],
})
export class IssueticketPage implements OnInit {
  @ViewChild(StatusComponent) statusComponent!: StatusComponent;
  plateNo = '';
  ticketNo = '';

  constructor(
    public loadingController: LoadingController,
    private printer: DynamicPrinterService,
    private service: TicketIssuanceService,
    private auditLogs: AuditLogService,
    public alertController: AlertController,
    private loginService: UserLogInService
  ) {}

  ngOnInit() {
    this.loadNextTicket();
  }
  async presentLoading() {
    this.auditLogs.issueTicket(this.ticketNo, this.userId).subscribe((a) => {});

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

    if (!this.withReading) {
      const loading = await this.loadingController.create({
        cssClass: 'my-custom-class',
        message: 'Please wait while printing ticket...',
        duration: 2000,
      });
      await loading.present();
      this.service
        .setTicket(this.ticketNo, this.plateNo)
        .subscribe((ticketdata) => {
          this.printer.print(ticketdata.Printable);

          this.loadNextTicket();
        });

      await this.loadNextTicket();
      this.plateNo = '';
      const { role, data } = await loading.onDidDismiss();
    } else {
      this.showWithReading();
    }
    // const loading = await this.loadingController.create({
    //   cssClass: 'my-custom-class',
    //   message: 'Please wait while printing ticket...',
    //   duration: 2000,
    // });
    // await loading.present();
    // this.service
    //   .setTicket(this.ticketNo, this.plateNo)
    //   .subscribe((ticketdata) => {
    //     this.printer.print(ticketdata.Printable);

    //     this.loadNextTicket();
    //   });

    // await this.loadNextTicket();
    // this.plateNo = '';
    // const { role, data } = await loading.onDidDismiss();
  }

  async loadNextTicket() {
    this.service.getNextTicket().subscribe((ticketdata) => {
      this.ticketNo = ticketdata;
    });
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
    interval(5000).subscribe(() => {
      this.statusComponent.checkApiStatus();
    });
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
