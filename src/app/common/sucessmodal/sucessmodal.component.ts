import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SharedData } from '../shared-data';

@Component({
  selector: 'app-sucessmodal',
  templateUrl: './sucessmodal.component.html',
  styleUrls: ['./sucessmodal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SucessmodalComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<SucessmodalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,private sharedData:SharedData) { }
    updatedGrantAssignment;
    fileName;
  ngOnInit() {

    this.fileName=JSON.parse(sessionStorage.getItem("fileName"));
    this.updatedGrantAssignment=JSON.parse(this.sharedData.appSharedData.esopcommondata);
  }
  onCloseNo(): void {
    this.dialogRef.close();
  }

}
