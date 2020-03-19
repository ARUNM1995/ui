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
export class NomineeService {

  constructor(private http:HttpClient) { }

  getNomineesByEmployeeNumber(){
   return this.http.get("/esop/getNomineesByEmployeeNumber",httpOptions);
  }
  addNominee(nominee){
    return this.http.post("/esop/saveNominee",JSON.stringify(nominee),httpOptions);
  }
  deleteNominee(nominee){
    return this.http.post("/esop/deleteNominee",JSON.stringify(nominee),httpOptions);
  }
  getStatesForCountry(countryId){
    return this.http.post("/esop/getStatesByCountryId",countryId,httpOptions);
  }
}
