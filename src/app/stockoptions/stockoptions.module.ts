import { NgModule, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { PipesModule } from '../theme/pipes/pipes.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TourMatMenuModule } from 'ngx-tour-md-menu';
import { MatSlideToggleModule } from '@angular/material';

import { SucessmodalComponent } from './../common/sucessmodal/sucessmodal.component';
import { UpdatewarningComponent } from './../common/updatewarning/updatewarning.component';
import { MygrantsService } from './../service/mygrants.service';
import { WarningmodalComponent } from './../common/warningmodal/warningmodal.component';

import { GrantsService } from './../service/grants.service';
import { AllocateService } from './../service/allocate.service';
import { AuthguardService } from 'app/service/authguard.service';
import { ReportsService } from 'app/service/reports.service';
import { RescindService } from 'app/service/rescind.service';

import { routing } from './stockoptions.routing';
import { StockoptionsComponent } from './stockoptions.component';
import { MygrantsComponent } from './mygrants/mygrants.component';
import { GrantsComponent } from './grants/grants.component';
import { AllocateComponent } from './allocate/allocate.component';
import { ReportComponent } from './report/report.component';
import { NomineesComponent } from './nominees/nominees.component';
import { HeaderComponent } from 'app/common/header/header.component';
import { SidebarComponent } from 'app/common/sidebar/sidebar.component';
import { FooterComponent } from 'app/common/footer/footer.component';
import { VerticalMenuComponent } from 'app/common/menu/vertical-menu/vertical-menu.component';
import { EditmygrantComponent } from './editmygrant/editmygrant.component';
import { EditallocationComponent } from './editallocation/editallocation.component';
import { EditAllocationWarningmodalComponent } from 'app/common/edit-allocation-warningmodal/edit-allocation-warningmodal.component';
import { EditAllocationSucessmodalComponent } from 'app/common/edit-allocation-sucessmodal/edit-allocation-sucessmodal.component';
import { NgxpopperComponent } from 'app/ui-tour/ngxpopper/ngxpopper.component';
import { MonitizationComponent } from './monitization/monitization.component';
import { VestingComponent } from './vesting/vesting.component';
import { LockinComponent } from './lockin/lockin.component';
import { BacktopComponent } from 'app/common/backtop/backtop.component';
import { ExerciseDetailsModalComponent } from 'app/common/exercise-details-modal/exercise-details-modal.component';
import { RescindComponent, RescindOptionsModalComponent } from './rescind/rescind.component';
import { HorizontalMenuComponent } from 'app/common/menu/horizontal-menu/horizontal-menu.component';
import { MenuService } from 'app/common/menu/menu.service';
import { GrantletterComponent } from './mygrants/grantletter/grantletter.component';
import { RoundoffPipe } from './editmygrant/roundoff.pipe';








@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PerfectScrollbarModule,
    ToastrModule.forRoot(),
    NgbModule.forRoot(),
    MultiselectDropdownModule,
    PipesModule,
    routing,
    NgxDatatableModule,
    MatDialogModule,
    NgxChartsModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    //NgxPopperModule,
    // TourNgxPopperModule.forRoot()
    TourMatMenuModule,

  ],
  declarations: [
    StockoptionsComponent,
    MygrantsComponent,
    GrantsComponent,
    AllocateComponent,
    ReportComponent,
    NomineesComponent,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    VerticalMenuComponent,
    HorizontalMenuComponent,
    WarningmodalComponent,
    UpdatewarningComponent,
    EditmygrantComponent,
    SucessmodalComponent,
    EditallocationComponent,
    EditAllocationWarningmodalComponent,
    EditAllocationSucessmodalComponent,
    NgxpopperComponent,
    MonitizationComponent,
    VestingComponent,
    LockinComponent,
    BacktopComponent,
    ExerciseDetailsModalComponent,
    RescindComponent,
    RescindOptionsModalComponent,
    GrantletterComponent,
    RoundoffPipe,

    

  ],
  entryComponents: [
    WarningmodalComponent,
    UpdatewarningComponent,
    SucessmodalComponent,
    EditAllocationWarningmodalComponent,
    EditAllocationSucessmodalComponent,
    ExerciseDetailsModalComponent,
    RescindOptionsModalComponent,
    GrantletterComponent
  
  ],
  providers: [
    AuthguardService,
    GrantsService,
    MygrantsService,
    AllocateService,
    ReportsService,
    NgxpopperComponent,
    RescindService,
    MenuService,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})

export class StockOptionsModule { }