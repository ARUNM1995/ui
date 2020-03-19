import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot
} from '@angular/router';

import decode from 'jwt-decode';
import { AuthService } from './auth.service';

const Role = 'Role';

@Injectable({
  providedIn: 'root'
})
export class RedirectGuard  implements CanActivate{
  constructor(public auth: AuthService, public router: Router) { }
  canActivate(route: ActivatedRouteSnapshot): boolean {
    const token = this.auth.getAuthorizationToken();
    // decode the token to get its payload
    const tokenPayload = decode(token);

    //-----------
      // if(tokenPayload.Role.length==0){
    //   alert("No role found")
    //   this.router.navigate(['login']);
    //   return true;

    // }
    // else 
    if (this.auth.isAuthenticated() && tokenPayload.Role[0].authority == 'I') {
      sessionStorage.setItem(Role, 'I');
      // let queryParams={
      //   Roles:tokenPayload.Role
      // }
      this.router.navigate(['interviewer']);
      return false;
    }
  }



}
