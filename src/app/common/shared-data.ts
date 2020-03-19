import { SharedDataModal } from './shared-data-modal';
import { Injectable } from "@angular/core";

@Injectable({
 providedIn:'root'   
})
export class SharedData{

public appSharedData=new SharedDataModal('');
    constructor(){
        
    }
}