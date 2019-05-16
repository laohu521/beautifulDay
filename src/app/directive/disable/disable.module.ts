/**
 * html 属性指令Module
 */
import { NgModule } from '@angular/core';
import {DisableDirective} from "./disable.directive";

@NgModule({
  declarations: [DisableDirective],
  exports: [DisableDirective]
})
export class DisableModule {}
