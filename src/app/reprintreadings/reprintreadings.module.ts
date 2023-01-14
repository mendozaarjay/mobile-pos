import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReprintreadingsPageRoutingModule } from './reprintreadings-routing.module';

import { ReprintreadingsPage } from './reprintreadings.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReprintreadingsPageRoutingModule
  ],
  declarations: [ReprintreadingsPage]
})
export class ReprintreadingsPageModule {}
