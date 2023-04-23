import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReadingsPageRoutingModule } from './readings-routing.module';

import { ReadingsPage } from './readings.page';
import { StatusComponentModule } from '../components/status/status.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReadingsPageRoutingModule,
    StatusComponentModule,
  ],
  declarations: [ReadingsPage],
})
export class ReadingsPageModule {}
