import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChangefundPage } from './changefund.page';

const routes: Routes = [
  {
    path: '',
    component: ChangefundPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChangefundPageRoutingModule {}
