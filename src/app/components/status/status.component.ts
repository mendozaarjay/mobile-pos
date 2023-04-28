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
    let overlay: HTMLDivElement = document.querySelector('.page-overlay');
    this.statusService.checkApiStatus().subscribe(
      (status) => {
        if (status) {
          this.statusText = 'Online';
          this.statusColor = 'success';
          if (overlay) {
            overlay.remove(); // Use stored reference to remove overlay element
            overlay = undefined; // Reset overlay reference
          }
        } else {
          if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'page-overlay'; // Add class to overlay element
            overlay.style.position = 'fixed';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            overlay.style.zIndex = '9999';
            document.body.appendChild(overlay);
          }

          this.statusText = 'Offline';
          this.statusColor = 'medium';
        }
      },
      (error) => {
        console.log('Error checking API status:', error);
        this.statusText = 'Offline';
        this.statusColor = 'medium';
        if (!overlay) {
          overlay = document.createElement('div');
          overlay.className = 'page-overlay'; // Add class to overlay element
          overlay.style.position = 'fixed';
          overlay.style.top = '0';
          overlay.style.left = '0';
          overlay.style.width = '100%';
          overlay.style.height = '100%';
          overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
          overlay.style.zIndex = '9999';
          document.body.appendChild(overlay);
        }
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
