import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, HostListener } from '@angular/core';
import { MygrantsService } from 'app/service/mygrants.service';
import { ExerciseService } from 'app/service/exercise.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog } from '@angular/material/dialog';
import { ExerciseDetailsModalComponent } from 'app/common/exercise-details-modal/exercise-details-modal.component';

@Component({
  selector: 'app-vesting',
  templateUrl: './vesting.component.html',
  styleUrls: ['./vesting.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class VestingComponent implements OnInit {

  employee;
  vestingOptionsData;
  public modalRef: NgbModalRef;
  /* data table parameters*/
  editing = {};
  rows = [];
  temp = [];
  selected = [];
  loadingIndicator: boolean = false;
  rows1 = [];
  temp1 = [];
  mapData;
  plans;
  selectedPlan;
  @ViewChild('exoptions') el: ElementRef;

  constructor(public dialog: MatDialog,
    private service: MygrantsService,
    private exerciseService: ExerciseService,
    public modalService: NgbModal) { }
  ngOnInit() {
    this.getSumOfAllocatedGrantsByPlan("currentplan");
  }
  currentPlan;
  getSumOfAllocatedGrantsByPlan(plan) {
    this.service.getSumOfAllocatedGrants(plan)
      .subscribe(response => {
        let d = response;
        this.vestingOptionsData = response;
        this.rows = this.vestingOptionsData.esopMyGrantEntities;
        this.temp = this.vestingOptionsData.esopMyGrantEntities;
        this.currentPlan=this.vestingOptionsData.currentPlan;
        if (plan == "currentplan") {
          this.plans = this.vestingOptionsData.plans;
          this.selectedPlan = this.plans.filter(plan => plan.isCurrentPlan == 1)[0].year;
        }
        else
          this.selectedPlan = plan;
      });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (window.innerWidth < 758) {
      // this.mobileData=false;
    } else {
      //this.mobileData=true;
    }

  }
  tempExercise;tempSell;
  save(row, montizationErroePopup, montizationSucessPopup, exerciseRequestPending) {

    this.exerciseService.isPendingRequestExistsForGrant(row.id).subscribe(
      (resp) => {
        if (!resp) {
          let exerciseOptionsElement: any = document.getElementById(row.id + "exerciseOptions");
          let sellOptionsElement: any = document.getElementById(row.id + "sellOptions");

          let exerciseOptions = Number(exerciseOptionsElement.value);
          let sellOptions = Number(sellOptionsElement.value);
          let avaliableOptionsToSell: Number = exerciseOptions + Number(row.exercisedOptions) - Number(row.soldOptions) - Number(row.soldApprovalPending);
          this.tempSell=sellOptions;
          this.tempExercise=exerciseOptions;
          let avaliableOptionsToExercise: Number = Number(row.vestedOptions) - Number(row.exercisedOptions) - Number(row.exerciseApprovalPending) - Number(row.rescingOptions);
          if (((exerciseOptions <= avaliableOptionsToExercise) && (sellOptions <= avaliableOptionsToSell))
            && (exerciseOptions > 0 || sellOptions > 0)) {
            this.exerciseService.saveForExercise(row, exerciseOptions, sellOptions)
              .subscribe((response) => {
                this.vestingOptionsData = response;
                this.rows = this.vestingOptionsData;
                this.temp = this.vestingOptionsData;
                this.openModal(montizationSucessPopup);
                exerciseOptionsElement.value = '';
                sellOptionsElement.value = '';
              }
              )
          } else {
            this.openModal(montizationErroePopup);
          }
        } else {
          this.openModal(exerciseRequestPending);
        }
      }
    )

  }


  exercisesForId;
  tempAvaliableOptions;
  getExerciseByGrantAssignmentId(ex, exerciseDetails) {
    this.tempAvaliableOptions = Number(ex.vestedOptions) - Number(ex.exercisedOptions);
    this.exerciseService.getExerciseByGrantAssignmentId(ex.id)
      .subscribe((response) => {
        this.exercisesForId = response;
        this.rows1 = this.exercisesForId;
        this.temp1 = this.exercisesForId;

        sessionStorage.setItem("exercisesForId", JSON.stringify(this.exercisesForId));
        sessionStorage.setItem("tempAvaliableOptions", JSON.stringify(this.tempAvaliableOptions));
        const dialogRef = this.dialog.open(ExerciseDetailsModalComponent);
        dialogRef.componentInstance.emitter.subscribe(a => {
          this.rows = a;
          this.temp = a;
        })
      }
      )
  }

  cancelExerciseRequest(exercise) {
    this.exerciseService.cancelExerciseRequest(exercise).subscribe(
      (response) => {

        this.exercisesForId = response;

        this.rows1 = this.exercisesForId;
        this.temp1 = this.exercisesForId;
      }
    )
  }
  openModal(model) {
    this.modalRef = this.modalService.open(model, { container: '.app' });
  }
  public closeModal() {
    this.modalRef.close();
  }
}




