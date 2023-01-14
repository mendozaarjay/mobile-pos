import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QrscannerPageRoutingModule } from './qrscanner-routing.module';

import { QrscannerPage } from './qrscanner.page';
import { IssueorPage } from '../issueor/issueor.page';
@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, QrscannerPageRoutingModule],
  declarations: [QrscannerPage],
  providers: [IssueorPage],
})
export class QrscannerPageModule {}
