import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {FirstPage} from "./firstPage";

const routes: Routes = [{
  path: '',
  component: FirstPage
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FirstPageRoutes {}
