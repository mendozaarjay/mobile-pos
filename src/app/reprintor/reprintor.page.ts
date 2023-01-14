import { Component, OnInit } from '@angular/core';
import { LoadingController, Platform } from '@ionic/angular';
import { OfficialReceipt } from '../models/OfficialReceipt';
import { AuditLogService } from '../services/audit-log.service';
import { DynamicPrinterService } from '../services/dynamic-printer.service';
import { OfficialReceiptService } from '../services/official-receipt.service';
@Component({
  selector: 'app-reprintor',
  templateUrl: './reprintor.page.html',
  styleUrls: ['./reprintor.page.scss'],
})
export class ReprintorPage implements OnInit {
  officialreceiptlist: OfficialReceipt[] = [];
  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  keyword: string = '';
  constructor(
    public loadingController: LoadingController,
    private service: OfficialReceiptService,
    private printer: DynamicPrinterService,
    private auditLogs: AuditLogService
  ) {}

  ngOnInit() {}

  async loadData() {
    this.auditLogs
      .buttonClicked('Search Button - Reprint OR')
      .subscribe((a) => {});
    this.officialreceiptlist = [];
    this.service.loadOfficialReceipts(this.keyword).subscribe((data) => {
      data.forEach((item) => {
        const oritem = new OfficialReceipt();
        oritem.id = item.Id;
        oritem.gate = item.Gate;
        oritem.ornumber = item.ORNumber;
        oritem.plateno = item.PlateNo;
        oritem.paymentdate = item.PaymentDate;
        this.officialreceiptlist.push(oritem);
      });
    });
  }
  async reprint(id: any) {
    this.auditLogs.buttonClicked('Reprint OR').subscribe((a) => {});
    this.service.reprintOfficialReceipt(id).subscribe((data) => {
      this.printer.print(data.Printable);
    });
  }
}
