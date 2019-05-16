import { NgModule } from '@angular/core';
import {NgZorroAntdModule} from "ng-zorro-antd";
import {SharedModule} from "../../shared/shared.module";
import {ThirdPageRoutes} from "./thirdPage.routes";
import {ThirdPage} from "./thirdPage";
import {ValidatorModule} from "../../directive/validator/validator.module";


@NgModule({
  imports: [
    SharedModule,
    ThirdPageRoutes,
    NgZorroAntdModule,
    ValidatorModule
  ],
  declarations: [
    ThirdPage,

  ],
  entryComponents: [

  ]
})
export class ThirdPageModule { }
