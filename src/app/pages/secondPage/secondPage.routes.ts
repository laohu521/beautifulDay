import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SecondPage} from "./secondPage";

const routes: Routes = [{
  path: '',
  component: SecondPage
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecondPageRoutes {}
