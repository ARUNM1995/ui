import { Nominee } from './nominee.modal';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NomineeService } from 'app/service/nominee.service';
@Component({
  selector: 'app-nominees',
  templateUrl: './nominees.component.html',
  styleUrls: ['./nominees.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NomineesComponent implements OnInit {
  public searchText: string;
  nomineesList;
  nominee: Nominee;
  showSpinner: boolean = true;
  public form: FormGroup;
  public modalRef: NgbModalRef;
  public type: string = 'grid';
  constructor(
    public fb: FormBuilder,
    public modalService: NgbModal,
    private service: NomineeService) { }
  employee;
  notifactionMsg;
  country;
  tempCountries;
  sum:number;
  ngOnInit() {
    //  this.employee=sessionStorage.getItem("epmloyee");
    this.form = this.fb.group({
      name: [null, Validators.required],
      address: [null, Validators.required],
      relation: [null, Validators.required],
      allocation_percenatage: [null, Validators.required],
      countryName: [null, Validators.required],
      stateName: [null, Validators.required],
      cityName: [null, Validators.required],
      zipCode: [null, Validators.required],
      employeeNumber: [],
      id: []
    });
  
    this.service.getNomineesByEmployeeNumber().subscribe(response => {

      let data: any = response;

      this.country = data.countrywiseStates;
      this.employee = data.loggedUser;
      this.tempCountries = data.countries;
      this.nomineesList = data.nomineesList;
      this.sum= 0;
      this.nomineesList.forEach(element => {
        this.sum =   this.sum + Number(element.allocation_percenatage);
      });
      this.showSpinner = false;
      if ( this.sum >= 100) {
        this.notifactionMsg = false;
      } else {
        this.notifactionMsg = true;
      }
    })
  }

  public toggle(type) {
    this.type = type;
  }
  tempState: any;
  openModal(modalContent, n) {
    this.totalPercentage = 0;
    if (n) {
      this.nominee = new Nominee();
      this.nominee.name = n.name;
      this.nominee.address = n.address;
      this.nominee.relation = n.relation;
      this.nominee.allocation_percenatage = n.allocation_percenatage;
      this.nominee.employeeNumber = n.employee.employeeNumber;
      this.nominee.id = n.id;
      this.nominee.cityName = n.cityName;
      this.nominee.stateName = n.stateName;
      this.nominee.zipCode = n.zipCode;
      this.nominee.countryName = n.countryName;
      let data: any = this.tempCountries;

      this.tempState = data.filter((c) => { return c.countryName == n.countryName });

      this.form.setValue(this.nominee);
    } else {
      this.nominee = new Nominee();
    }  
    this.modalRef = this.modalService.open(modalContent, { container: '.app' ,backdrop: 'static', keyboard: false});
    this.modalRef.result.then((result) => {
      this.form.reset();
    }, (reason) => {
      this.form.reset();
    });
  }
  public closeModal() {
    this.modalRef.close();
  }
  totalPercentage;
  public onSubmit(form, modalNomineeDuplicatesWarning) {
    form.employeeNumber = this.employee.employeeNumber;
    this.totalPercentage = 0;
    this.nomineesList.forEach(element => {
      if (element.id == form.id) {
        this.totalPercentage = this.totalPercentage + Number(form.allocation_percenatage);
      } else {
        this.totalPercentage = this.totalPercentage + element.allocation_percenatage;
      }
    });
    if (form.id == null)
      this.totalPercentage = this.totalPercentage + Number(form.allocation_percenatage);
    if (this.totalPercentage > 100) {
    } else {
      this.service.addNominee(form).subscribe(response => {
        let a: any = response;
        this.nomineesList = a;
        this.closeModal();
        this.sum = 0;
        this.nomineesList.forEach(element => {
          this.sum = this.sum + Number(element.allocation_percenatage);
        });

        if (this.sum >= 100) {
          this.notifactionMsg = false;
        } else {
          this.notifactionMsg = true;
        }
        // if(a.duplicates){
        //   this.openWarningModal(modalNomineeDuplicatesWarning);
        // }
      })
    }
  }

  deleteNomineeData;
  deleteNomineeConfirm(nominee, modalContentWarning) {
    this.deleteNomineeData = nominee;
    this.modalRef = this.modalService.open(modalContentWarning, { container: '.app' });
  }
  deleteNominee() {
    this.service.deleteNominee(this.deleteNomineeData).subscribe(a => {
      this.nomineesList = a;
      this.sum = 0;
      this.nomineesList.forEach(element => {
        this.sum = this.sum + Number(element.allocation_percenatage);
      });

      if (this.sum >= 100) {
        this.notifactionMsg = false;
      } else {
        this.notifactionMsg = true;
      }
    })
    this.closeModal();
  }
  openWarningModal(modalNomineeDuplicatesWarning) {
    this.modalRef = this.modalService.open(modalNomineeDuplicatesWarning, { container: '.app' });
  }
  getStatesForCountry(countryId) {
    this.service.getStatesForCountry(countryId).subscribe(
      (resp) => {

        this.tempState = resp;
      }
    )

  }
}
