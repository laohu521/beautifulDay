import { NgModule } from '@angular/core';
import {NgZorroAntdModule} from "ng-zorro-antd";
import {SharedModule} from "../../shared/shared.module";
import {FourthPageRoutes} from "./fourthPage.routes";
import {FourthPage} from "./fourthPage";
import {ValidatorModule} from "../../directive/validator/validator.module";


@NgModule({
  imports: [
    SharedModule,
    FourthPageRoutes,
    NgZorroAntdModule,
    ValidatorModule
  ],
  declarations: [
    FourthPage,

  ],
  entryComponents: [

  ]
})
export class FourthPageModule { }
