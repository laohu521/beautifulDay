import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },{
    path: 'firstPage',
    loadChildren: 'app/pages/firstPage/firstPage.module#FirstPageModule'
  },{
    path: 'dashboard',
    loadChildren: 'app/pages/dashboard/dashboard.module#DashboardModule'
  }, {
    path:'**',
    redirectTo:'firstPage'
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, { useHash: true }) ],
  exports: [ RouterModule ]
})
export class AppRoutesModule {}
