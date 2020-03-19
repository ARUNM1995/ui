import { NgxpopperComponent } from 'app/ui-tour/ngxpopper/ngxpopper.component';
import { EditallocationComponent } from './editallocation/editallocation.component';
import { AuthguardService } from 'app/service/authguard.service';
import { ImpersonationService } from './../service/impersonation.service';
import { AllocateComponent } from './allocate/allocate.component';
import { MygrantsComponent } from './mygrants/mygrants.component';
import { StockoptionsComponent } from './stockoptions.component';
import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { GrantsComponent } from './grants/grants.component';
import { NomineesComponent } from './nominees/nominees.component';
import { ReportComponent } from './report/report.component';
import { EditmygrantComponent } from './editmygrant/editmygrant.component';
import { MonitizationComponent } from './monitization/monitization.component';
import { VestingComponent } from './vesting/vesting.component';
import { LockinComponent } from './lockin/lockin.component';
import { RescindComponent } from './rescind/rescind.component';
export const routes: Routes = [
    {path:'',
    component:StockoptionsComponent,
   // canActivate:[AuthguardService],
    children:[
             {path:'mygrants',component:MygrantsComponent,data:{preload:false}}, 
             {path:'grants',component:GrantsComponent,data:{preload:false}}, 
             {path:'allocate',component:AllocateComponent,data:{preload:false}}, 
             {path:'nominies',component:NomineesComponent,data:{preload:false}}, 
             {path:'reports',component:ReportComponent,data:{preload:false}}, 
             {path:'editmygrnat',component:EditmygrantComponent,data:{preload:false}},
             {path:'editallocate',component:EditallocationComponent,data:{preload:false}},
             {path:'uitour',component:NgxpopperComponent,data:{preload:false}},
             {path:'monitization',component:MonitizationComponent,data:{preload:false}},
             {path:'vesting',component:VestingComponent,data:{preload:false}},
             {path:'lockin',component:LockinComponent,data:{preload:false}},
             {path:'rescind',component:RescindComponent,data:{preload:false}}
    ]
    },
    
  
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);