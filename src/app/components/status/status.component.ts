/* eslint-disable @typescript-eslint/member-ordering */
import { Component, OnInit } from '@angular/core';
import { StatusService } from 'src/app/services/status.service';
import { IonicModule } from '@ionic/angular'; // import IonicModule
import { NgModule } from '@angular/core';
import { Constants } from 'src/app/config/constants';
@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss'],
})
export class StatusComponent implements OnInit {
  constructor(
    private statusService: StatusService,
    private constants: Constants
  ) {}
  statusText = 'Offline';
  statusColor = 'medium';
  gateName = '';
  version = '';
  ngOnInit() {
    this.gateName = this.constants.gateName;
    this.version = this.constants.version;
    this.checkApiStatus();
  }
  checkApiStatus() {
    this.statusService.checkApiStatus().subscribe(
      (status) => {
        if (status) {
          this.statusText = 'Online';
          this.statusColor = 'success';
        } else {
          this.statusText = 'Offline';
          this.statusColor = 'medium';
        }
      },
      (error) => {
        console.log('Error checking API status:', error);
        this.statusText = 'Offline';
        this.statusColor = 'medium';
      }
    );
  }
  handleRefresh(event) {
    this.checkApiStatus();
  }
}
@NgModule({
  imports: [IonicModule],
  declarations: [StatusComponent],
  exports: [StatusComponent],
})
export class StatusComponentModule {}
