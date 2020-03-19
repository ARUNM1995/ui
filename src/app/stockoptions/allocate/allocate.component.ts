import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { SharedData } from 'app/common/shared-data';
import { AllocateService } from './../../service/allocate.service';

import * as XLS from 'xlsx';
import * as FileSaver from 'file-saver';
import { DatePipe } from '@angular/common';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'app-allocate',
  templateUrl: './allocate.component.html',
  styleUrls: ['./allocate.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AllocateComponent implements OnInit {

  /*ngx table parameters*/
  editing = {};
  rows = [];
  temp = [];
  selected = [];
  loadingIndicator: boolean = true;
  reorderable: boolean = true;
  /*pop up modal parameters */
  public modalRef: NgbModalRef;

  /*custum data parameters*/
  mapData;
  allocations;
  grantPlanYear = 2017;
  allocationYear;
  allocatedAllocations;
  currentAllocationYear;
  years = [];
  @ViewChild(DatatableComponent) table: DatatableComponent;
  constructor(public modalService: NgbModal,
    private service: AllocateService,
    private shareData: SharedData,
    private datePipe:DatePipe,
    private router: Router, private dialog: MatDialog) { }

  plans;
  planYear;
  currentPlanYear;
  allocationDates;
  maxDate;
  ngOnInit() {
    this.service.getAllocationByAllocationYear("curentYearAllocation", 0).subscribe(allocation => {
      this.mapData = allocation;
      this.currentAllocationYear = this.mapData.allocationYear;
  
      this.plans = this.mapData.plans;
      this.years = this.mapData.allocationYears;
      this.currentPlanYear = this.plans.filter(plan => plan.isCurrentPlan == 1)[0].year;
      this.planYear = this.plans.filter(plan => plan.isCurrentPlan == 1)[0].year;
      this.iterateConsolidatedGrantsData(allocation);
    })
  }

  getAllocationYearsForPlanHandler(planYear) {
    if(planYear!="select"){
      this.planYear = planYear;
    this.rows = [];
    this.service.getAllocationYearsForPlanHandler(planYear)
      .subscribe(resp => {
        let data: any = resp;
        this.years = data;
       
      })
    }
    
  }

  getAllocationByAllocationDate(allocationDate,planYear){
  
    if(allocationDate!="select"){

      this.service.getAllocationByAllocationDate(this.datePipe.transform(allocationDate,'d-MMM-yy'),planYear)
      .subscribe(resp=>{
              let res:any=resp;
             this.maxDate=allocationDate;
             console.log(res);
             this.mapData.esopAllocationEntity=res;
             this.toogleAllocationDataHandler(res);
      })
    }
  }

  tempAllocationYear;
  /*function to fetch allocation by allocation year*/
  getAllocationsForSelectedYear(selectedAllocationYear, modalcontent) {

    if(selectedAllocationYear!="select"){
      if (this.currentAllocationYear != selectedAllocationYear) {

        event.preventDefault();
        this.tempAllocationYear = selectedAllocationYear;
        this.modalRef = this.modalService.open(modalcontent, { container: '.app' });
      } else {
        this.allocationModalConformation(selectedAllocationYear);
      }
    }

  }
  allocationModalConformation(selectedAllocationYear) {

    //this.years=[2017,2018,2019,2020,2021,2022];
    this.closeModal();
    this.loadingIndicator = true;
    this.rows = [];
    this.service.getAllocationByAllocationYear(selectedAllocationYear, this.planYear).subscribe(allocation => {

      this.iterateConsolidatedGrantsData(allocation);
    })

  }
  /*util method to iterate iterateConsolidatedAllocationData data*/
  iterateConsolidatedGrantsData(a) {
    this.loadingIndicator = false;
    this.mapData = a;
    this.toogleAllocationDataHandler(this.mapData.esopAllocationEntity);
    this.allocationDates=this.mapData.allocationDates;
    this.allocationYear = this.mapData.allocationYear;
   this.maxDate=this.mapData.esopAllocationEntity[this.mapData.esopAllocationEntity.length-1].plannedAllocationDate;
   this.datePipe.transform(this.maxDate,'d-MMM-yy');
  }
  /*function realted to ngx datatable*/
  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.temp.filter(function (d) {
      return d.fullName.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.rows = temp;
    this.table.offset = 0;
  }

  updateValue(event, cell, cellValue, row) {
    this.editing[row.$$index + '-' + cell] = false;
    this.rows[row.$$index][cell] = event.target.value;
  }
  onActivate(event) {

  }
  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
    //this.tempGrantsForAllocation=this.selected;
  }
  showSpinner = false;
  showSpinnervalue = 1;
  /*function to allocate selected allocations */
  allocateGrantsConformation(modalcontent, modalContentWarningMessage) {
    if (this.selected.length == this.rows.length) {
      this.modalRef = this.modalService.open(modalContentWarningMessage, { container: '.app' });
    } else {
      this.allocateGrants(modalcontent);
    }
  }

  allocateGrants(modalcontent) {
    this.showSpinnervalue = 0.2
    this.showSpinner = true;
    if (this.modalRef != undefined) {
      this.modalRef.close();
    }
    this.allocatedAllocations = this.selected.filter(a => a.status == "PENDING");
    this.service.allocateGrants(this.allocatedAllocations, this.allocationYear, this.planYear)
      .subscribe(allocation => {
        this.allocations = allocation;
        this.showSpinnervalue = 1;
        this.showSpinner = false;
        this.selected = [];
        this.modalRef = this.modalService.open(modalcontent, { container: '.app' });
        // let temp=this.allocations.filter(allocations=>{
        //   return allocations.employeeStatus == "Active";
        // })
        // this.rows=temp;
        // this.temp=temp;
        this.toogleAllocationDataHandler(this.allocations);
      })
  }
  /*function to get allocations by grant id and navigate to edit allocation page*/
  editGrantsById(grantId) {
    this.service.getGrantAllocationsById(grantId).subscribe(a => {
      this.shareData.appSharedData.esopcommondata = JSON.stringify(a);
      this.router.navigate(["/stockoptions/editallocate"])
    })
  }
  /* function related to pop up modal*/
  closeModal() {
    this.modalRef.close();
  }
  no() {
    // this.years=[];
    this.modalRef.close();
    this.allocationModalConformation(this.allocationYear);
    this.years = [2017, 2018, 2019, 2020, 2021, 2022];
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
  checked = true;
  toogleAllocationData() {
    this.checked = !this.checked;
    let d: any = this.mapData.esopAllocationEntity;
    this.toogleAllocationDataHandler(d);
  }

  toogleAllocationDataHandler(d) {

    if (this.checked) {
      let data: any = d.filter((allocationData) => {
        return allocationData.employeeStatus == "Active";
      })
      this.rows = data;
      this.temp = data;
    } else {

      let data: any = d.filter((allocationData) => {
        return allocationData.employeeStatus == "Resigned";
      })

      this.rows = data;
      this.temp = data;
    }
   
  }


}
