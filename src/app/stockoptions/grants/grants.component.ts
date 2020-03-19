import { Component, OnInit, ViewEncapsulation, ViewChild, Injectable } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog } from '@angular/material';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { Router } from '@angular/router';

import { AllocateService } from './../../service/allocate.service';
import { SharedData } from './../../common/shared-data';
import { GrantsService } from 'app/service/grants.service';
import { UpdatewarningComponent } from './../../common/updatewarning/updatewarning.component';
import { WarningmodalComponent } from 'app/common/warningmodal/warningmodal.component';
import { SucessmodalComponent } from 'app/common/sucessmodal/sucessmodal.component';

import * as XLSX from 'ts-xlsx';
import * as XLS from 'xlsx';
import * as FileSaver from 'file-saver';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
      selector: 'app-grants',
      templateUrl: './grants.component.html',
      styleUrls: ['./grants.component.scss'],
      encapsulation: ViewEncapsulation.None
})
export class GrantsComponent implements OnInit {
      grantYears;
      @ViewChild(DatatableComponent) table: DatatableComponent;
      constructor(
            public modalService: NgbModal,
            private router: Router,
            private grnatService: GrantsService,
            private allocationServie: AllocateService,
            public dialog: MatDialog,
            private shareData: SharedData) { }
      /*ngx table parameters*/
      editing = {};
      rows;
      temp;
      selected = [];
      loadingIndicator: boolean = true;
      reorderable: boolean = true;
      /*pop up modal parameters */
      public modalRef: NgbModalRef;

      /*custum data parameters*/
      result
      grantAssignment;
      currentGrantYear;
      selectedYear;
      totalPendingGrants = 0;
      grantDates = [];
      noPendingGrantsForDateArray = [];
      //planYear=2017;
      maxDate;
      //grantConsolidatedData;

      /*  excel sheet parameters  */
      arrayBuffer: any;
      file: File;
      excelSheetData;
      plans;
      currentPlanYear;
      selectedPlan;
      ngOnInit() {
            this.grnatService.getGrantAssignementsByPlanAndYear('finacialyear', 0).
                  subscribe(a => {
                        this.result = a;
                        this.plans = this.result.plans;
                        this.grantYears = this.result.grantYears;
                        this.currentGrantYear = this.result.currentFinancialYear;
                        this.selectedYear = this.result.currentFinancialYear;
                      //  this.grantYears = this.grantYears.filter((year) => year <= this.result.currentFinancialYear);
                        let y = this.result.plans.filter(plan => plan.isCurrentPlan == 1);
                        this.currentPlanYear = y[0].year;
                        this.selectedPlan = y[0].year;
                        this.iterateConsolidatedGrantsData(a);
                  });

      }
      getGratnYearsForPlanHandler(plan) {
            if(plan!="select"){   
            this.selectedPlan = plan;
            this.selectedYear = '';
            this.grnatService.getGratnYearsForPlanHandler(plan)
                  .subscribe(resp => {
                        this.rows = [];
                        this.noPendingGrantsForDateArray = [];
                        this.grantYears = resp;
                        //console.log(this.currentPlanYear);
                        if(this.currentPlanYear==plan){
                              this.getGratnsByYear(this.currentGrantYear);
                        }
                  })
            }
      }
      /* excel sheet related functions*/
      incomingfile(event) {
            this.file = event.target.files[0];
            sessionStorage.setItem("fileName", JSON.stringify(this.file.name));
            this.Upload(event);
      }
      Upload(event) {
            let fileReader = new FileReader();
            fileReader.onload = (e) => {
                  this.arrayBuffer = fileReader.result;
                  var data = new Uint8Array(this.arrayBuffer);
                  var arr = new Array();
                  for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
                  var bstr = arr.join("");
                  var workbook = XLSX.read(bstr, { type: "binary" });
                  var first_sheet_name = workbook.SheetNames[0];
                  var worksheet = workbook.Sheets[first_sheet_name];
                  this.excelSheetData = XLSX.utils.sheet_to_json(worksheet, { raw: true });
                  if (this.isDuplicateExists()) {
                        sessionStorage.setItem("headerData", JSON.stringify(true));
                        event.value='';
                        this.dialog.open(UpdatewarningComponent);
                  } else {
                        this.allowUpload(event);
                  }
            }
            fileReader.readAsArrayBuffer(this.file);
      }
      isDuplicateExists() {
            for (let i = 0; i < this.excelSheetData.length; i++) {
                  for (let j = i + 1; j < this.excelSheetData.length; j++) {
                        if (this.excelSheetData[i].employeeNumber === this.excelSheetData[j].employeeNumber) {
                              return true;
                        } else {
                        }
                  }
            }
            return false;
      }
      allowUpload(event) {
            this.showSpinnervalue = 0.2
            this.showSpinner = true;
            this.grnatService.uploadGrants(this.excelSheetData).subscribe(a => {
                  if (a == null) {
                        this.shareData.appSharedData.esopcommondata = JSON.stringify(this.excelSheetData);
                        const ref = this.dialog.open(WarningmodalComponent);
                        ref.componentInstance.$updatedGrantData.subscribe(b => {

                              this.result = b;
                              let successmodaldata = {
                                    plan: this.result.consolidateGrantsFromDb[0].planYear,
                                    grantYear: this.result.consolidateGrantsFromDb[0].cycleYear,
                                    grantDate: this.result.consolidateGrantsFromDb[0].grantDate,
                                    noOfGrants: this.excelSheetData.length
                              }
                              this.noPendingGrantsForDateArray = [];
                              this.grantDates = [];
                              this.totalPendingGrants = 0;
                              this.shareData.appSharedData.esopcommondata = JSON.stringify(successmodaldata);
                              this.iterateConsolidatedGrantsData(b);
                              this.dialog.open(SucessmodalComponent);
                        });
                  } else {

                        this.result = a;
                        let successmodaldata = {
                              plan: this.result.consolidateGrantsFromDb[0].planYear,
                              grantYear: this.result.consolidateGrantsFromDb[0].cycleYear,
                              grantDate: this.result.consolidateGrantsFromDb[0].grantDate,
                              noOfGrants: this.excelSheetData.length
                        }
                        this.noPendingGrantsForDateArray = [];
                        this.grantDates = [];
                        this.totalPendingGrants = 0;
                        this.shareData.appSharedData.esopcommondata = JSON.stringify(successmodaldata);
                        this.iterateConsolidatedGrantsData(a);
                        this.dialog.open(SucessmodalComponent);
                  }
                  this.showSpinner = false;
                  this.showSpinnervalue = 1;
                  
            })
            event.value = '';
      }

