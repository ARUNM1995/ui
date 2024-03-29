import { AppSettings } from 'app/app.settings';
import { Component, OnInit, ViewEncapsulation, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MenuService } from '../menu/menu.service';
import { Settings } from 'app/app.settings.model';
import { AuthService } from 'app/config/auth/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [MenuService]
})
export class SidebarComponent implements OnInit {
  public settings: Settings;
  public menuItems: Array<any>;
  constructor(private authservice: AuthService, public appSettings: AppSettings, public menuService: MenuService, private router: Router) {
    this.settings = this.appSettings.settings;
    this.menuItems = this.menuService.getVerticalMenuItems();
  }
  employee;
  adminRole = false;
  employeeRole = false;
  ngOnInit() {
    this.authservice.getUserRoles().forEach(element => {
      if (element == "EMPLOYEE") {
        this.employeeRole = true;
      }
      if (element == "ADMIN") {
        this.adminRole = true;
      }
    });
    if (sessionStorage["userMenuItems"]) {
      let ids = JSON.parse(sessionStorage.getItem("userMenuItems"));
      let newArr = [];
      ids.forEach(id => {
        let newMenuItem = this.menuItems.filter(mail => mail.id == id);
        newArr.push(newMenuItem[0]);
      });
      this.menuItems = newArr;
    }
  }
  public closeSubMenus() {
    let menu = document.querySelector("#menu0");
    for (let i = 0; i < menu.children.length; i++) {
      let child = menu.children[i].children[1];
      if (child) {
        if (child.classList.contains('show')) {
          child.classList.remove('show');
          menu.children[i].children[0].classList.add('collapsed');
        }
      }
    }
  }


}
