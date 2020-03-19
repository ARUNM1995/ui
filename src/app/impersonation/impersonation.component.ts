import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ImpersonationService } from 'app/service/impersonation.service';
import { AuthService } from 'app/config/auth/auth.service';


@Component({
  selector: 'app-impersonation',
  templateUrl: './impersonation.component.html',
  styleUrls: ['./impersonation.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ImpersonationComponent implements OnInit {

  private router: Router;
  form = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  constructor(private authService: AuthService,
    router: Router,
    private service: ImpersonationService,
    private activatedRoute: ActivatedRoute) {
    this.router = router;
  }

  emp;

  public onSubmit(form): void {
    this.authService.login(form.value);
  }

  ngOnInit() {
   // this.loginHandler();
   this.loginValidate();
  }

  loginHandler() {
    let authToken = this.activatedRoute.snapshot.queryParams.authKey;
   // this.authService.loginWithIntranet(authToken);
/*
    this.activatedRoute.queryParams.subscribe(resp => {
      console.log(resp.authKey);
      this.authService.loginWithIntranet(resp.authKey);
    })
*/
  }

  loginValidate(){
           let token=this.activatedRoute.snapshot.queryParams.authToken;
           this.authService.loginWithIntranet(token);
  }
  
}
