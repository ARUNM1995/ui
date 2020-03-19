import { Routes, RouterModule, PreloadAllModules  } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { ImpersonationComponent } from './impersonation/impersonation.component';
import { ErrorComponent } from './error/error.component';
import { LogoutComponent } from './logout/logout.component';
import { SelectivePreloadingStrategyService } from './config/selective-preloading-strategy.service';
import { LoginComponent } from './login/login.component';






export const routes: Routes = [
      { path:'superadmin',component:LoginComponent},
      { path: 'stockoptions', loadChildren: 'app/stockoptions/stockoptions.module#StockOptionsModule',data:{preload:false} },
      { path:'error',component:ErrorComponent},
      { path:'login',component:ImpersonationComponent},
      { path:'logout',component:LogoutComponent},
       
    ];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, {
    preloadingStrategy: SelectivePreloadingStrategyService,
    useHash:true
});