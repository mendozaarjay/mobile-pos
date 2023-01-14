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
      .buttonClicked('X Reading Button')
      .subscribe((a) => {});
    this.router.navigateByUrl('xreading');
  }
  gotoYReading() {
    this.auditLogs
      .buttonClicked('Y Reading Button')
      .subscribe((a) => {});
    this.router.navigateByUrl('yreading');
  }
  gotoZReading() {
    this.auditLogs
      .buttonClicked('Z Reading Button')
      .subscribe((a) => {});
    this.router.navigateByUrl('zreading');
  }
}
