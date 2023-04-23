/* eslint-disable @typescript-eslint/member-ordering */
import { Component, OnInit } from '@angular/core';
import { TicketItem } from '../models/TicketItem';
import { AuditLogService } from '../services/audit-log.service';
import { DynamicPrinterService } from '../services/dynamic-printer.service';
import { ReprintserviceService } from '../services/reprintservice.service';
@Component({
  selector: 'app-reprintticket',
  templateUrl: './reprintticket.page.html',
  styleUrls: ['./reprintticket.page.scss'],
})
export class ReprintticketPage implements OnInit {
  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  keyword: string = '';
  tickets: TicketItem[] = [];
  constructor(
    private reprintService: ReprintserviceService,
    private printer: DynamicPrinterService,
    private auditLogs: AuditLogService
  ) {}

  ngOnInit() {}
  loadData() {
    this.auditLogs
      .buttonClicked('Search Button - Reprint Ticket', this.userId)
      .subscribe((a) => {});
    this.reprintService.getTickets(this.keyword).subscribe((data) => {
      this.tickets = data;
    });
  }
  reprint(ticket: string) {
    this.auditLogs
      .buttonClicked('Reprint Ticket Button', this.userId)
      .subscribe((a) => {});
    this.reprintService.getTicketDetails(ticket).subscribe((data) => {
      console.log(data.Printable);
      this.printer.print(data.Printable);
    });
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