      /*functions related to ngx data table*/
      updateableNumberOfGrants;
      temprowIndex;
      toggleExpandRow(row, rowIndex) {

            this.updateableNumberOfGrants = row;
            if (this.temprowIndex != null) {
                  this.editing[this.temprowIndex + '-name'] = false;
            }
            this.editing[rowIndex + '-name'] = true;
            this.temprowIndex = rowIndex;
      }
      test() {
            this.editing[this.temprowIndex + '-name'] = false;
      }
      updateFilter(event) {
            const val = event.target.value.toLowerCase();
            const temp = this.temp.filter(function (d) {
                  return d.fullName.toLowerCase().indexOf(val) !== -1 || !val;
            });
            this.rows = temp;
            this.table.offset = 0;
      }
      /*grantsSelectedToBeGranted=[];*/
      onSelect({ selected }) {
            this.selected.splice(0, this.selected.length);
            this.selected.push(...selected);
      }
      onActivate(event) {

      }

      /* function to fetch data based on year selected*/
      getGratnsByYear(year) {
            if (year != "select") {
                  this.noPendingGrantsForDateArray = [];
                  this.grantDates = [];
                  this.totalPendingGrants = 0;
                  this.selectedYear = year;
                  this.rows = [];
                  this.loadingIndicator = true;

                  this.grnatService.getGrantAssignementsByPlanAndYear(year, this.selectedPlan).
                        subscribe(a => {
                              this.iterateConsolidatedGrantsData(a)
                        });

            }
      }

      /* function to update employee number of grants */
      updateValue(event, cell, rowIndex) {
            this.editing[rowIndex + '-' + cell] = false;
            this.rows[rowIndex][cell] = event.target.value;
            this.rows = [...this.rows];
            this.updateableNumberOfGrants.noOfGrants = this.rows[rowIndex][cell];

            this.grnatService.updateNumberOfGrants(this.updateableNumberOfGrants.noOfGrants,
                  this.updateableNumberOfGrants.grantAssignmentId)
                  .subscribe(a => { });
      }
      showSpinner = false;
      showSpinnervalue = 1;
      /*function to grant the grants*/
      grantedGrantsModalData;
      missMatchGrantsModalData;

