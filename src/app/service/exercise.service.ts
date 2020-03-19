import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Cache-Control': 'no-cache',
  'Accept': '*/*',
  'Pragma': 'no-cache',
})
};
@Injectable({
  providedIn: 'root'
})
export class ExerciseService {
          constructor(private http:HttpClient) { }

          saveForExercise(exercise,exercisedOptions,soldOptions){
             //return this.http.post(`/esop/saveForExercise/`,exercise,{params:{"exercisedOptions":exercisedOptions,"soldOptions":soldOptions}});
            return this.http.post("/esop/saveForExercise/"+exercisedOptions+"/"+soldOptions,JSON.stringify(exercise),httpOptions);
          }

          // getExercises(){
          //   return this.http.get("/esop/getConsolidatedExerciseData",httpOptions);
          // }
          approveExercisedOptions(selectedExercisedOptionsToApprove){
            return this.http.post("/esop/saveAllExerciseForconsolidatedExerciseEntities",JSON.stringify(selectedExercisedOptionsToApprove),httpOptions);
          }

          deleteExerciseById(id,remarks){           
            return this.http.post("/esop/deleteExerciseById/"+id,remarks,httpOptions);
          }

          getExerciseByGrantAssignmentId(grantAssignmentId){
            return this.http.post("/esop/getExerciseByGrantAssignmentId",grantAssignmentId,httpOptions);
          }

          cancelExerciseRequest(exercise){
            return this.http.post("/esop/cancelExerciseRequest",JSON.stringify(exercise),httpOptions);
          }

          isPendingRequestExistsForGrant(grantAssignmentId){
            
            return this.http.post("/esop/isPendingRequestExistsForGrant",grantAssignmentId,httpOptions);
              
          }
}
