import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IssueorPageRoutingModule } from './issueor-routing.module';

import { IssueorPage } from './issueor.page';
import { HttpClientModule } from '@angular/common/http';
import { StatusComponentModule } from '../components/status/status.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IssueorPageRoutingModule,
    HttpClientModule,
    StatusComponentModule,
  ],
  declarations: [IssueorPage],
})
export class IssueorPageModule {}
