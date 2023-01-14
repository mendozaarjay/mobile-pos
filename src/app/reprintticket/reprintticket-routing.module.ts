import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReprintticketPage } from './reprintticket.page';

const routes: Routes = [
  {
    path: '',
    component: ReprintticketPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReprintticketPageRoutingModule {}
