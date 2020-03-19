import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild, CanLoad, Route, NavigationExtras } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard  implements CanActivate, CanActivateChild, CanLoad {


 constructor(private _location:Location, private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let url: string = state.url;

    return this.checkLogin(url);
  }
  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(route, state);
  }

  canLoad(route: Route): boolean {
    let url = `/${route.path}`;

    return this.checkLogin(url);
  }


  checkLogin(url: string): boolean {
    if (this.authService.isAuthenticated()) { return true; }
    this.authService.redirectUrl = url;
    this.router.navigate(['/login']);
    return false;
  }





}
