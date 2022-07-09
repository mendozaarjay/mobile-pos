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
  {
    path: 'readings',
    loadChildren: () => import('./readings/readings.module').then( m => m.ReadingsPageModule)
  },
  {
    path: 'xreading',
    loadChildren: () => import('./xreading/xreading.module').then( m => m.XreadingPageModule)
  },
  {
    path: 'yreading',
    loadChildren: () => import('./yreading/yreading.module').then( m => m.YreadingPageModule)
  },
  {
    path: 'zreading',
    loadChildren: () => import('./zreading/zreading.module').then( m => m.ZreadingPageModule)
  },
  {
    path: 'tenderdeclaration',
    loadChildren: () => import('./tenderdeclaration/tenderdeclaration.module').then( m => m.TenderdeclarationPageModule)
  },
  {
    path: 'changefund',
    loadChildren: () => import('./changefund/changefund.module').then( m => m.ChangefundPageModule)
  },  {
    path: 'reprintor',
    loadChildren: () => import('./reprintor/reprintor.module').then( m => m.ReprintorPageModule)
  },




];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
