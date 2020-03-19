import { Injectable } from "@angular/core";
import { EmployeeDataModal } from "./employee-data-modal";

@Injectable({
    providedIn:'root'   
})
export class EmployeeData{
    public employeeDetails=new EmployeeDataModal('');
    constructor(){}

}