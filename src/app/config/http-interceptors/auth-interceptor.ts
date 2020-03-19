import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse
} from '@angular/common/http';


import 'rxjs/add/operator/do';
import { AuthService } from '../auth/auth.service';
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // Get the auth token from the service.
    const authToken = this.auth.getAuthorizationToken();
    //console.log(authToken);

    const authHeadToken = 'Bearer ' + authToken;

    /*
    * The verbose way:
    // Clone the request and replace the original headers with
    // cloned headers, updated with the authorization.
    const authReq = req.clone({
      headers: req.headers.set('Authorization', authToken)
    });
    */
    // Clone the request and set the new header in one step.
    if (authToken)
      return next.handle(req.clone({ setHeaders: { Authorization: authHeadToken } }));
    else {
      return next.handle(req);
    }
    // send cloned request with header to the next handler.





  }


  // constructor(private token: AuthService, private router: Router) { }



  // intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
  //   console.log("Http Interceptoor");
  //   let tokenizedReq;

  //   if (this.token.getAuthorizationToken()) {
  //     tokenizedReq = req.clone({
  //       setHeaders: {
  //         Authorization: 'Bearer ' + this.token.getAuthorizationToken()
  //       }
  //     })

  //   } else {
  //     tokenizedReq = req.clone({
  //       setHeaders: {
  //         //Authorization:'Bearer ' + this .token.getToken()

  //       }
  //     })
  //   }

  //   console.log('Token is ' + this.token.getAuthorizationToken());


  //   return next.handle(tokenizedReq).do(
  //     (err: any) => {
  //       if (err instanceof HttpErrorResponse) {
  //         if (err.status === 401) {
  //           this.router.navigate(['login'])
  //         }
  //       }
  //     }
  //   )
  // }

}

