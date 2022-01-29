import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'qrreading',
    loadChildren: () => import('./qrreading/qrreading.module').then( m => m.QrreadingPageModule)
  },
  {
    path: 'issueor',
    loadChildren: () => import('./issueor/issueor.module').then( m => m.IssueorPageModule)
  },
  {
    path: 'blacklist',
    loadChildren: () => import('./blacklist/blacklist.module').then( m => m.BlacklistPageModule)
  },
  {
    path: 'issueticket',
    loadChildren: () => import('./issueticket/issueticket.module').then( m => m.IssueticketPageModule)
  },
  {
    path: 'ticketprinter',
    loadChildren: () => import('./ticketprinter/ticketprinter.module').then( m => m.TicketprinterPageModule)
  },


];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
