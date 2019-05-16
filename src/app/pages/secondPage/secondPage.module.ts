import { NgModule } from '@angular/core';
import {NgZorroAntdModule} from "ng-zorro-antd";
import {SharedModule} from "../../shared/shared.module";
import {SecondPageRoutes} from "./secondPage.routes";
import {SecondPage} from "./secondPage";
import {ValidatorModule} from "../../directive/validator/validator.module";


@NgModule({
  imports: [
    SharedModule,
    SecondPageRoutes,
    NgZorroAntdModule,
    ValidatorModule
  ],
  declarations: [
    SecondPage,

  ],
  entryComponents: [

  ]
})
export class SecondPageModule { }
