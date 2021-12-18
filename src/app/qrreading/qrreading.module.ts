import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QrreadingPageRoutingModule } from './qrreading-routing.module';

import { QrreadingPage } from './qrreading.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QrreadingPageRoutingModule
  ],
  declarations: [QrreadingPage]
})
export class QrreadingPageModule {}
