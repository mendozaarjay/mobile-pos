import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TicketprinterPageRoutingModule } from './ticketprinter-routing.module';

import { TicketprinterPage } from './ticketprinter.page';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TicketprinterPageRoutingModule,
  ],
  providers: [BluetoothSerial],
  declarations: [TicketprinterPage],
})
export class TicketprinterPageModule {}
