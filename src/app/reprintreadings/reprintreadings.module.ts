import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReprintreadingsPageRoutingModule } from './reprintreadings-routing.module';

import { ReprintreadingsPage } from './reprintreadings.page';
import { StatusComponentModule } from '../components/status/status.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReprintreadingsPageRoutingModule,
    StatusComponentModule
  ],
  declarations: [ReprintreadingsPage]
})
export class ReprintreadingsPageModule {}
