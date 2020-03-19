import { Component, OnInit, ViewEncapsulation, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { trigger,  state,  style, transition, animate } from '@angular/animations';

import { NgxpopperComponent } from 'app/ui-tour/ngxpopper/ngxpopper.component';

import { Settings } from './../../app.settings.model';
import { AppSettings } from './../../app.settings';


import { ImpersonationService } from 'app/service/impersonation.service';
import { AuthService } from 'app/config/auth/auth.service';
import { ReportsService } from 'app/service/reports.service';
import { MenuService } from '../menu/menu.service';

declare function feedback(divid,empNumb,appNumb):any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None,
  
  animations: [
    trigger('showInfo', [
      state('1' , style({ transform: 'rotate(180deg)' })),
      state('0', style({ transform: 'rotate(0deg)' })),
      transition('1 => 0', animate('400ms')),
      transition('0 => 1', animate('400ms'))
    ])
  ]
})
export class HeaderComponent implements OnInit {
  
  public showHorizontalMenu:boolean = true; 
  public showInfoContent:boolean = false;
  public settings: Settings;
  public menuItems:Array<any>;
  employeeDetails;
       constructor( private report_service:ReportsService,
                    private authService:AuthService,
                    private tour:NgxpopperComponent,
                    public appSettings:AppSettings,
                    private service:ImpersonationService,
                    private router:Router,
                    ) {
                                    this.settings = this.appSettings.settings;
                                   // this.menuItems = this.menuService.getHorizontalMenuItems(); 
  }

      check(divid,event){ 
              event.preventDefault();
              var x=document.getElementById("feedbackModal");   
              if(x===null)
              feedback(divid,this.employeeDetails.employeeNumber,501);      
      }
  
      ngOnInit() {
          this.report_service.getLoggedInEmployee().subscribe(
                resp=>{
                    let data:any=resp;
                    this.employeeDetails=data.currentUser;
                }
          )
              if(window.innerWidth <= 768) 
              this.showHorizontalMenu = false;
      }

      public closeSubMenus(){
              let menu = document.querySelector("#menu0"); 
              if(menu){
                for (let i = 0; i < menu.children.length; i++) {
                    let child = menu.children[i].children[1];
                    if(child){          
                        if(child.classList.contains('show')){            
                          child.classList.remove('show');
                          menu.children[i].children[0].classList.add('collapsed'); 
                        }             
                    }
                }
              }
      }

      @HostListener('window:resize')
      public onWindowResize():void {
        if(window.innerWidth <= 768){
            this.showHorizontalMenu = false;
        }      
          else{
            this.showHorizontalMenu = true;
          }
      }

      logOut(){
        this.service.logOut();
        this.authService.signOut();
        this.router.navigate(['logout']);
      }
      startTour(){
        this.tour.startTour();
      }
}
