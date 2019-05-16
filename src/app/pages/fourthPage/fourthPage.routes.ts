import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {FourthPage} from "./fourthPage";

const routes: Routes = [{
  path: '',
  component: FourthPage
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FourthPageRoutes {}
