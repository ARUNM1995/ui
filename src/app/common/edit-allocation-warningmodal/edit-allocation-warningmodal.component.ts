import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Inject } from '@angular/core';
import { SharedData } from '../shared-data';
@Component({
  selector: 'app-edit-allocation-warningmodal',
  templateUrl: './edit-allocation-warningmodal.component.html',
  styleUrls: ['./edit-allocation-warningmodal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EditAllocationWarningmodalComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<EditAllocationWarningmodalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,private sharedData:SharedData) { }
totalGrants;
  ngOnInit() {
    this.totalGrants=JSON.parse(this.sharedData.appSharedData.esopcommondata);
  }
  onCloseNo(): void {
    this.dialogRef.close(this.data);
  }

}
