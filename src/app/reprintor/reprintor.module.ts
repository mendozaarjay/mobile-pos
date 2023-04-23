import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReprintorPageRoutingModule } from './reprintor-routing.module';

import { ReprintorPage } from './reprintor.page';
import { HttpClientModule } from '@angular/common/http';
import { Constants } from '../config/constants';
import { Printer, PrintOptions } from '@awesome-cordova-plugins/printer/ngx';
import { Device } from '@ionic-native/device/ngx';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { StatusComponentModule } from '../components/status/status.component';
@NgModule({
  imports: [
    HttpClientModule,
    CommonModule,
    FormsModule,
    IonicModule,
    ReprintorPageRoutingModule,
    StatusComponentModule
  ],
  providers: [Printer, Device, BluetoothSerial],
  declarations: [ReprintorPage]
})
export class ReprintorPageModule {}
