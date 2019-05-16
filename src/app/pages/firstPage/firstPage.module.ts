import { NgModule } from '@angular/core';
import {NgZorroAntdModule} from "ng-zorro-antd";
import {SharedModule} from "../../shared/shared.module";
import {FirstPageRoutes} from "./firstPage.routes";
import {FirstPage} from "./firstPage";
import {ValidatorModule} from "../../directive/validator/validator.module";


@NgModule({
  imports: [
    SharedModule,
    FirstPageRoutes,
    NgZorroAntdModule,
    ValidatorModule
  ],
  declarations: [
    FirstPage,

  ],
  entryComponents: [

  ]
})
export class FirstPageModule { }
