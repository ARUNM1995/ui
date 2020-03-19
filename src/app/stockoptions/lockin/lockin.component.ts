import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { MonitizationService } from 'app/service/monitization.service';

@Component({
  selector: 'app-lockin',
  templateUrl: './lockin.component.html',
  styleUrls: ['./lockin.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LockinComponent implements OnInit {
 
 /* data table parameters*/
 editing = {};
 rows = [];
 temp = [];
 selected = [];
 loadingIndicator: boolean = true;
 @ViewChild(DatatableComponent) table: DatatableComponent;

   constructor(private  service:MonitizationService) { }
   ngOnInit() {
        this.getLockInData();
   }
    updateFilter(event) {
        const val = event.target.value.toLowerCase();
        const temp = this.temp.filter(function(d) {
          return d.fullName.toLowerCase().indexOf(val) !== -1 || !val;
        });
        this.rows = temp;
        this.table.offset = 0;
    }

  lockInData;
    getLockInData(){
          this.service.getLockInData().subscribe((response)=>{
              this.lockInData=response;
              this.rows=this.lockInData;
              this.temp=this.lockInData;
              this.loadingIndicator=false;
          })
      }

      chnageLockInStatus(lockInData){
              this.service.chnageLockInStatus(lockInData)
                  .subscribe( (response)=>{
                      this.lockInData=response;
                      this.rows=this.lockInData;
                      this.temp=this.lockInData;
                }
              )
        }

}
