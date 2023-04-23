import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReprintticketPageRoutingModule } from './reprintticket-routing.module';

import { ReprintticketPage } from './reprintticket.page';
import { StatusComponentModule } from '../components/status/status.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReprintticketPageRoutingModule,
    StatusComponentModule,
  ],
  declarations: [ReprintticketPage],
})
export class ReprintticketPageModule {}
