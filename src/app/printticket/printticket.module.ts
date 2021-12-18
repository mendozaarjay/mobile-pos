import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PrintticketPageRoutingModule } from './printticket-routing.module';

import { PrintticketPage } from './printticket.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PrintticketPageRoutingModule
  ],
  declarations: [PrintticketPage]
})
export class PrintticketPageModule {}
