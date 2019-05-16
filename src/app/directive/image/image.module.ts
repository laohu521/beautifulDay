/**
 * 图片指令Module
 */
import { NgModule } from '@angular/core';
import {DeletePictureDirective, SelectPictureDirective} from "./image.directive";

@NgModule({
  declarations: [
    SelectPictureDirective,
    DeletePictureDirective
  ],
  exports: [
    SelectPictureDirective,
    DeletePictureDirective
  ]
})
export class ImageModule {}
