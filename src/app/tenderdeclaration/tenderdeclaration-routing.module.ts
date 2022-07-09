import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TenderdeclarationPage } from './tenderdeclaration.page';

const routes: Routes = [
  {
    path: '',
    component: TenderdeclarationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TenderdeclarationPageRoutingModule {}
