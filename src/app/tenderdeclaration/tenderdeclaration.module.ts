import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TenderdeclarationPageRoutingModule } from './tenderdeclaration-routing.module';

import { TenderdeclarationPage } from './tenderdeclaration.page';
import { HttpClientModule } from '@angular/common/http';
import { Constants } from '../config/constants';
import { Printer, PrintOptions } from '@awesome-cordova-plugins/printer/ngx';
import { Device } from '@ionic-native/device/ngx';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';

@NgModule({
  imports: [
    HttpClientModule,
    CommonModule,
    FormsModule,
    IonicModule,
    TenderdeclarationPageRoutingModule,
  ],
  providers: [Printer, Device, BluetoothSerial],
  declarations: [TenderdeclarationPage],
})
export class TenderdeclarationPageModule {}
