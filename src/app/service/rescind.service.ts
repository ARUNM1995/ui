import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions={
    headers: new HttpHeaders({ 
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'no-cache',
    'Accept': '*/*',
  })
}

@Injectable({
  providedIn: 'root'
})
export class RescindService {

    constructor(private http:HttpClient) { }

    getAdminRescindSummary(planYear){
      return this.http.get("/esop/rescind/getAdminRescindSummary/"+planYear,httpOptions);
    }

    getRescindByPlanAndEmployeeNumber(planYear,employeeNumber){
      return this.http.post("/esop/rescind/getRescindByPlanAndEmployeeNumber/"+planYear,employeeNumber,httpOptions);
    }

    saveRescind(consolidatedRescind){
      return this.http.post("/esop/rescind/saveRescindList",consolidatedRescind,httpOptions);
    }
}
