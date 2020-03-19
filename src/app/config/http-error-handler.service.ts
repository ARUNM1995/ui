import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

const MODALS = {
  // errorDailog: ModalBasicComponent,
  // autofocus: NgbdModalConfirmAutofocus
};

/** Type of the handleError function returned by HttpErrorHandler.createHandleError */
export type HandleError =
  <T> (operation?: string, result?: T) => (error: HttpErrorResponse) => Observable<T>;

/** Handles HttpClient errors */

@Injectable({
  providedIn: 'root'
})
export class HttpErrorHandlerService {
  closeResult: string;
  // private _modalService: NgbModal
  constructor(private messageService: MessageService, public modalService: NgbModal, private router: Router) { }


  /** Create curried handleError function that already knows the service name */
  createHandleError = (serviceName = '') => <T>
    (operation = 'operation', result = {} as T) => this.handleError(serviceName, operation, result);



  /**
    * Returns a function that handles Http operation failures.
    * This error handler lets the app continue to run as if no error occurred.
    * @param serviceName = name of the data service that attempted the operation
    * @param operation - name of the operation that failed
    * @param result - optional value to return as the observable result
    */
  handleError<T>(serviceName = '', operation = 'operation', result = {} as T) {

    return (error: HttpErrorResponse): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      //console.error("ERROR " + error.status); // log to console instead

      const message = (error.error instanceof ErrorEvent) ?
        error.error.message :
        `server returned code ${error.status} with body "${error.error}"`;

      // TODO: better job of transforming error for user consumption
      this.messageService.add(`${serviceName}: ${operation} failed: ${message}`);

      
      // if (error.status == 404 || error.status == 500) {
      //   return of();
      // }

      const defualtValue=of(false);
   
      if (error.status == 504) {

        this.router.navigate(['server-error'])
        return of();

      } else {
        //console.log(error);
        // let el = document.getElementById("dialog");
        // el.click();
        // this.router.navigate(['/login']);
        // this.open('errorDailog');
      }



      // Let the app keep running by returning a safe result.
      return of(result);
    };






  }


  open(name: string) {
    const modalRef = this.modalService.open(MODALS[name]);

    //console.log(modalRef.result);


    modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      // event.confirm.resolve();
      //  this. deleteProcessInstance(event)
    },
      (reason) => {
        // event.confirm.reject();
        this.closeResult = `Dismissed ${reason}`;
      });

   // console.log(this.closeResult);



  }






}
