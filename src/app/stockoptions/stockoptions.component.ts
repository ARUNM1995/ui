import { Component, OnInit, ViewEncapsulation, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AppSettings } from '../app.settings';
import { Settings } from '../app.settings.model';
import { NgxpopperComponent } from 'app/ui-tour/ngxpopper/ngxpopper.component';

@Component({
  selector: 'app-stockoptions',
  templateUrl: './stockoptions.component.html',
  styleUrls: ['./stockoptions.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class StockoptionsComponent implements OnInit {
/*
  public showMenu:boolean = false;
  public showSetting:boolean = false;
  public menus = ['vertical', 'horizontal'];
 //public menus = ['vertical'];
  public menuOption:string;
 // public menuTypes = ['default', 'compact', 'mini'];
 public menuTypes = ['compact', 'mini'];
  public menuTypeOption:string;
  
  public settings: Settings;
    constructor(public appSettings:AppSettings, public router:Router,private tour:NgxpopperComponent){        
        this.settings = this.appSettings.settings; 
        if(sessionStorage["skin"]) {
            //this.settings.theme.skin = sessionStorage["skin"];
            this.settings.theme.skin = "grey";
        }     

        
    }
    ngOnInit() {  
      if(window.innerWidth <= 768){
          this.settings.theme.showMenu = false;
          this.settings.theme.sideChatIsHoverable = false;
      }
      this.showMenu = this.settings.theme.showMenu;
      this.menuOption = this.settings.theme.menu;
     // this.menuTypeOption = this.settings.theme.menuType;
      this.menuTypeOption ="compact";
      this.settings.theme.menuType="compact";
      this.router.navigate(['stockoptions/mygrants']);           
    }

 
    public chooseMenu(menu){
        this.settings.theme.menu = menu; 
        this.router.navigate(['/stockoptions/mygrants/']);      
    }

    public chooseMenuType(menuType){
        this.settings.theme.menuType = menuType;
        if(menuType=='mini'){
            jQuery('.menu-item-link').tooltip('enable');
        }else{
            jQuery('.menu-item-link').tooltip('disable');
        }
    }

    public changeTheme(theme){
        this.settings.theme.skin = theme;
        sessionStorage["skin"] = theme;        
    }

    @HostListener('window:resize')
    public onWindowResize():void {
            let showMenu= !this._showMenu();
            if (this.showMenu !== showMenu) {  
                this.showMenuStateChange(showMenu);
            }
            this.showMenu = showMenu;
    }

    public showMenuStateChange(showMenu:boolean):void {
        this.settings.theme.showMenu = showMenu; 
    }

    private _showMenu():boolean {
        return window.innerWidth <= 768;
    }

    */

public showMenu:boolean = false;
public showSetting:boolean = false;
public menus = ['vertical'];
public menuOption:string;
public menuTypes = ['compact', 'mini'];
public menuTypeOption:string;

public settings: Settings;
constructor(public appSettings:AppSettings, public router:Router){        
    this.settings = this.appSettings.settings; 
    if(sessionStorage["skin"]) {
        this.settings.theme.skin = sessionStorage["skin"];
    }     
}

ngOnInit() {        
    if(window.innerWidth <= 768){
        this.settings.theme.showMenu = false;
        this.settings.theme.sideChatIsHoverable = false;
    }
    this.showMenu = this.settings.theme.showMenu;
    this.settings.theme.menuType="compact"
    this.menuOption = this.settings.theme.menu;
    this.menuTypeOption = this.settings.theme.menuType;     
      
}

public chooseMenu(menu){
    this.settings.theme.menu = menu; 
    this.router.navigate(['/stockoptions/mygrants/']);    
}

public chooseMenuType(menuType){
    this.settings.theme.menuType = menuType;
    if(menuType=='mini'){
        jQuery('.menu-item-link').tooltip('enable');
    }else{
        jQuery('.menu-item-link').tooltip('disable');
    }
}

public changeTheme(theme){
    this.settings.theme.skin = theme;
    sessionStorage["skin"] = theme;        
}

ngAfterViewInit(){
    //document.getElementById('preloader').classList.add('hide');
}


@HostListener('window:resize')
public onWindowResize():void {
    let showMenu= !this._showMenu();
      
    if (this.showMenu !== showMenu) {
        this.showMenuStateChange(showMenu);
    }
    this.showMenu = showMenu;
}

public showMenuStateChange(showMenu:boolean):void {
    this.settings.theme.showMenu = showMenu;
}

private _showMenu():boolean {
    return window.innerWidth <= 768;
}

}
