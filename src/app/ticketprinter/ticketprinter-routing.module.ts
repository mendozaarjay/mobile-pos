import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TicketprinterPage } from './ticketprinter.page';

const routes: Routes = [
  {
    path: '',
    component: TicketprinterPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TicketprinterPageRoutingModule {}
