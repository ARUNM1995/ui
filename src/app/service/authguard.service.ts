import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ImpersonationService } from './impersonation.service';

@Injectable({
  providedIn: 'root'
})
export class AuthguardService implements CanActivate {

    constructor(private router:Router,private impersonation:ImpersonationService) { }

        canActivate(){
          if(this.impersonation.isLoggedIn()) return true;
            this.router.navigate(['/']);
            return false;
        }
}
