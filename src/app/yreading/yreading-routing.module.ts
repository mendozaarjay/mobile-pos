import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { YreadingPage } from './yreading.page';

const routes: Routes = [
  {
    path: '',
    component: YreadingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class YreadingPageRoutingModule {}
