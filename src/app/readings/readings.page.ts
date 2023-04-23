/* eslint-disable @typescript-eslint/member-ordering */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuditLogService } from '../services/audit-log.service';

@Component({
  selector: 'app-readings',
  templateUrl: './readings.page.html',
  styleUrls: ['./readings.page.scss'],
})
export class ReadingsPage implements OnInit {
  constructor(private router: Router, private auditLogs: AuditLogService) {}

  ngOnInit() {}
  gotoXReading() {
    this.auditLogs
      .buttonClicked('X Reading Button', this.userId)
      .subscribe((a) => {});
    this.router.navigateByUrl('xreading');
  }
  gotoYReading() {
    this.auditLogs
      .buttonClicked('Y Reading Button', this.userId)
      .subscribe((a) => {});
    this.router.navigateByUrl('yreading');
  }
  gotoZReading() {
    this.auditLogs
      .buttonClicked('Z Reading Button', this.userId)
      .subscribe((a) => {});
    this.router.navigateByUrl('zreading');
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
