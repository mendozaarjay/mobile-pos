import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Printer, PrintOptions } from '@ionic-native/printer/ngx';
import { LoadingController } from '@ionic/angular';
import { Constants } from '../config/constants';
import { Router } from '@angular/router';
import { AuditLogService } from '../services/audit-log.service';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnInit {
  username = '';
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
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait while shifting out.....',
      duration: 2000,
    });

    await loading.present();
    const baseUrl =
      this.constant.baseUrl +
      '/ticket/signout?userid=' +
      this.constant.userId +
      '&gateid=' +
      this.constant.gateId;

    this.httpClient.get<any>(baseUrl).subscribe((readingdata) => {});
    this.auditLogs.userLogOut().subscribe((a) => {});
    this.checkTenderDeclaration();
  }
  async checkTenderDeclaration() {
    const baseUrl =
      this.constant.baseUrl +
      '/ticket/checktenderdeclaration?id=' +
      this.constant.userId +
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
    this.auditLogs.buttonClicked('Issue Ticket Button').subscribe((a) => {});
    this.router.navigateByUrl('issueticket');
  }
  goToIssueOR() {
    this.auditLogs
      .buttonClicked('Issue Official Receipt Button')
      .subscribe((a) => {});
    this.router.navigateByUrl('issueor');
  }
  goToReadings() {
    this.auditLogs.buttonClicked('Readings Button').subscribe((a) => {});
    this.router.navigateByUrl('readings');
  }
  goToReprintOr() {
    this.auditLogs.buttonClicked('Reprint OR Button').subscribe((a) => {});
    this.router.navigateByUrl('reprintor');
  }
  goToReprintTicket() {
    this.auditLogs.buttonClicked('Reprint Ticket Button').subscribe((a) => {});
    this.router.navigateByUrl('reprintticket');
  }
  goToReprintReadings() {
    this.auditLogs
      .buttonClicked('Reprint Readings Button')
      .subscribe((a) => {});
    this.router.navigateByUrl('reprintreadings');
  }
  ionViewWillEnter() {
    this.username = this.constant.username;
  }
}
