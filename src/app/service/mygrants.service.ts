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
export class MygrantsService {

  constructor(private http:HttpClient) { }

        acceptGrant(grantId,empNumber){
            return this.http.post("/esop/grants/acceptgrant/"+empNumber,grantId,httpOptions);
        }
        
        getSumOfAllocatedGrants(plan){
           return this.http.post("/esop/grants/getSumOfAllocatedGrants",plan,httpOptions);
        } 

      
     
}
