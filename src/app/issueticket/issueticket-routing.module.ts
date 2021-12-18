import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IssueticketPage } from './issueticket.page';

const routes: Routes = [
  {
    path: '',
    component: IssueticketPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IssueticketPageRoutingModule {}
