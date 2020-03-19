import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ReportsService } from './../../service/reports.service';
import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import * as XLS from 'xlsx';
import * as FileSaver from 'file-saver';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';


@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ReportComponent implements OnInit {

  /*ngx table parameters*/
  editing = {};
  rows;
  temp;
  rows1;
  temp1;
  selected = [];
  loadingIndicator: boolean = false;
  reorderable: boolean = true;

  esopSummaryReport;
  esopAllocationsReport;
  employee;
  adminRole = false;
  employeeRole = false;
  plans;
  selectedPlan;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  constructor(private reportservice: ReportsService) { }
  ngOnInit() {
    this.reportservice.getLoggedInEmployee().subscribe(
      resp => {
        let data: any = resp;
        this.employee = data.currentUser;
        this.plans = data.plans;
        this.selectedPlan = this.plans.filter(plan => plan.isCurrentPlan == 1)[0].year;
        this.employee.roles.forEach(element => {
          if (element == "EMPLOYEE") {
            this.employeeRole = true;
          }
          if (element == "ADMIN") {
            this.adminRole = true;
          }
        });
        this.summary = false;
        this.grants_allocations = false;
        this.my_grants_allocations = true;
       
        this.esopAllocationsReport = data.mygrantsallocationdata;
        this.rows1 = this.esopAllocationsReport;
        this.temp1 = this.esopAllocationsReport;
      }
    )

  }
  selectPlan(plan) {
    this.selectedPlan = plan;
   // this.rows = [];
   // this.rows1 = [];
    if(this.summary){
        this.getEsopSummaryReport();
    }else if(this.grants_allocations){
          this.getEsopAllocationsReport();
    }else{
            this.getEsopAllocationsReportByEmployee();
    }
    //this.summary = false;
    //this.grants_allocations = false;
    //this.my_grants_allocations = false;
  }
  summary;
  grants_allocations;
  my_grants_allocations;
  excerisce;
  getEsopSummaryReport() {
    this.summary = true;
    this.grants_allocations = false;
    this.my_grants_allocations = false;
    this.excerisce = false;
    this.exportableData = null;
    this.reportservice.getEsopSummaryReport(this.selectedPlan).subscribe(response => {
      this.esopAllocationsReport = null;
      this.esopSummaryReport = response;
      this.rows = this.esopSummaryReport;
      this.temp = this.esopSummaryReport;
      this.exportableData = this.rows;
    })
  }
  getEsopAllocationsReport() {
    this.summary = false;
    this.grants_allocations = true;
    this.my_grants_allocations = false;
    this.excerisce = false;
    this.exportableData = null;
    this.reportservice.getEsopAllocationsReport(this.selectedPlan).subscribe(response => {
      this.esopSummaryReport = null;
      this.esopAllocationsReport = response;
      this.rows1 = this.esopAllocationsReport;
      this.temp1 = this.esopAllocationsReport;
      this.exportableData = this.rows1;
    })
  }

  getEsopAllocationsReportByEmployee() {
    this.summary = false;
    this.grants_allocations = false;
    this.my_grants_allocations = true;
    this.excerisce = false;
    this.exportableData = null;
    this.reportservice.getEsopAllocationsReportByEmployee(this.selectedPlan).subscribe(response => {
      this.esopSummaryReport = null;
      this.esopAllocationsReport = response;
      this.rows1 = this.esopAllocationsReport;
      this.temp1 = this.esopAllocationsReport;
      this.exportableData = this.rows1;
    })
  }

  exportableData;
  exportData() {
    const worksheet: XLS.WorkSheet = XLS.utils.json_to_sheet(this.exportableData);
    const workbook: XLS.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLS.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data: Blob = new Blob([excelBuffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, 'ESOP_' + new Date().getTime() + EXCEL_EXTENSION);
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.temp.filter(function (d) {
      return d.fullName.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.rows = temp;
    this.table.offset = 0;
  }

}
