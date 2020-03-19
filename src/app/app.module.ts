import { CommonModule,HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AuthguardService } from 'app/service/authguard.service';
import { ImpersonationComponent } from './impersonation/impersonation.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { AgmCoreModule } from '@agm/core';
import { CalendarModule } from 'angular-calendar';
import { routing } from './app.routing';
import { AppSettings } from './app.settings';
import { AppComponent } from './app.component';
import { VerticalMenuComponent } from './common/menu/vertical-menu/vertical-menu.component';
import { ImpersonationService } from './service/impersonation.service';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorComponent } from './error/error.component';
import { BacktopComponent } from './common/backtop/backtop.component';
import { ExerciseDetailsModalComponent } from './common/exercise-details-modal/exercise-details-modal.component';
import { LogoutComponent } from './logout/logout.component';
import { AuthInterceptor } from './config/http-interceptors/auth-interceptor';
import {JwtModule} from '@auth0/angular-jwt';
import { MenuService } from './common/menu/menu.service';
import { TourMatMenuModule } from 'ngx-tour-md-menu';
import { LoginComponent } from './login/login.component';
export function tokenGetter() {
  return localStorage.getItem('AuthToken');
  }
@NgModule({
  declarations: [
    AppComponent,
    ImpersonationComponent,
    ErrorComponent ,
    LogoutComponent,
    LoginComponent
    ],
    imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    FormsModule,
    TourMatMenuModule.forRoot(),
    JwtModule.forRoot({
      config: {
      tokenGetter: tokenGetter,
      }
      }),
  
   HttpClientModule,
    ReactiveFormsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDe_oVpi9eRSN99G4o6TwVjJbFBNr58NxE'
    }),
    CalendarModule.forRoot(),
    routing
  ],
  providers: [ AppSettings,
              ImpersonationService,
              AuthguardService ,
             

              { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
          ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
