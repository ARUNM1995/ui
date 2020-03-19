import { Injectable, LOCALE_ID, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { formatDate } from '@angular/common';
import 'rxjs/add/operator/map';

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
export class GrantsService {

grantAssignment:any;
    constructor(private http:HttpClient,@Inject(LOCALE_ID) private locale: string) { }


        uploadGrants(grants){ 
              return this.http.post("/esop/grants/uploadGrants",grants,httpOptions);
        }

        getGrantAssignementsByPlanAndYear(year,plan){
              return this.http.post("/esop/grants/getUploadedGrants/"+plan,year,httpOptions);
        }
      
        getGratnYearsForPlanHandler(plan){
           return this.http.post("/esop/grants/getGratnYearsForPlanHandler",plan,httpOptions);
        }

        updateNumberOfGrants(noOfGrants,grantAssignmentId){
           return this.http.post("/esop/grants/updateNumberOfGrants/"+noOfGrants,grantAssignmentId,httpOptions);
        }

        updateGrantsStatus(grants){
          return this.http.post("/esop/grants/updategrantsstatus",JSON.stringify(grants),httpOptions);
        }

        getGrantsByGrantDate(grantDate){
          let d= formatDate(grantDate, 'd-MMM-yy', this.locale);
          return this.http.post("/esop/grants/getGrantsByGrantDate",d,httpOptions);
        }

        deleteGrant(grant){
          return this.http.post("/esop/grants/deletegrantbygrantassignmentid",grant,httpOptions);
        }

        chnageLockInStatus(data){   
          return this.http.post("/esop/grants/chnageLockInStatusByGrantAssignmentId",JSON.stringify(data),httpOptions);
        }


        getGrantByGrantIdHandler(id){
          return this.http.post("/esop/grants/getGrantByGrantIdHandler",id,httpOptions);
        }


        addGrants(grants){
              return this.http.post("/esop/grants/addGrants",grants,httpOptions);
        }

     

        /**remove at last */
      //   getGrantsByYear(year){
      //         return this.http.post("/esop/getUploadedGrants",year,httpOptions);
      //   }

}
