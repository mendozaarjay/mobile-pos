import { Component, OnInit } from '@angular/core';
import { LoadingController, Platform } from '@ionic/angular';
import { AuditLogService } from '../services/audit-log.service';
import { DynamicPrinterService } from '../services/dynamic-printer.service';
import { TicketIssuanceService } from '../services/ticket-issuance.service';
@Component({
  selector: 'app-issueticket',
  templateUrl: './issueticket.page.html',
  styleUrls: ['./issueticket.page.scss'],
})
export class IssueticketPage implements OnInit {
  plateNo = '';
  ticketNo = '';

  constructor(
    public loadingController: LoadingController,
    private printer: DynamicPrinterService,
    private service: TicketIssuanceService,
    private auditLogs: AuditLogService
  ) {}

  ngOnInit() {
    this.loadNextTicket();
  }
  async presentLoading() {
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
        this.auditLogs.issueTicket(this.ticketNo).subscribe((a) => {});
        this.loadNextTicket();
      });

    await this.loadNextTicket();
    this.plateNo = '';
    const { role, data } = await loading.onDidDismiss();
  }

  async loadNextTicket() {
    this.service.getNextTicket().subscribe((ticketdata) => {
      this.ticketNo = ticketdata;
    });
  }
}
