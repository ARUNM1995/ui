import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Cache-Control': 'no-cache',
  'Pragma': 'no-cache',
})
};
@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  constructor(private http:HttpClient) { }
  getEsopSummaryReport(plan){
   
      return this.http.post("/esop/reports/getEsopSummaryReport/",plan,httpOptions);
  }
  getEsopAllocationsReport(planYear){
    return this.http.post("/esop/reports/getEsopAllocationsReport/",planYear,httpOptions);
  }
  getEsopAllocationsReportByEmployee(planYear){
    return this.http.get("/esop/reports/getEsopAllocationsReportByEmployee/"+planYear,httpOptions);
  }
  getLoggedInEmployee(){
    let d="reports";
    return this.http.post("/esop/reports/getDetailsForReportGenration/",httpOptions);
  }
}
