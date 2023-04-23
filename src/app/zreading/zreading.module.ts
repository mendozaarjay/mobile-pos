import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ZreadingPageRoutingModule } from './zreading-routing.module';

import { ZreadingPage } from './zreading.page';
import { HttpClientModule } from '@angular/common/http';
import { StatusComponentModule } from '../components/status/status.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ZreadingPageRoutingModule,
    HttpClientModule,
    StatusComponentModule,
  ],
  declarations: [ZreadingPage],
})
export class ZreadingPageModule {}
