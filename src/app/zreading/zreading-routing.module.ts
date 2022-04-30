import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ZreadingPage } from './zreading.page';

const routes: Routes = [
  {
    path: '',
    component: ZreadingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ZreadingPageRoutingModule {}
