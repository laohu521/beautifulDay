import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import {HttpClientModule} from "@angular/common/http";
import {HttpService} from "../providers/http.service";
import {UtilsService} from "../providers/utils.service";
import {WebSocketService} from "../providers/socket.service";

/**
 * 公共module，其它module只需导入shared.module
 */
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [
    { provide: 'httpService', useClass: HttpService },
    { provide: 'utilsService', useClass: UtilsService },
    { provide: 'webSocketService', useClass: WebSocketService }
  ]
})
export class SharedModule { }
