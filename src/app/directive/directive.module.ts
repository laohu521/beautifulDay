/**
 * 指令Module
 */
import { NgModule } from '@angular/core';
import {ValidatorModule} from "./validator/validator.module";
import {ImageModule} from "./image/image.module";
import {DisableModule} from "./disable/disable.module";

@NgModule({
  imports:[
    ValidatorModule,
    ImageModule,
    DisableModule
  ],
  declarations: [],
  exports: [
    ValidatorModule,
    ImageModule,
    DisableModule
  ]
})
export class DirectiveModule {}
