import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {Dashboard} from "./dashboard";

const routes: Routes = [{
  path: '',
  component: Dashboard,
  children: [{
    path: '',
    redirectTo: 'firstPage',
    pathMatch: 'full'
  },{
    path: 'secondPage',
    loadChildren: 'app/pages/secondPage/secondPage.module#SecondPageModule'
  },{
    path: 'thirdPage',
    loadChildren: 'app/pages/thirdPage/thirdPage.module#ThirdPageModule'
  },{
    path: 'fourthPage',
    loadChildren: 'app/pages/fourthPage/fourthPage.module#FourthPageModule'
  },{
    path: 'firstPage',
    loadChildren: 'app/pages/firstPage/firstPage.module#FirstPageModule'
  }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutes {}
