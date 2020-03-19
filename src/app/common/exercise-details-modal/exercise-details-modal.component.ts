import { Component, OnInit, ViewEncapsulation,EventEmitter } from '@angular/core';
import { ExerciseService } from 'app/service/exercise.service';


@Component({
  selector: 'app-exercise-details-modal',
  templateUrl: './exercise-details-modal.component.html',
  styleUrls: ['./exercise-details-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ExerciseDetailsModalComponent implements OnInit {
  exercisesForId;
  tempAvaliableOptions;
  constructor(private exerciseService:ExerciseService){}
  ngOnInit(){
        this.exercisesForId=JSON.parse(sessionStorage.getItem("exercisesForId"));
        this.tempAvaliableOptions=JSON.parse(sessionStorage.getItem("tempAvaliableOptions"));
        sessionStorage.removeItem("exercisesForId");
        sessionStorage.removeItem("tempAvaliableOptions");
  }

 public emitter= new EventEmitter();
  cancelExerciseRequest(exercise){
    this.exerciseService.cancelExerciseRequest(exercise).subscribe(
      (response)=>{
        let data:any=response
        
        this.exercisesForId=data.exercises;
        this.emitter.emit(data.esopMyGrantEntities);
      }
    )
}

}
