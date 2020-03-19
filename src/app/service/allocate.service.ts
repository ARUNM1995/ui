import {HttpClient , HttpHeaders } from '@angular/common/http';
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
export class AllocateService {
        constructor(private http:HttpClient) { }
        
        updateGrantAllocations(grantAllocations){
              return this.http
                          .post("/esop/allocations/updateGrantAllocations",
                              JSON.stringify(grantAllocations),httpOptions);
        }

        getGrantAllocationsById(grantId){
         
            return this.http
                        .post("/esop/allocations/getallocationbyGrantId",
                                grantId,httpOptions);
        }

        allocateGrants(grantAllocations,allocationYear,planYear){
              return this.http
                          .post("/esop/allocations/allocateGrantAllocations/"+allocationYear+"/"+planYear,
                                 JSON.stringify(grantAllocations),httpOptions);
        }

        getAllocationByAllocationYear(allocationYear,planYear){
              return this.http
                         .post("/esop/allocations/getAllocationByCycleAndAllocationYear/"+planYear,
                                allocationYear,httpOptions);
        }
        
        getAllocationYearsForPlanHandler(planYear){
              return this.http
                          .post("/esop/allocations/getAllocationYearsForPlanHandler",
                                 planYear,httpOptions);
        }
        getAllocationByAllocationDate(allocationDate,planYear){
        
          return this.http
          .post("/esop/allocations/getAllocationByAllocationDateAndPlan/"+planYear,
          allocationDate,httpOptions);
        }
}
