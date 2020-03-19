import { AllocateService } from './../../service/allocate.service';
import { AppSettings } from 'app/app.settings';
import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { SharedData } from 'app/common/shared-data';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { Settings } from 'app/app.settings.model';
import {MatDialog} from '@angular/material';
import { EditAllocationWarningmodalComponent } from 'app/common/edit-allocation-warningmodal/edit-allocation-warningmodal.component';
import { EditAllocationSucessmodalComponent } from 'app/common/edit-allocation-sucessmodal/edit-allocation-sucessmodal.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-editallocation',
  templateUrl: './editallocation.component.html',
  styleUrls: ['./editallocation.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EditallocationComponent implements OnInit {
  
  editing = {};
  rows = [];
  temp = [];
  selected = [];
  loadingIndicator: boolean = false;
  reorderable: boolean = true;
  allocations;

  @ViewChild(DatatableComponent) table: DatatableComponent;
  constructor(
                private router:ActivatedRoute,
                private sharedData:SharedData,
                public appSettings:AppSettings,
                private service:AllocateService,
                public dialog: MatDialog,
                private shareData:SharedData) {
                this.settings = this.appSettings.settings;
                this.initPreviousSettings();
   }

  ngOnInit() {                                                      
    let r=this.router.snapshot.paramMap.get('id');
    if(r!=null){
      this.backRoute="/stockoptions/grants";
    }
    this.editableGrantAllocations=JSON.parse(this.sharedData.appSharedData.esopcommondata);
    this.editableGrantAllocations.sort((a,b)=>{
        return Number(a.allocationYear)-Number(b.allocationYear) ;
    });
   // this.editableGrantAllocations.sort();
    this.rows=this.editableGrantAllocations;
    this.temp=this.editableGrantAllocations;
    this.allocationDetail=this.editableGrantAllocations[0];
    this.totalGrants=this.allocationDetail.grantAssignment.noOfGrants;
    this.editableGrantAllocations.forEach(element => {
          if(element.status == 'PENDING'){
            this.tobeAllocatedGrants=this.tobeAllocatedGrants+element.allocationNumbers;
          }else{
            this.allocatedGrants=this.allocatedGrants+element.allocationNumbers;
          }
    });
      this.Granted=[{ name:'Granted', value:this.totalGrants +" @ "+this.allocationDetail.grantAssignment.grantPrice +"$"}];
      this.GrantedBgColor={ domain: ['#2F3E9E'] };
      this.Allocated = [{ name:'Allocated', value:this.allocatedGrants }];
      this.AllocatedBgColor = { domain: ['#378D3B'] };
      this.ToBeAllocated = [{ name:'To Be Allocated', value:this.tobeAllocatedGrants }];
      this.ToBeAllocatedBgColor = { domain: ['#FFA500'] };         
      this.Cancelled = [{ name:'Cancelled',value: this.totalGrants -this.allocatedGrants-this.tobeAllocatedGrants }];
      this.CancelledBgColor = { domain: ['#FF0000'] };
}

/*ngx charts parameters and methods */
  editableGrantAllocations;
  allocationDetail;
  allocatedGrants=0;
  tobeAllocatedGrants=0;
  totalGrants=0;

  public Granted ;
  public GrantedBgColor;
  public Allocated;
  public AllocatedBgColor;
  public ToBeAllocated ;
  public ToBeAllocatedBgColor;
  public Cancelled;
  public CancelledBgColor;


  public infoLabelFormat(c): string {
        switch(c.data.name) {
          case 'sales':
            return `<i class="fa fa-shopping-cart mr-2"></i>${c.label}`;
          case 'likes':
            return `<i class="fa fa-thumbs-o-up mr-2"></i>${c.label}`;
          case 'downloads':
            return `<i class="fa fa-download mr-2"></i>${c.label}`;
          case 'profit':
            return `<i class="fa fa-money mr-2"></i>${c.label}`;
          case 'messages':
            return `<i class="fa fa-comment-o mr-2"></i>${c.label}`;
          case 'members':
            return `<i class="fa fa-user mr-2"></i>${c.label}`;
          default:
            return c.label;
        }
  }

  public infoValueFormat(c): string {
        switch(c.data.extra ? c.data.extra.format : '') {
          case 'currency':
            return `\$${Math.round(c.value).toLocaleString()}`;
          case 'percent':
            return `${Math.round(c.value * 100)}%`;
          default:
            return c.value.toLocaleString();
        }
  }

  public previousShowMenuOption:boolean;
  public previousMenuOption:string;
  public previousMenuTypeOption:string;
  public settings: Settings;
  
  public ngDoCheck() {
        if(this.checkAppSettingsChanges()) {
          setTimeout(() => this.Granted = [...this.Granted] ); 
          setTimeout(() => this.Allocated = [...this.Allocated] ); 
          setTimeout(() => this.ToBeAllocated = [...this.ToBeAllocated] ); 
          setTimeout(() => this.Cancelled = [...this.Cancelled] ); 
          this.initPreviousSettings();
        }
  }

  public checkAppSettingsChanges(){
        if(this.previousShowMenuOption != this.settings.theme.showMenu ||
          this.previousMenuOption != this.settings.theme.menu ||
          this.previousMenuTypeOption != this.settings.theme.menuType){
          return true;
        }
        return false;
  }

  public initPreviousSettings(){
      this.previousShowMenuOption = this.settings.theme.showMenu;
      this.previousMenuOption = this.settings.theme.menu;
      this.previousMenuTypeOption = this.settings.theme.menuType;
  }
backRoute="/stockoptions/allocate";
 
  updateFilter(event) {
      const val = event.target.value.toLowerCase();
      const temp = this.temp.filter(function(d) {
        return d.name.toLowerCase().indexOf(val) !== -1 || !val;
      });
      this.rows = temp;
      this.table.offset = 0;
  }

tempupdateAllocationData;
tempRemaingGrants;
 
  updateValue(event, cell, rowIndex) {
          this.tempRemaingGrants=0;
          this.editing[rowIndex + '-' + cell] = false;
          this.rows[rowIndex][cell] = event.target.value;
          this.rows = [...this.rows];
          var regex=/^[0-9]+$/;
          if(this.rows[rowIndex][cell].match(regex)){
                    this.tempupdateAllocationData=this.rows[rowIndex][cell];
                    let allocatedNumbers=0;
                    this.editableGrantAllocations.forEach(element => {    
                        if(element.id == this.tempEditedAllocationData.id){

                        }else{
                              this.tempRemaingGrants=Number(this.tempRemaingGrants)+Number(element.allocationNumbers);
                        }
                        if(element.status == "ALLOCATED"){
                            allocatedNumbers=allocatedNumbers+Number(element.allocationNumbers);
                        }
                    
                      });
                    const total=Number(this.tempRemaingGrants)+Number(this.tempupdateAllocationData);
                    if(total>this.totalGrants){
                        this.shareData.appSharedData.esopcommondata=JSON.stringify(this.totalGrants);
                        this.dialog.open(EditAllocationWarningmodalComponent);
                    }else{
                          if(this.rows[rowIndex][cell] == ''){
                          }else{
                            this.tempEditedAllocationData.allocationNumbers=this.rows[rowIndex][cell];
                            this.Cancelled = [{ name:'Cancelled',value: this.totalGrants-total }];
                            this.ToBeAllocated = [{ name:'To Be Allocated', value:total-allocatedNumbers }];
                          }
                    }

          }


    
  
  }

tempEditedAllocationData;
temprowIndex;
  toggleExpandRow(row,rowIndex){
    this.tempEditedAllocationData=row;
  }
  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  onActivate(event) {
  }

  updateEditedAllocations(){
        this.allocatedGrants=0;
        this.tobeAllocatedGrants=0;
        this.totalGrants=0;
        this.service.updateGrantAllocations(this.editableGrantAllocations).subscribe(a=>{
        this.editableGrantAllocations=a;
        this.shareData.appSharedData.esopcommondata=JSON.stringify(a);
        this.dialog.open(EditAllocationSucessmodalComponent);
        })
            this.rows=this.editableGrantAllocations;
            this.temp=this.editableGrantAllocations;
            this.allocationDetail=this.editableGrantAllocations[0];
            this.totalGrants=this.allocationDetail.grantAssignment.noOfGrants;

            this.editableGrantAllocations.forEach(element => {
                if(element.status == 'PENDING'){
                      this.tobeAllocatedGrants=this.tobeAllocatedGrants+Number(element.allocationNumbers);
                }else{
                      this.allocatedGrants=this.allocatedGrants+Number(element.allocationNumbers);
                }
              
            });
            this.editableGrantAllocations.sort((a,b)=>{
                  return Number(a.allocationYear)-Number(b.allocationYear) ;
              });
              this.Granted=[{ name:'Granted', value:this.totalGrants }];
              this.GrantedBgColor={ domain: ['#2F3E9E'] };                                      
              this.Allocated = [{ name:'Allocated', value:this.allocatedGrants }];
              this.AllocatedBgColor = { domain: ['#378D3B'] };                                      
              this.ToBeAllocated = [{ name:'To Be Allocated', value:this.tobeAllocatedGrants }];
              this.ToBeAllocatedBgColor = { domain: ['#FFA500'] };                                  
              this.Cancelled = [{ name:'Cancelled',value: this.totalGrants -this.allocatedGrants-this.tobeAllocatedGrants }];
              this.CancelledBgColor = { domain: ['#FF0000'] };                               
  }
  test(){
    this.editing[this.temprowIndex + '-name' ] = false;
  }
  expandCollapse(rowIndex){
                 if(this.temprowIndex!=null){
                          this.editing[this.temprowIndex + '-name' ] = false;
                  }
                  this.editing[rowIndex + '-name' ] = true;
                  this.temprowIndex=rowIndex;
  }
          
}
