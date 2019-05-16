import { NgModule } from '@angular/core';
import { Dashboard } from "./dashboard";
import { DashboardRoutes } from "./dashboard.routes";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { SharedModule } from "../../shared/shared.module";
import { AuthService } from "../../providers/auth.service";

@NgModule({
  imports: [
    SharedModule,
    DashboardRoutes,
    NgZorroAntdModule
  ],
  declarations: [
    Dashboard
  ],
  entryComponents: [
  ],
  providers: [
    AuthService
  ]
})
export class DashboardModule { }
