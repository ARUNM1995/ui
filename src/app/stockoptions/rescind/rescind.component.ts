import { Component, OnInit, ViewEncapsulation, ViewChild, EventEmitter, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RescindService } from 'app/service/rescind.service';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import * as XLS from 'xlsx';
import * as FileSaver from 'file-saver';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
      selector: 'app-rescind',
      templateUrl: './rescind.component.html',
      styleUrls: ['./rescind.component.scss'],
      encapsulation: ViewEncapsulation.None
})
export class RescindComponent implements OnInit {

      /* data table parameters*/
      editing = {};
      rows = [];
      temp = [];
      selected = [];
      loadingIndicator: boolean = true;
      @ViewChild(DatatableComponent) table: DatatableComponent;
      rescindSummaryData;
      plans;
      currentPlanYear;
      constructor(public dialog: MatDialog, private rescind_service: RescindService) { }
      ngOnInit() {
            this.getRescindSummary(0);
      }

      getRescindSummary(planYear) {
            this.loadingIndicator = true;
            this.rows=[];
            this.rescind_service.getAdminRescindSummary(planYear)
                  .subscribe((response) => {
                        this.loadingIndicator = false;
                        let data:any=response;
                        this.rescindSummaryData = data.esopRescindEntities;
                        this.plans=data.plans;
                        if(planYear==0){
                              this.currentPlanYear=this.plans.filter(plan=>plan.isCurrentPlan==1)[0].year;
                        }else{
                              this.currentPlanYear=planYear;
                        }
                             
                        this.rows = this.rescindSummaryData;
                        this.temp = this.rescindSummaryData;
                  }
                  )
      }

      openRescindOptionsModalComponent(planYear, employeeNumber, employeeName) {
            sessionStorage.setItem("planYear", JSON.stringify(planYear));
            sessionStorage.setItem("employeeNumber", JSON.stringify(employeeNumber));
            sessionStorage.setItem("employeeName", JSON.stringify(employeeName));
            const ref = this.dialog.open(RescindOptionsModalComponent);
            ref.componentInstance.emiitter.subscribe(a => {
                  this.rows = a;
                  this.temp = a;
            })
      }

      updateFilter(event) {
            const val = event.target.value.toLowerCase();
            const temp = this.temp.filter(function (d) {
                  return d.fullName.toLowerCase().indexOf(val) !== -1 || !val;
            });
            this.rows = temp;
            this.table.offset = 0;
      }

      exportData() {
            const worksheet: XLS.WorkSheet = XLS.utils.json_to_sheet(this.rescindSummaryData);
            const workbook: XLS.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
            const excelBuffer: any = XLS.write(workbook, { bookType: 'xlsx', type: 'array' });
            const data: Blob = new Blob([excelBuffer], {
                  type: EXCEL_TYPE
            });
            FileSaver.saveAs(data, 'ESOP_' + new Date().getTime() + EXCEL_EXTENSION);
      }

}

@Component({
      selector: 'app-rescindptionsmodal',
      templateUrl: './rescindptionsmodal.component.html',
})
export class RescindOptionsModalComponent implements OnInit,OnDestroy {
      /* data table parameters*/
      editing = {};
      rows = [];
      temp = [];
      selected = [];
      loadingIndicator: boolean = false;
      employeeNumber;
      employeeName;
      loggedUser;
      public emiitter = new EventEmitter;
      constructor(private rescind_service: RescindService) { }
      ngOnInit() {
            let planYear = JSON.parse(sessionStorage.getItem("planYear"));
            this.employeeNumber = JSON.parse(sessionStorage.getItem("employeeNumber"));
            this.employeeName = JSON.parse(sessionStorage.getItem("employeeName"));
            this.getEmployeeRescindByPlanAndEmployeeNumber(planYear, this.employeeNumber);

            sessionStorage.removeItem("planYear");
            sessionStorage.removeItem("employeeNumber");
            sessionStorage.removeItem("employeeName");
      }
      ngOnDestroy(){
            this.tempRemarks = [];
            this.tempRescindOptions = []
      }

      employeeRescindData=[];
      getEmployeeRescindByPlanAndEmployeeNumber(planYear, employeeNumber) {
            this.rescind_service.getRescindByPlanAndEmployeeNumber(planYear, employeeNumber)
                  .subscribe((response) => {
                        let data: any = response;
                        this.employeeRescindData = data.employeeRescindEntities;
                        this.loggedUser = data.loggedUser
                  }
                  )
      }
      errorMessage = false;
      successMessage = false;
      tempRescindOptions = []

