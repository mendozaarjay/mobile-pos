import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChangefundPageRoutingModule } from './changefund-routing.module';

import { ChangefundPage } from './changefund.page';
import { Constants } from '../config/constants';
import { Printer, PrintOptions } from '@awesome-cordova-plugins/printer/ngx';
import { Device } from '@ionic-native/device/ngx';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { StatusComponentModule } from '../components/status/status.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChangefundPageRoutingModule,
    StatusComponentModule,
  ],
  providers: [Printer, Device, BluetoothSerial],
  declarations: [ChangefundPage],
})
export class ChangefundPageModule {}
