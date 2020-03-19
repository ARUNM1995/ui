import { MonitizationService } from './../../service/monitization.service';
import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ExerciseService } from 'app/service/exercise.service';
import { Router } from '@angular/router';
import * as XLSX from 'ts-xlsx';


@Component({
  selector: 'app-monitization',
  templateUrl: './monitization.component.html',
  styleUrls: ['./monitization.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MonitizationComponent implements OnInit {

  /* data table parameters*/
  editing = {};
  rows = [];
  temp = [];
  selected = [];
  loadingIndicator: boolean = true;
  rows1 = [];
  rows2 = [];
  temp2;
  selected2 = [];
  temp1;
  planData;

  /*  excel sheet parameters  */
  arrayBuffer: any;
  file: File;
  excelSheetData;


  @ViewChild(DatatableComponent) table: DatatableComponent;
  public modalRef: NgbModalRef;
  constructor(private router: Router,
    private service: MonitizationService,
    public modalService: NgbModal,
    private exerciseService: ExerciseService
  ) { }


  d;
  exerciseData;
  ngOnInit() {
    this.d = new Date();
    this.getPlanByStartYear(0);
  }

   /*method to get plan by year*/
   plans;
   selectedPlanYear;
   currentPlan;
   public getPlanByStartYear(year) {
     this.service.getPlanByStartYear(year)
       .subscribe((response) => {
 
         let data: any = response;
         this.planData = data.esopPlanByYear;
         if (year == 0) {
           this.plans = data.plans;
           this.selectedPlanYear = this.plans.filter(plan => plan.isCurrentPlan == 1)[0].year;
           this.currentPlan = this.selectedPlanYear;
         } else {
           this.selectedPlanYear = year;
         }
 
         this.exerciseData = data.consolidatedExerciseData;
         this.exerciseData = this.exerciseData
           .filter(e => (e.approvedDate == null && e.status == null));
         this.loadingIndicator = false;
         this.rows2 = this.exerciseData;
         this.temp2 = this.exerciseData;
       })
   }

  /* method to upload excel sheet data*/
  incomingfile(event,modelFareMarketValueSuccess) {
    this.file = event.target.files[0];
    sessionStorage.setItem("fileName", JSON.stringify(this.file.name));
    this.Upload(modelFareMarketValueSuccess);
  }

  Upload(modelFareMarketValueSuccess) {
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
      this.service.saveFareMarketValues(this.excelSheetData).subscribe(
        (a) => {
              this.openModal(modelFareMarketValueSuccess);
        }
      );
    }
    fileReader.readAsArrayBuffer(this.file);
  }

  monitizationData;
  vestingFactorError = false;
  showSpinner = false;
  showSpinnervalue = 1;
  /*method start the montitzation */
  startMonitization(f, modalSuccess) {
    if (Number(f.value.factor) > 0) {
      this.showSpinnervalue = 0.2
      this.showSpinner = true;
      this.vestingFactorError = false;
      this.service.startMonitization(this.selectedPlanYear, f.value.marketvalue, f.value.factor)
        .subscribe((response) => {
          this.closeModal();
          this.showSpinnervalue = 1
          this.showSpinner = false;
          this.monitizationData = response;
          this.getPlanByStartYear(2017);
          this.modalRef = this.modalService.open(modalSuccess, { container: '.app' });
        });
    } else {
      this.vestingFactorError = true;
    }

  }
  /* method to open and close pop up modal*/
  openModal(model) {
    this.modalRef = this.modalService.open(model, { container: '.app' });
  }
  public closeModal() {
    this.modalRef.close();
  }

  temprowIndex;
  updateableFareMarketValue;
  toggleExpandRow(row, rowIndex) {
    this.updateableFareMarketValue = row;
    if (this.temprowIndex != null) {
      this.editing[this.temprowIndex + '-name'] = false;
    }
    this.editing[rowIndex + '-name'] = true;
    this.temprowIndex = rowIndex;
  }

  rowDetailsExpand(row) {
    this.table.rowDetail.toggleExpandRow(row);
  }
  updateValue(event, cell, rowIndex) {
    this.editing[rowIndex + '-' + cell] = false;
    this.rows1[rowIndex][cell] = event.target.value;
    this.rows1 = [...this.rows1];
    this.updateableFareMarketValue.fareMarketValue = this.rows1[rowIndex][cell];
    this.service.updateFareMarketValue(this.updateableFareMarketValue)
      .subscribe((a) => { })
  }
  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.temp2.filter(function (d) {
      return d.fullName.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.rows2 = temp;
    this.table.offset = 0;
  }
  onSelect({ selected }) {
    this.selected2.splice(0, this.selected2.length);
    this.selected2.push(...selected);
  }
 

  lockInData;
  getLockInData() {
    //this.router.navigate(["stockoptions/lockin"])      
  }
  approveExercisedOptions(exerciseSucessPopup) {
    this.exerciseService.approveExercisedOptions(this.selected2)
      .subscribe((response) => {
        this.openModal(exerciseSucessPopup);
        this.exerciseData = response;
        this.exerciseData = this.exerciseData
          .filter(e => (e.approvedDate == null && e.status == null));
        this.rows2 = null;
        this.temp2 = null;
        this.rows2 = this.exerciseData;
        this.temp2 = this.exerciseData;
        this.selected2=[];
      }
      )
  }

  tempDeleteExerciseRequest;
  deleteExerciseRequestConformation(row, deleteExerciseRequest) {
    this.rejectRemarks = null;
    this.isrejectRemarksComments = false;
    this.openModal(deleteExerciseRequest);
    this.tempDeleteExerciseRequest = row;

  }
  rejectRemarks = null;
  isrejectRemarksComments = false;
  deleteExerciseById() {
    if (this.rejectRemarks == null) {
      this.isrejectRemarksComments = true;
    } else {
      this.exerciseService.deleteExerciseById(this.tempDeleteExerciseRequest.exerscieId, this.rejectRemarks)
        .subscribe((response) => {
          this.exerciseData = response;
          this.exerciseData = this.exerciseData.filter(e => (e.approvedDate == null && e.status == null));
          this.rows2 = this.exerciseData;
          this.temp2 = this.exerciseData;
          this.rejectRemarks = null;
          this.isrejectRemarksComments = false;
          this.closeModal();
        }
        )
    }
  }






  /** delatable mehthod cuz logic chnaged*/
  fareMarketValue;
  fmvalue;
  getFareMarketValueByDate(modalExcerice) {
    this.service.getFareMarketValueByDate(new Date()).subscribe(
      (a) => {

        this.fareMarketValue = a;
        this.fmvalue = this.fareMarketValue.fareMarketValue;
        this.d = this.fareMarketValue.actualDate;
      }
    )
    this.openModal(modalExcerice);
  }
  getFareMarketValue(d: Date) {
    this.service.getFareMarketValueByDate(d).subscribe(
      (a) => {

        this.fareMarketValue = a;
        this.fmvalue = this.fareMarketValue.fareMarketValue;
        this.d = this.fareMarketValue.actualDate;
      }
    )
  }

  /** delatable mehthod cuz logic chnaged*/
  selectedExercisedOptionsToApproveData = [];
  selectExercisedOptionsToApprove(data) {
    this.selectedExercisedOptionsToApproveData.push(data);
  }
}
