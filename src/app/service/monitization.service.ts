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
export class MonitizationService {

  constructor(private http:HttpClient) { }
 
      startMonitization(planYear,fareMarketValue,vestingFactor){
            fareMarketValue=0.5;
            return this.http.post
                  ("/esop/monitization/startMonitization/"+planYear,JSON.stringify(vestingFactor),httpOptions);
      }

      getPlanByStartYear(year){
        return this.http.post("/esop/monitization/planByYear",JSON.stringify(year),httpOptions);
      }

      getLockInData(){
          return this.http.get("/esop/monitization/getLockedMonitizationDetails",httpOptions);
      }
      
      saveFareMarketValues(fareMarketValues){
        return this.http.post("/esop/monitization/saveFareMarketValue",JSON.stringify(fareMarketValues),httpOptions);
      }

      getFareMarketValueData(){
       let year=new Date().getFullYear();
       return this.http.get("/esop/monitization/getFareMarketValueByYear/"+year,httpOptions);
      }

      updateFareMarketValue(fareMarketValue){
        return this.http.post("/esop/monitization/updateFareMarketValue",fareMarketValue,httpOptions);
      }
      getFareMarketValueByDate(d:Date){
        return this.http.put("/esop/monitization/updateFareMarketValue",JSON.stringify(d),httpOptions);
      }
      chnageLockInStatus(lockInData){
        return this.http.post("/esop/monitization/chnageLockInStatus",lockInData,httpOptions);
      }

      
}
