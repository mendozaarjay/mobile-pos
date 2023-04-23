import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { YreadingPageRoutingModule } from './yreading-routing.module';

import { YreadingPage } from './yreading.page';
import { HttpClientModule } from '@angular/common/http';
import { StatusComponentModule } from '../components/status/status.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    YreadingPageRoutingModule,
    HttpClientModule,
    StatusComponentModule
  ],
  declarations: [YreadingPage]
})
export class YreadingPageModule {}
