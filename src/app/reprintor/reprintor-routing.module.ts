import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReprintorPage } from './reprintor.page';

const routes: Routes = [
  {
    path: '',
    component: ReprintorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReprintorPageRoutingModule {}
