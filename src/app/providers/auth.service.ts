import { Injectable,Inject } from '@angular/core';
import { Router,ActivatedRouteSnapshot, RouterStateSnapshot }    from '@angular/router';

/**
 * 路由守卫
 */
@Injectable()
export class AuthService {

  constructor(private router: Router,@Inject('utilsService') private utilsService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let url: string = state.url;
    if(!this.checkLogin()){
      this.router.navigate(['/']);
      return false;
    }
    return this.checkLogin();
  }

  /**
   * 判断登录
   * @returns {boolean}
   */
  checkLogin(): boolean {
    return this.utilsService.isLogin();
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(route, state);
  }
}
