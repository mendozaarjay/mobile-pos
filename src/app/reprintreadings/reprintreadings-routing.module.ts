import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReprintreadingsPage } from './reprintreadings.page';

const routes: Routes = [
  {
    path: '',
    component: ReprintreadingsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReprintreadingsPageRoutingModule {}
