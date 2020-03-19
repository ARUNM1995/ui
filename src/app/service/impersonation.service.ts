import { EmployeeData } from './../common/employee-data';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json',
  'Access-Control-Allow-Origin' : '*',
  "access-control-allow-headers" : "*",
  'Cache-Control': 'no-cache',
  'Pragma': 'no-cache',
})
};
const TOKEN_KEY = 'AuthToken';
@Injectable({
  providedIn: 'root'
})
export class ImpersonationService {
  // uri="http://localhost:8080"
  uri="";
  constructor(private http:HttpClient,private empDetails:EmployeeData) { }    private isuserLoggedIn:boolean;




          login(credentials){
            var url=this.uri+"/esop/login/"+credentials.username+"/"+credentials.password;
            sessionStorage.setItem("epmloyee",credentials.username);
            return  this.http.post(url,httpOptions);
                    // var url=this.uri+"/esop/login/"+credentials.username+"/"+credentials.password;
                    // this.isuserLoggedIn=true;
                    // sessionStorage.setItem("epmloyee",credentials.username);
                    // return  this.http.post(url,httpOptions);
          }
          impersonateLogin(username,password){
            var url=this.uri+"/esop/login/"+username+"/"+password;
            this.isuserLoggedIn=true;
            sessionStorage.setItem("epmloyee",username);
            return  this.http.post(url,httpOptions);
          }

          isLoggedIn(){
                return this.isuserLoggedIn;
          }

          logOut(){
              this.isuserLoggedIn=false;
              sessionStorage.removeItem(TOKEN_KEY);
              sessionStorage.removeItem("epmloyee");
          }

}
