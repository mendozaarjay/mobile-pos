/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable no-var */
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Printer, PrintOptions } from '@ionic-native/printer/ngx';
import { LoadingController } from '@ionic/angular';
import { Constants } from '../config/constants';
import { Router } from '@angular/router';
import { AuditLogService } from '../services/audit-log.service';
import { UserAccessMatrix } from '../models/UserAcessMatrix';
import { StatusComponent } from '../components/status/status.component';
import { interval } from 'rxjs';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnInit {
  @ViewChild(StatusComponent) statusComponent!: StatusComponent;
  username = '';
  cashierShiftId = '';
  userId = '';
  constructor(
    private printer: Printer,
    private httpClient: HttpClient,
    public loadingController: LoadingController,
    private constant: Constants,
    private router: Router,
    private auditLogs: AuditLogService
  ) {}
  ngOnInit() {}

  async logOut() {
    this.auditLogs.userLogOut(this.userId).subscribe((a) => {});
    if (this.issueORAccess) {
      const loading = await this.loadingController.create({
        cssClass: 'my-custom-class',
        message: 'Please wait while shifting out.....',
        duration: 2000,
      });
      await loading.present();
      const baseUrl =
        this.constant.baseUrl +
        '/ticket/signout?userid=' +
        this.userId +
        '&gateid=' +
        this.constant.gateId;

      this.httpClient.get<any>(baseUrl).subscribe((readingdata) => {});
      this.checkTenderDeclaration();
    } else {
      localStorage.clear();
      this.router.navigateByUrl('');
    }
  }
  async checkTenderDeclaration() {
    const baseUrl =
      this.constant.baseUrl +
      '/ticket/checktenderdeclaration?id=' +
      this.userId +
      '&gateid=' +
      this.constant.gateId;

    this.httpClient.get<any>(baseUrl).subscribe(
      (result) => {
        console.log(result);
        if (result.WithTender === false) {
          this.router.navigateByUrl('/tenderdeclaration');
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }
  goToIssueTicket() {
    this.auditLogs
      .buttonClicked('Issue Ticket Button', this.userId)
      .subscribe((a) => {});
    this.router.navigateByUrl('issueticket');
  }
  goToIssueOR() {
    this.auditLogs
      .buttonClicked('Issue Official Receipt Button', this.userId)
      .subscribe((a) => {});
    this.router.navigateByUrl('issueor');
  }
  goToReadings() {
    this.auditLogs
      .buttonClicked('Readings Button', this.userId)
      .subscribe((a) => {});
    this.router.navigateByUrl('readings');
  }
  goToReprintOr() {
    this.auditLogs
      .buttonClicked('Reprint OR Button', this.userId)
      .subscribe((a) => {});
    this.router.navigateByUrl('reprintor');
  }
  goToReprintTicket() {
    this.auditLogs
      .buttonClicked('Reprint Ticket Button', this.userId)
      .subscribe((a) => {});
    this.router.navigateByUrl('reprintticket');
  }
  goToReprintReadings() {
    this.auditLogs
      .buttonClicked('Reprint Readings Button', this.userId)
      .subscribe((a) => {});
    this.router.navigateByUrl('reprintreadings');
  }

  issueTicketAccess: boolean = false;
  issueORAccess: boolean = false;
  readingAccess: boolean = false;
  reprintORAccess: boolean = false;
  reprintReadingAccess: boolean = false;
  reprintTicketAccess: boolean = false;

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

    const userAccessStr = localStorage.getItem('userAccess');
    if (userAccessStr) {
      const userAccess = JSON.parse(userAccessStr) as UserAccessMatrix[];
      console.log(userAccess);
      this.issueTicketAccess = userAccess.some(
        (a) => a.code === 'HHPOSIT' && a.canAccess
      );
      this.issueORAccess = userAccess.some(
        (a) => a.code === 'HHPOSIOR' && a.canAccess
      );
      this.readingAccess = userAccess.some(
        (a) => a.code === 'HHPOSREADING' && a.canAccess
      );
      this.reprintORAccess = userAccess.some(
        (a) => a.code === 'HHPOSROR' && a.canAccess
      );
      this.reprintReadingAccess = userAccess.some(
        (a) => a.code === 'HHPOSRREAD' && a.canAccess
      );
      this.reprintTicketAccess = userAccess.some(
        (a) => a.code === 'HHPOSRT' && a.canAccess
      );
    }
  }
}
