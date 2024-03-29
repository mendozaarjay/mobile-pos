import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { Tab1PageRoutingModule } from './tab1-routing.module';
import { Printer } from '@ionic-native/printer/ngx';
import { HttpClientModule } from '@angular/common/http';
import { StatusComponentModule } from '../components/status/status.component';
@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    Tab1PageRoutingModule,
    HttpClientModule,
    StatusComponentModule,
  ],
  providers: [Printer],
  declarations: [Tab1Page],
})
export class Tab1PageModule {}
