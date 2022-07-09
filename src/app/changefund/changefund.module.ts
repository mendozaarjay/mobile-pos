import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChangefundPageRoutingModule } from './changefund-routing.module';

import { ChangefundPage } from './changefund.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChangefundPageRoutingModule
  ],
  declarations: [ChangefundPage]
})
export class ChangefundPageModule {}
