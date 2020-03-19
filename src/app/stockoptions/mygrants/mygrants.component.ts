import { Component, OnInit, ViewEncapsulation, Inject, LOCALE_ID, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { formatDate } from '@angular/common';

import { MygrantsService } from './../../service/mygrants.service';
import { SharedData } from 'app/common/shared-data';

import * as jsPDF from 'jspdf';
import * as html2canvas from 'html2canvas';
import 'jspdf-autotable';
import { GrantletterComponent } from './grantletter/grantletter.component';
import { AllocateService } from 'app/service/allocate.service';



@Component({
  selector: 'app-mygrants',
  templateUrl: './mygrants.component.html',
  styleUrls: ['./mygrants.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MygrantsComponent implements OnInit {

  constructor(
                public modalService: NgbModal,
                private service:MygrantsService,
                private allocationService:AllocateService,
                private route:Router,public dialog: 
                MatDialog,private shareData:SharedData,
                @Inject(LOCALE_ID) private locale: string) { }

  showImage=true;
  @HostListener('window:resize', ['$event'])
                onResize(event) {
                  /*
                  if(window.innerWidth<1000){
                      this.showImage=false;
                  }else{
                      this.showImage=true;
                  }
                  */
                 if(window.innerWidth<758){
                  this.showImage=false;
                 }else{
                  this.showImage=true;
                 }

                }
  public modalRef: NgbModalRef;

  /*custom parametes */
  grants;
  employee;
  acceptModalGrantData;
  mapData;
  plans;
  currentPlanYear;
  tempCurrentPlanYear;
                ngOnInit() {                 
                            this.getSumOfAllocatedGrantsByPlan("currentplan");                        
                }
                getSumOfAllocatedGrantsByPlan(plan){
                    this.service.getSumOfAllocatedGrants(plan).subscribe(mygrants=>{                            
                          this.mapData=mygrants
                          this.grants=this.mapData.esopMyGrantEntities;
                          this.employee=this.mapData.loggedUser;
                         // if(plan=="currentplan")
                          
                          if(plan=="currentplan"){
                            this.plans=this.mapData.plans;
                            this.currentPlanYear=this.plans.filter(plan=>plan.isCurrentPlan==1)[0].year;
                           this.tempCurrentPlanYear=this.currentPlanYear;
                          }else{
                            this.currentPlanYear=plan;
                          }
                         
                          
                          
                    });
                }
/*method to view grant details*/
                viewGrantDetails(id){
                            sessionStorage.setItem("viewGrant",JSON.stringify(id));
                            this.route.navigate(['stockoptions/editmygrnat']);
                }
/*method to accept the granted grant*/
                acceptGrant(modalContent,grantId,empNumber){
                            //this.modalRef.close();
                            this.service.acceptGrant(grantId,empNumber).subscribe(mygrants=>{
                                this.grants=mygrants;
                                this.acceptModalGrantData=this.grants;
                                this.acceptModalGrantData=this.acceptModalGrantData.filter(a=>a.id==grantId);
                                this.acceptModalGrantData=this.acceptModalGrantData[0];
                               // this.modalRef= this.modalService.open(modalContent, { container: '.app' ,size:'lg'});
                            })
                }
  /*method to close the pop up modal*/
                closeModal(){
                  this.modalRef.close();
                }
  /* method to open pop up modal*/
  allocationSchedule;
                openModal(modalContent,grant){
                
                            this.allocationService.getGrantAllocationsById(grant.id).subscribe(resp=>{
                               
                                  this.allocationSchedule=resp;
                                  this.modalRef= this.modalService.open(modalContent, { container: '.app',size:'lg' ,backdrop: 'static', keyboard: false});
                                  this.acceptModalGrantData=grant;  
                            })
                            
                             /*
                           const ref=  this.dialog.open(GrantletterComponent,{
                             
                               data:{
                                 grantDetails:grant,
                                 employee:this.employee
                               }
                             })
                             ref.componentInstance.$updatedGrantsData.subscribe(response=>{
        
                               this.grants=response;
                             })
                         */ 
                            
                } 

                 html:String;
                 img;
                 /* method to download grant letter*/
                downloadPdf(){   
                  if(this.acceptModalGrantData.annexure){
                  var data1 = document.getElementById('ModalGrantDataAnnexure'); 
                            var contentDataURL1;
                            html2canvas(data1).then(canvas => { 
                                  var imgWidth = 300; 
                                  var pageHeight = 295; 
                                  var imgHeight = canvas.height * imgWidth / canvas.width; 
                                  var heightLeft = imgHeight; 
                                  
                                  contentDataURL1 = canvas.toDataURL('image/png')
                                }); 
                              }
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

                               if(this.acceptModalGrantData.annexure){
                                    pdf.addImage(contentDataURL1, 'PNG', 23, 162, 150, 40);
                               }
                              

                             
                                pdf.text(10,230,"Participant");  pdf.text(150,230,"Secretary, ESOP Committee") 
                                pdf.text(10,235,this.employee.fullName); pdf.addImage(contentDataURL, 'PNG', 150, 233, 30,10);
                                            
                                pdf.text(10,240,"Acceptted on "+formatDate(this.acceptModalGrantData.grantAcceptedDate, 'd-MMM-yy', this.locale)); pdf.text(165,248,"Signature");
                                pdf.text(165,253,formatDate(this.acceptModalGrantData.grantDate, 'd-MMM-yy', this.locale));

                                pdf.setFontType("bolditalic");
                                pdf.text(10,290,"QuEST Confidential");
                            
                                pdf.save(this.employee.employeeNumber+"_"+this.acceptModalGrantData.id+'.pdf'); 
                        }); 
                }
}



