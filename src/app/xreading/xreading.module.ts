import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { XreadingPageRoutingModule } from './xreading-routing.module';

import { XreadingPage } from './xreading.page';
import { HttpClientModule } from '@angular/common/http';
import { StatusComponentModule } from '../components/status/status.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    XreadingPageRoutingModule,
    HttpClientModule,
    StatusComponentModule
  ],
  declarations: [XreadingPage]
})
export class XreadingPageModule {}
