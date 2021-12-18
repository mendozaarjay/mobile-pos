import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PrintticketPage } from './printticket.page';

const routes: Routes = [
  {
    path: '',
    component: PrintticketPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrintticketPageRoutingModule {}
