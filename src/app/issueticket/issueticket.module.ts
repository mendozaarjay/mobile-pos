import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { IssueticketPageRoutingModule } from './issueticket-routing.module';
import { IssueticketPage } from './issueticket.page';
import { HttpClientModule } from '@angular/common/http';
import { Constants } from '../config/constants';
import { Printer, PrintOptions } from '@awesome-cordova-plugins/printer/ngx';
import { Device } from '@ionic-native/device/ngx';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IssueticketPageRoutingModule,
    HttpClientModule,
  ],
  providers: [Printer,Device,BluetoothSerial],
  declarations: [IssueticketPage],
})
export class IssueticketPageModule {}
