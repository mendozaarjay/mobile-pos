import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { XreadingPage } from './xreading.page';

const routes: Routes = [
  {
    path: '',
    component: XreadingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class XreadingPageRoutingModule {}
