import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { XreadingPageRoutingModule } from './xreading-routing.module';

import { XreadingPage } from './xreading.page';
import { HttpClientModule } from '@angular/common/http';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    XreadingPageRoutingModule,
    HttpClientModule
  ],
  declarations: [XreadingPage]
})
export class XreadingPageModule {}
