
import { Router } from '@angular/router';
import { Component, OnInit, ViewEncapsulation, ViewChild, EventEmitter } from '@angular/core';
import { Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import { GrantsService } from 'app/service/grants.service';
import { SharedData } from '../shared-data';
@Component({
  selector: 'app-warningmodal',
  templateUrl: './warningmodal.component.html',
  styleUrls: ['./warningmodal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WarningmodalComponent implements OnInit {
  constructor(private sharedData:SharedData,public dialogRef: MatDialogRef<WarningmodalComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,private service:GrantsService,private router:Router) { }

    grantsData;
    public $updatedGrantData=new EventEmitter;
                ngOnInit() {
                    this.grantsData=JSON.parse(this.sharedData.appSharedData.esopcommondata);
                }
                onCloseYes(){
                  this.service.addGrants(this.grantsData)
                     .subscribe(a=>{
                                this.$updatedGrantData.emit(a);  
                     });
                  this.dialogRef.close(this.data);
                }
                onCloseNo(): void {
                  this.dialogRef.close(this.data);
                }

}
