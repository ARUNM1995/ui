import { routes } from './../../app.routing';
import { style } from '@angular/animations';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
//import { TourService } from 'ngx-tour-ngx-popper';
import { TourService } from 'ngx-tour-md-menu';
import { ReportsService } from 'app/service/reports.service';
import { AuthService } from 'app/config/auth/auth.service';
@Component({
  selector: 'app-ngxpopper',
  templateUrl: './ngxpopper.component.html',
  styleUrls: ['./ngxpopper.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NgxpopperComponent implements OnInit {
  employee;
  employeeRole = false;
  adminRole = false;
  constructor(public tourService: TourService,private authService:AuthService, private report_service: ReportsService) { }
  ngOnInit() { }

  startTour() {
    // this.report_service.getLoggedInEmployee()
    //   .subscribe(resp => {
    //     this.employee = resp;
    //     if (this.employee.roles[0] == "ADMIN" || this.employee.roles[1] == "ADMIN") {
    //       this.adminTour();
    //     } else {
    //       this.employeeTour();
    //     }
    //   })
    const roles = this.authService.getUserRoles();

    if ( roles[0] == 'ADMIN' ) {
      this.adminTour();
    } else {
      this.employeeTour();
    }
  }
  adminTour() {
   
    this.tourService.initialize([
      {
        anchorId: 'tour1',
        content: 'Click to view Grants',
        //placement: 'auto',
        enableBackdrop: true,
        title: 'ESOP guide',

      },
      {
        anchorId: 'mygrants01',
        route: 'stockoptions/mygrants',
        content: 'View, accept, download Grant',
        //placement: 'auto',
        enableBackdrop: true,
        title: 'ESOP guide',
      },
      {
        anchorId: 'mygrants02',
        content: 'Click to Exercise',
        //placement: 'auto',
        enableBackdrop: true,
        title: 'ESOP guide',
      },
      {
        anchorId: 'vesting01',
        route: 'stockoptions/vesting',
        content: 'Exercise details',
        //placement: 'auto',
        enableBackdrop: true,
        title: 'ESOP guide',
      }, {
        anchorId: 'tour2',
        // route:'stockoptions/nominies',
        content: 'Click to view Nominees',
        // placement: 'bottom',
        enableBackdrop: true,
        title: 'ESOP guide',
      }, {
        anchorId: 'nominee01',
        route: 'stockoptions/nominies',
        content: 'Add,edit,view Nominees',
        // placement: 'bottom',
        enableBackdrop: true,
        title: 'ESOP guide',
      },
      {
        anchorId: 'tour3',
        content: 'Click to upload & grant Grants',
        //placement: 'auto',
        enableBackdrop: true,
        title: 'ESOP guide',
      },
      {
        anchorId: 'grants02',
        route: 'stockoptions/grants',
        content: 'Click to download Grants',
        //placement: 'auto',
        enableBackdrop: true,
        title: 'ESOP guide',
      },
      {
        anchorId: 'grants03',
        //route:'stockoptions/grants',
        content: 'Total pending grants',
        //placement: 'auto',
        enableBackdrop: true,
        title: 'ESOP guide',
      },
      {
        anchorId: 'grants04',
        //route:'stockoptions/grants',
        content: 'Click to grant Grants',
        //placement: 'auto',
        enableBackdrop: true,
        title: 'ESOP guide',
      },
      {
        anchorId: 'grants05',
        //route:'stockoptions/grants',
        content: 'Click to upload Grants',
        //placement: 'auto',
        enableBackdrop: true,
        title: 'ESOP guide',
      }, {
        anchorId: 'grants06',
        //route:'stockoptions/grants',
        content: 'Select the plan and Grant year',
        //placement: 'auto',
        enableBackdrop: true,
        title: 'ESOP guide',
      },
      {
        anchorId: 'grants07',
        //route:'stockoptions/grants',allocation01
        content: 'Click to view Grants for a particular date',
        //placement: 'auto',
        enableBackdrop: true,
        title: 'ESOP guide',
      }, {
        anchorId: 'tour4',
        //route:'stockoptions/grants',
        content: 'Click to view Allocations',
        //placement: 'auto',
        enableBackdrop: true,
        title: 'ESOP guide',
      }, {
        anchorId: 'allocation02',
        route: 'stockoptions/allocate',
        content: 'Click to toggle Allocations based on employee status',
        //placement: 'auto',
        enableBackdrop: true,
        title: 'ESOP guide',
      },
      {
        anchorId: 'allocation03',
        //route:'stockoptions/allocate',
        content: 'Click to  allcoate Grants',
        //placement: 'auto',
        enableBackdrop: true,
        title: 'ESOP guide',
      },
      {
        anchorId: 'allocation04',
        //route:'stockoptions/grants',
        content: 'Click to download Allocations',
        //placement: 'auto',
        enableBackdrop: true,
        title: 'ESOP guide',
      },
      {
        anchorId: 'allocation05',
        //route:'stockoptions/grants',exercise01
        content: 'Select plan and allocation year to view Allocations',
        //placement: 'auto',
        enableBackdrop: true,
        title: 'ESOP guide',
      }, {
        anchorId: 'tour5',
        //route:'stockoptions/grants',
        content: 'Click to view Exercise',
        //placement: 'auto',
        enableBackdrop: true,
        title: 'ESOP guide',
      },
      // {
      //   anchorId: 'exercise01',
      //   //route:'stockoptions/grants',
      //   content: 'Click to view Exercise',
      //   //placement: 'auto',
      //   enableBackdrop:true,
      //   title: 'ESOP guide',
      // },
      {
        anchorId: 'exercise02',
        route: 'stockoptions/monitization',
        content: 'Click to intiate Monetization',
        //placement: 'auto',
        enableBackdrop: true,
        title: 'ESOP guide',
      },
      {
        anchorId: 'exercise03',
        //route:'stockoptions/grants',
        content: 'Click to upload fare market value',
        //placement: 'auto',
        enableBackdrop: true,
        title: 'ESOP guide',
      },
      // {
      //   anchorId: 'exercise04',
      //   //route:'stockoptions/grants',
      //   content: 'Click to view Lockin details',
      //   //placement: 'auto',
      //   enableBackdrop:true,
      //   title: 'ESOP guide',
      // },
      {
        anchorId: 'exercise05',
        //route:'stockoptions/grants',
        content: 'Click to approve Exercise request',
        //placement: 'auto',
        enableBackdrop: true,
        title: 'ESOP guide',
      }, {
        anchorId: 'tour6',
        content: 'Click to  view Rescind',
        //placement: 'auto',
        enableBackdrop: true,
        title: 'ESOP guide',

      }, {
        anchorId: 'rescind02',
        route: 'stockoptions/rescind',
        content: 'Click to download Rescind details',
        //placement: 'bottom',
        enableBackdrop: true,
        title: 'ESOP guide',
      },
      {
        anchorId: 'rescind03',
        content: 'Rescind summary table',
        //route:'stockoptions/mygrants',
        //placement: 'auto',
        enableBackdrop: true,
        title: 'ESOP guide',
      }, {
        anchorId: 'tour7',
        content: 'Click to  view Reports',
        //placement: 'auto',
        enableBackdrop: true,
        title: 'ESOP guide',

      }, {
        anchorId: 'reports02',
        route: 'stockoptions/reports',
        content: 'Click to download Reports details',
        //placement: 'bottom',
        enableBackdrop: true,
        title: 'ESOP guide',
      },
      {
        anchorId: 'tourId6',
        content: 'Click to give Feedback',
        route: 'stockoptions/mygrants',
        //placement: 'auto',
        enableBackdrop: true,
        title: 'ESOP guide',
      },
      {
        anchorId: 'tourId7',
        content: 'Click to open help manual',
        //placement: 'auto',
        enableBackdrop: true,
        title: 'ESOP guide',
      },
      {
        anchorId: 'tourId8',
        content: 'Click to view profile',
        //placement: 'auto',
        enableBackdrop: true,
        title: 'ESOP guide',
      }

    ])
    setTimeout(() => {
      this.tourService.start();
    }, 2000);
    //this.tourService.events$.subscribe(x => console.log(x));
  }

  employeeTour() {
    this.tourService.initialize([
      {
        anchorId: 'tour1',
        content: 'Click to view Grants',
        //placement: 'auto',
        enableBackdrop: true,
        title: 'ESOP guide',

      },
      {
        anchorId: 'mygrants01',
        route: 'stockoptions/mygrants',
        content: 'View, accept, download Grant',
        //placement: 'auto',
        enableBackdrop: true,
        title: 'ESOP guide',
      },
      {
        anchorId: 'mygrants02',
        content: 'Click to Exercise',
        //placement: 'auto',
        enableBackdrop: true,
        title: 'ESOP guide',
      },
      {
        anchorId: 'vesting01',
        content: 'Exercise details',
        //placement: 'auto',
        enableBackdrop: true,
        title: 'ESOP guide',
      }, {
        anchorId: 'tour2',
        // route:'stockoptions/nominies',
        content: 'Click to view Nominees',
        // placement: 'bottom',
        enableBackdrop: true,
        title: 'ESOP guide',
      }, {
        anchorId: 'nominee01',
        route: 'stockoptions/nominies',
        content: 'Add,edit,view Nominees',
        // placement: 'bottom',
        enableBackdrop: true,
        title: 'ESOP guide',
      },{
        anchorId: 'tour7',
        content: 'Click to  view Reports',
        //placement: 'auto',
        enableBackdrop: true,
        title: 'ESOP guide',

      }, {
        anchorId: 'reports02',
        route: 'stockoptions/reports',
        content: 'Click to download Reports details',
        //placement: 'bottom',
        enableBackdrop: true,
        title: 'ESOP guide',
      },
      {
        anchorId: 'tourId6',
        route: 'stockoptions/mygrants',
        content: 'Click to give Feedback',
        //placement: 'auto',
        enableBackdrop: true,
        title: 'ESOP guide',
      },
      {
        anchorId: 'tourId7',
        content: 'Click to open help manual',
        //placement: 'auto',

        enableBackdrop: true,
        title: 'ESOP guide',
      },
      {
        anchorId: 'tourId8',
        content: 'Click to view profile',
        //placement: 'auto',
        enableBackdrop: true,

        title: 'ESOP guide',
      }

    ])
    this.tourService.start();



  }


}
