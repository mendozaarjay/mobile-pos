import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TicketprinterPageRoutingModule } from './ticketprinter-routing.module';

import { TicketprinterPage } from './ticketprinter.page';
import { StarPRNT } from '@awesome-cordova-plugins/star-prnt/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TicketprinterPageRoutingModule
  ],
  providers: [StarPRNT],
  declarations: [TicketprinterPage]
})
export class TicketprinterPageModule {}