      updateGrantsStatusConformation(modalContent, modalContentWarningMessage) {
            if (this.selected.length == this.rows.length) {
                  this.modalRef = this.modalService.open(modalContentWarningMessage, { container: '.app' });
            } else {
                  this.updateGrantsStatus(modalContent);
            }

      }
      updateGrantsStatus(modalContent) {
            if (this.modalRef != undefined) {
                  this.modalRef.close();
            }

            if (this.selected.length != 0) {
                  this.showSpinnervalue = 0.2
                  this.showSpinner = true;
                  this.noPendingGrantsForDateArray = [];
                  this.grantDates = [];
                  this.totalPendingGrants = 0;
                  this.grnatService.updateGrantsStatus(this.selected.filter(ga => ga.status == "PENDING"))
                        .subscribe(a => {
                              this.showSpinnervalue = 1;
                              let data: any = a;
                              this.showSpinner = false;
                              this.missMatchGrantsModalData = data.grantsNotTobeAllocated;
                              let result: any = a;
                              this.rows = result.consolidateGrantsFromDb;
                              this.temp = result.consolidateGrantsFromDb;
                              this.totalPendingGrants = result.totalPendingGrants;
                              this.noPendingGrantsForDateArray = result.grantDates;
                              this.maxDate = this.rows[0].grantDate + "";
                              this.grantedGrantsModalData = this.selected.filter((ga) => ga.status == "PENDING");
                              this.selected = [];
                              this.modalRef = this.modalService.open(modalContent, { container: '.app' });
                        });
            }

      }
      /*function to get grants by grantdate*/
      getGrantsByGrantDate(grantDate) {
            this.rows = [];
            this.loadingIndicator = true;
            let d = new Date(grantDate).toLocaleString();
            this.grnatService.getGrantsByGrantDate(grantDate).subscribe(a => {
                  this.rows = a;
                  this.temp = a;
                  this.maxDate = this.rows[0].grantDate + "";
                  this.loadingIndicator = false;
            });
      }
      /*function to delete the grant*/
      deletableGrant;
      deleteGrantWarningModal(grant) {
            this.deletableGrant = grant;
      }
      deleteGrant() {
            this.grnatService.deleteGrant(this.deletableGrant).subscribe(a => {
                  this.noPendingGrantsForDateArray = [];
                  this.grantDates = [];
                  this.totalPendingGrants = 0;
                  let result: any = a;
                  this.rows = result.consolidateGrantsFromDb;
                  this.temp = result.consolidateGrantsFromDb;
                  this.totalPendingGrants = result.totalPendingGrants;
                  this.noPendingGrantsForDateArray = result.grantDates;
            });
      }
      /*function to view and edit allocated grant details*/
      editAllocatedGrants(grantAssignmentId) {

            this.allocationServie.getGrantAllocationsById(grantAssignmentId)
                  .subscribe(a => {
                        this.shareData.appSharedData.esopcommondata = JSON.stringify(a);
                        this.router.navigate(['/stockoptions/editallocate', { id: "back" }])
                  });
      }

      /* util function to iterate consolidated grants data*/
      iterateConsolidatedGrantsData(a) {
            let result: any = a;
            this.rows = result.consolidateGrantsFromDb;
            this.temp = result.consolidateGrantsFromDb;
            this.totalPendingGrants = a.totalPendingGrants;
            this.noPendingGrantsForDateArray = a.grantDates;

            let tempDate = this.noPendingGrantsForDateArray[this.noPendingGrantsForDateArray.length - 1];
            if (tempDate != null)
                  this.maxDate = tempDate.grantDate + "";
            this.loadingIndicator = false;
      }
      /* function to close popupmodal*/
      closeModal(modalContent) {
            this.modalRef.close();
      }

      exportData() {

            const worksheet: XLS.WorkSheet = XLS.utils.json_to_sheet(this.rows);
            const workbook: XLS.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
            const excelBuffer: any = XLS.write(workbook, { bookType: 'xlsx', type: 'array' });
            const data: Blob = new Blob([excelBuffer], {
                  type: EXCEL_TYPE
            });
            FileSaver.saveAs(data, 'ESOP_grants_' + new Date().getTime() + EXCEL_EXTENSION);
      }
      chnageLockInStatus(data) {
            this.grnatService.chnageLockInStatus(data).subscribe(
                  a => {
                        this.rows = a;
                        this.temp = a;
                  }
            )

      }

}
