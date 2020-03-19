import { Component, OnInit, ViewEncapsulation, Inject, EventEmitter, LOCALE_ID } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MygrantsService } from 'app/service/mygrants.service';

import { formatDate } from '@angular/common';
import * as jsPDF from 'jspdf';
import * as html2canvas from 'html2canvas';
import 'jspdf-autotable';


@Component({
  selector: 'app-grantletter',
  templateUrl: './grantletter.component.html',
  styleUrls: ['./grantletter.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GrantletterComponent implements OnInit {
  acceptModalGrantData;
  employee;
  constructor(public dialogRef:MatDialogRef<GrantletterComponent>,
              @Inject (MAT_DIALOG_DATA) public data,
              private service:MygrantsService,
              @Inject(LOCALE_ID) private locale: string) {
    this.acceptModalGrantData=data.grantDetails;
    this.employee=data.employee;
   }

   public $updatedGrantsData=new EventEmitter;
  ngOnInit() {
  }

  /*method to accept the granted grant*/
  acceptGrant(grantId,empNumber){
    this.service.acceptGrant(grantId,empNumber).subscribe(mygrants=>{
       let grants:any=mygrants;
        this.acceptModalGrantData=grants;
        this.acceptModalGrantData=this.acceptModalGrantData.filter(a=>a.id==grantId);
        this.acceptModalGrantData=this.acceptModalGrantData[0];  
        this.$updatedGrantsData.emit(grants);
    })
}
closeModal(){
  this.dialogRef.close();
}

html:String;
img;
/* method to download grant letter*/
downloadPdf(){            
       var data = document.getElementById('esopSecretary'); 
       html2canvas(data).then(canvas => { 
             var imgWidth = 170; 
             var pageHeight = 295; 
             var imgHeight = canvas.height * imgWidth / canvas.width; 
             var heightLeft = imgHeight; 
             
             const contentDataURL = canvas.toDataURL('image/png') 
             let pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF 
             var position = 0; 
               pdf.setTextColor(255, 0, 0)
               pdf.text(42,15,"Notice of Grant for Employee Share Option Plan") ;
               pdf.setTextColor(0, 0, 0)
               pdf.setFontSize(11);
               pdf.text(26,24,"QuEST Employee Share Option Plan "+this.acceptModalGrantData.planYear+"of QuEST Global Services Pte Ltd. (the Plan)")
               pdf.text(10,32,"Grant Number   :"+this.acceptModalGrantData.id);
               pdf.text(10,38,"Grant Date	:"+formatDate(this.acceptModalGrantData.grantDate, 'd-MMM-yy', this.locale));
               pdf.setFontSize(10);
               pdf.text(10,44,"Terms used in this Grant Letter shall bear the same meaning as defined in the Plan.");
               pdf.text(10,50,"Based on the Plan, the QuEST Employee Stock Option Committee approves the Grant of Option(s) as below:")
           

               var head = [{"name": "value"}];
               var body = [
                   ["Participant Name", this.employee.fullName],
                   ["Participant Employee Id",this.employee.employeeNumber],
                   ["Number of Option(s) Granted",this.acceptModalGrantData.noOfGrants],
                   ["Grant/Exercise Price", this.acceptModalGrantData.grantPrice],
                   ["Allocation Schedule", "As per the Allocation Schedule defined in the Plan"],
                   ["Vesting Date", "The date of a Monetization event"]
               ];

               pdf.autoTable({
                               head: head, 
                               body: body,
                             
                               startY: 56,
                               showHead: false,
                               useCss: true,
                       
                             });
               pdf.text(10,110,"The Grant and Option(s) shall be subject to all the terms and conditions of the Plan. You are advised to refer to the QuEST")
               pdf.text(10,116,"Employee Share Option Plan 2017 and FAQs annexed to the Plan, for the terms and conditions of Grant, Allocation and Vesting.")
               pdf.text(10,122,"By your signature and the signature of the Secretary of the ESOP committee below,")
             
               pdf.text(12,128,"a) You and the Company agree that the Grant of Option(s) as set out in this letter is offered to you and you have accepted ")
               pdf.text(15,132,"such offer of Grant, and you agree to be bound by this letter and by the terms and conditions of the Plan;")
               
               pdf.text(10,138, "b) You confirm that your acceptance of the Grant will not result in the contravention of any applicable law or regulation")
               pdf.text(15,142,"in relation to the ownership of Shares or Options to acquire such Shares; and")

               pdf.text(10,148, "c) You further acknowledge that the Company has not made any representation to induce you to accept the offer of Grant ")
               pdf.text(15,152,"and that the terms of this letter and the Plan constitute the entire agreement between you and the Company relating to")
               pdf.text(15,156,"the Grant")

               pdf.text(10,162,"Participant");  pdf.text(150,162,"Secretary, ESOP Committee") 
               pdf.text(10,168,this.employee.fullName); pdf.addImage(contentDataURL, 'PNG', 150, 164, 30,10);
                           
               pdf.text(10,174,"Acceptted on "+formatDate(this.acceptModalGrantData.grantAcceptedDate, 'd-MMM-yy', this.locale)); pdf.text(165,180,"Signature");
               pdf.text(165,186,formatDate(this.acceptModalGrantData.grantDate, 'd-MMM-yy', this.locale));

               pdf.setFontType("bolditalic");
               pdf.text(10,290,"QuEST Confidential");
             
               pdf.save(this.employee.employeeNumber+"_"+this.acceptModalGrantData.id+'.pdf'); 
       }); 
}

}
