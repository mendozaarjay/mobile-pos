/* eslint-disable @typescript-eslint/member-ordering */
import { Component, OnInit } from '@angular/core';
import { LoadingController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { TenderDeclarationItem } from '../models/TenderDeclarationItem';
import { TenderDeclarationService } from '../services/tender-declaration.service';
import { DynamicPrinterService } from '../services/dynamic-printer.service';
import { UserLogInService } from '../services/user-log-in.service';
import { AuditLogService } from '../services/audit-log.service';
@Component({
  selector: 'app-tenderdeclaration',
  templateUrl: './tenderdeclaration.page.html',
  styleUrls: ['./tenderdeclaration.page.scss'],
})
export class TenderdeclarationPage implements OnInit {
  php1000 = 0;
  php500 = 0;
  php200 = 0;
  php100 = 0;
  php50 = 0;
  php20 = 0;
  php10 = 0;
  php5 = 0;
  php1 = 0;
  cent1 = 0;
  totalphp1000 = 0;
  totalphp500 = 0;
  totalphp200 = 0;
  totalphp100 = 0;
  totalphp50 = 0;
  totalphp20 = 0;
  totalphp10 = 0;
  totalphp5 = 0;
  totalphp1 = 0;
  totalcent1 = 0;
  totalconfirmed = 0;
  comment = '';
  isConfirmed = false;
  constructor(
    public loadingController: LoadingController,
    private router: Router,
    private service: TenderDeclarationService,
    private printer: DynamicPrinterService,
    private userService: UserLogInService,
    private auditLogs: AuditLogService
  ) {}

  ngOnInit() {}
  async recalculateAll() {
    this.totalphp1000 = this.php1000 * 1000;
    this.totalphp500 = this.php500 * 500;
    this.totalphp200 = this.php200 * 200;
    this.totalphp100 = this.php100 * 100;
    this.totalphp50 = this.php50 * 50;
    this.totalphp20 = this.php20 * 20;
    this.totalphp10 = this.php10 * 10;
    this.totalphp5 = this.php5 * 5;
    this.totalphp1 = this.php1 * 1;
    this.totalcent1 = this.cent1 * 1;

    const totalCents = this.totalcent1 / 100;
    this.totalconfirmed =
      this.totalphp1000 +
      this.totalphp500 +
      this.totalphp200 +
      this.totalphp100 +
      this.totalphp50 +
      this.totalphp20 +
      this.totalphp10 +
      this.totalphp5 +
      this.totalphp1 +
      totalCents;
  }
  async confirmTender() {
    const item = new TenderDeclarationItem();
    item.comment = this.comment;
    item.cent1 = this.cent1;
    item.php1 = this.php1;
    item.php10 = this.php10;
    item.php100 = this.php100;
    item.php1000 = this.php1000;
    item.php20 = this.php20;
    item.php200 = this.php200;
    item.php5 = this.php5;
    item.php50 = this.php50;
    item.php500 = this.php500;
    this.service.confirmTender(item, this.cashierShiftId).subscribe(
      (result) => {
        if (result.includes('success')) {
          this.isConfirmed = true;
          this.auditLogs
            .confirmedTenderDeclaration(this.totalconfirmed, this.userId)
            .subscribe((a) => {});
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  async printTender() {
    this.service.getTenderPrintable(this.cashierShiftId).subscribe(
      (result) => {
        this.printer.print(result.Body);
        this.auditLogs
          .printedTenderDeclaration(this.totalconfirmed, this.userId)
          .subscribe((a) => {});
      },
      (error) => {
        console.log(error);
      }
    );
  }

  async goBack() {
    this.router.navigateByUrl('/home');
  }
  async logOut() {
    localStorage.clear();
    this.userService.logOut(this.userId).subscribe((data) => {
      this.router.navigateByUrl('');
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
