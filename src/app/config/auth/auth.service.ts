import { HttpClient } from '@angular/common/http';
import { Router, RoutesRecognized } from '@angular/router';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
//import { ToastrService, Toast } from 'ngx-toastr';
import {JwtHelperService} from '@auth0/angular-jwt';

const TOKEN_KEY = 'AuthToken';
const USER_ID = "UserId"

// const ROLES = {
//   'ADMIN': 'ADMIN',
//   'A': 'admin',
//   'HM': 'interviewer',
//   'TAT': 'interview-schedule',
//   'TM': 'interview-schedule',

// }

import decode from 'jwt-decode';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  loginUrl = "/esop/token/generate-token"

  public redirectUrl: string;

  constructor( public http: HttpClient, public jwtHelper: JwtHelperService, private router: Router) { }


  getAuthorizationToken() {

    return sessionStorage.getItem(TOKEN_KEY);
  }

  signOut() {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.clear();
  }

  public saveAuthorizationToken(token: string) {

    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.setItem(TOKEN_KEY, token);
  }



  public isAuthenticated(): boolean {
    let token = this.getAuthorizationToken();
    return !this.jwtHelper.isTokenExpired(token);
  }



/* login with credentials */
  login(credentials) {

    this.http.post<any>("/esop/token/genarateCommonSecurityToken", credentials).subscribe(token => {

            this.saveAuthorizationToken(token.token);
           // this.savedLoggedInUserId(credentials.username);
            const roles= this.getUserRoles();
         
            if (roles.length == 0) {
              this.router.navigate(['error']);
            } else {
              this.router.navigate(["/stockoptions/mygrants/"]);
            }
     
     
    },
      err => {
       // console.log(err);
        if (err.status === 504) {
          return;
        }
        this.router.navigate(['login']);
      }

    );
  }
/*
  loginWithIntranet(token){
 
      this.saveAuthorizationToken(token);
      const roles= this.getUserRoles();
      
      if (roles.length == 0) {
        this.router.navigate(['error']);
      } else {
        this.router.navigate(["/stockoptions/mygrants/"]);
      }
   
    
  }
*/

loginWithIntranet(authToken){
  this.http.post<any>("/esop/token/authCheck", authToken).subscribe(token => {

    this.saveAuthorizationToken(token.token);
   // this.savedLoggedInUserId(credentials.username);
    const roles= this.getUserRoles();
 
    if (roles.length == 0) {
      this.router.navigate(['error']);
    } else {
      this.router.navigate(["/stockoptions/mygrants/"]);
    }


},
err => {
// console.log(err);
if (err.status === 504) {
  return;
}
this.router.navigate(['error']);
}

);
}
  getUserRoles(){
    const tokenPayload = decode( this.getAuthorizationToken());
    return tokenPayload.Role.map(a => a['authority']);
  }

  savedLoggedInUserId(userId) {
    sessionStorage.removeItem(USER_ID);
    sessionStorage.setItem(USER_ID, userId);
  }

  getLoggedInUserId() {
    return sessionStorage.getItem(USER_ID);
  }

  authCheck(intranetCredentials){
      console.log(intranetCredentials.username);
        return this.http.post("/esop/token/genarateCommonSecurityToken",intranetCredentials);
  }

}
