import { GrantsService } from './../../service/grants.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AllocateService } from 'app/service/allocate.service';

@Component({
  selector: 'app-editmygrant',
  templateUrl: './editmygrant.component.html',
  styleUrls: ['./editmygrant.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EditmygrantComponent implements OnInit {
  mapData
  grantData;
  grantAllocationData;
  monitizationData;



  


  constructor(private route: ActivatedRoute,
    private service: GrantsService,
    private _service: AllocateService) { }
  ngOnInit() {
    let id = JSON.parse(sessionStorage.getItem('viewGrant'));
    this.service.getGrantByGrantIdHandler(id)
      .subscribe(response => {
        this.mapData = response;
        this.grantData = this.mapData.grantAssignment;
        this.grantAllocationData = this.mapData.allocations;
        this.monitizationData = this.mapData.esopMyGrantEntitiy;
        let isEmployeeActive = this.mapData.resignedDate;
        this.grantAllocationData.sort(
          (a, b) => (a.allocationYear > b.allocationYear) ? 1 : -1
        )
      });
  }
}
