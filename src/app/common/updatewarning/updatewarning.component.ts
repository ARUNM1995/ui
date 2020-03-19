import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Inject } from '@angular/core';
@Component({
  selector: 'app-updatewarning',
  templateUrl: './updatewarning.component.html',
  styleUrls: ['./updatewarning.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UpdatewarningComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<UpdatewarningComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }
    headerData:boolean;
  ngOnInit() {
    this.headerData=JSON.parse(sessionStorage.getItem("headerData"));
  }
  onCloseNo(): void {
    //alert("no");
    this.dialogRef.close(this.data);
  }

}