      addRescindOptions(rescindOptions, rescindData) {
            this.successMessage = false;
            if(rescindData.exercisedOptions == null && rescindData.vestedOptions==null){
                        if(rescindData.allocated>=rescindOptions){
                              this.tempRescindOptions.push({
                                    rescindOptions: rescindOptions,
                                    rescindData: rescindData
                              })
                              this.errorMessage = false;
                        }else{
                              this.errorMessage = true;
                        }
            }else if(rescindData.vestedOptions!= null && rescindData.exercisedOptions == null){
                  if(rescindData.vestedOptions>=rescindOptions){
                        this.tempRescindOptions.push({
                              rescindOptions: rescindOptions,
                              rescindData: rescindData
                        })
                        this.errorMessage = false;
                  }else{
                        this.errorMessage = true;
                  }
            }else{
                  if ((rescindData.vestedOptions - rescindData.exercisedOptions) >= rescindOptions) {
                        this.tempRescindOptions.push({
                              rescindOptions: rescindOptions,
                              rescindData: rescindData
                        })
                        this.errorMessage = false;
                  } else {
                        this.errorMessage = true;
                  }
            }


            
           
      }

      tempRemarks = []
      remarksErrorMsg = false;
      addRemarks(rescindremarks, rescindData) {
            if (this.remarksErrorMsg) {
                  this.tempRemarks.push({
                        rescindremarks: rescindremarks,
                        rescindData: rescindData
                  });
                  this.finalData = [];
                  this.remarksErrorMsg = false;
            } else {
                  this.remarksErrorMsg = false;
                  this.tempRemarks.push({
                        rescindremarks: rescindremarks,
                        rescindData: rescindData
                  })
            }
      }
      finalData = []

      saveRescind() {
           
          
            if (this.tempRescindOptions.length != 0 && this.tempRemarks.length != 0) {
                  for (let i = 0; i < this.tempRescindOptions.length; i++) {
                        for (let j = 0; j < this.tempRemarks.length; j++) {
                              if (this.tempRescindOptions[i].rescindData.grantAssignmentId == this.tempRemarks[j].rescindData.grantAssignmentId) {

                                    this.finalData.push({
                                          grantAssignmentId: this.tempRescindOptions[i].rescindData.grantAssignmentId,
                                          remarks: this.tempRemarks[j].rescindremarks,
                                          rescind: this.tempRescindOptions[i].rescindOptions,
                                          employeeNumber: this.loggedUser.employeeNumber
                                          //employeeNumber:JSON.parse(sessionStorage.getItem("employeefull")).employeeNumber
                                    });
                              } else {
                                    if (this.tempRescindOptions[i].rescindData.remarks != null) {
                                          this.finalData.push({
                                                grantAssignmentId: this.tempRescindOptions[i].rescindData.grantAssignmentId,
                                                remarks: this.tempRescindOptions[i].rescindData.remarks,
                                                rescind: this.tempRescindOptions[i].rescindOptions,
                                                employeeNumber: this.loggedUser.employeeNumber
                                                // employeeNumber:JSON.parse(sessionStorage.getItem("employeefull")).employeeNumber
                                          });
                                    }
                              }
                        }
                  }
            } else {
                 
                  this.tempRescindOptions.forEach((element) => {
                        if (element.rescindData.remarks != null) {
                              this.finalData.push({
                                    grantAssignmentId: element.rescindData.grantAssignmentId,
                                    remarks: element.rescindData.remarks,
                                    rescind: element.rescindOptions,
                                    employeeNumber: this.loggedUser.employeeNumber
                                    // employeeNumber:JSON.parse(sessionStorage.getItem("employeefull")).employeeNumber
                              })
                        } else {
                              this.remarksErrorMsg = true;
                        }
                  })
            }

            if ( this.finalData.length != 0) {
                  this.rescind_service.saveRescind(this.finalData)
                        .subscribe((response) => {
                              this.errorMessage = false;
                              this.successMessage = true;
                              let data: any = response;
                              this.employeeRescindData = data.employeeRescindEntities;
                              this.emiitter.emit(data.esopRescindEntities);
                        }
                        )
            }
      }

     
}
