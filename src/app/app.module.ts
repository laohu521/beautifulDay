import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import {AppRoutesModule} from "./app.routes";
import { HttpClientModule } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import {NgZorroAntdModule, NZ_MESSAGE_CONFIG,  NZ_I18N, zh_CN} from "ng-zorro-antd";
import {HashLocationStrategy, LocationStrategy} from "@angular/common";

registerLocaleData(zh);

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRoutesModule,
    HttpClientModule,
    NgZorroAntdModule
  ],
  providers: [
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    { provide: NZ_MESSAGE_CONFIG, useValue: { nzDuration: 3000 } },
    { provide: NZ_I18N, useValue: zh_CN }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
