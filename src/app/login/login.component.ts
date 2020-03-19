import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'app/config/auth/auth.service';
import { ImpersonationService } from 'app/service/impersonation.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {
  private router: Router;
  form = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });
  constructor(private authService: AuthService, router: Router, private service: ImpersonationService, private activatedRoute: ActivatedRoute) {
    this.router = router;
  }

  ngOnInit() {
  }
  emp;

  public onSubmit(form): void {
    this.authService.login(form.value);
   // this.authService.loginWithIntranet("eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMDE4NTk5IiwiUm9sZXMiOiJVU0VSIiwiaWF0IjoxNTgwODg0MDY3LCJleHAiOjE1ODA5MjAwNjd9.HbIUJJmDhQUQ6n2Gz04Wa8BRlyR5GUl6vF0PpIt-nEo");
    //  console.log(form.value.username);

   
   
   
  }

}
