import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from 'app/config/auth/auth.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LogoutComponent implements OnInit {

  constructor(private authService:AuthService) { }

  ngOnInit() {
  }

}
