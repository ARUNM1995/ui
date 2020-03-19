import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Inject } from '@angular/core';
import { SharedData } from '../shared-data';

@Component({
  selector: 'app-edit-allocation-sucessmodal',
  templateUrl: './edit-allocation-sucessmodal.component.html',
  styleUrls: ['./edit-allocation-sucessmodal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EditAllocationSucessmodalComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<EditAllocationSucessmodalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,private sharedData:SharedData) { }
updatedAllocations;
allocatedGrants=0;
tobeAllocatedGrants=0;
totalGrants=0;
                ngOnInit() {
                            this.updatedAllocations=JSON.parse(this.sharedData.appSharedData.esopcommondata);
                            this.totalGrants=this.updatedAllocations[0].grantAssignment.noOfGrants;
                            this.updatedAllocations.forEach(element => {
                              if(element.status == 'PENDING'){
                                      this.tobeAllocatedGrants=this.tobeAllocatedGrants+Number(element.allocationNumbers);
                              }else{
                                      this.allocatedGrants=this.allocatedGrants+Number(element.allocationNumbers); 
                              }
                });


                }
                onCloseNo(): void {
                  this.dialogRef.close(this.data);
                }

}
