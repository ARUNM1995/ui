import { Component, OnInit, ViewEncapsulation, Input, ElementRef, ViewChild, HostListener } from '@angular/core';

@Component({
  selector: 'app-backtop',
  templateUrl: './backtop.component.html',
  styleUrls: ['./backtop.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BacktopComponent  {

  @Input() position:number = 400;
  @Input() showSpeed:number = 500;
  @Input() moveSpeed:number = 700;

  @ViewChild('backTop') private _selector:ElementRef;

  ngAfterViewInit () {
    this._onWindowScroll();
  }

  @HostListener('click')
  _onClick():boolean {
    jQuery('html, body').animate({scrollTop:0}, {duration:this.moveSpeed});
    return false;
  }

  @HostListener('window:scroll')
  _onWindowScroll():void {
    let el = this._selector.nativeElement;
    window.scrollY > this.position ? jQuery(el).fadeIn(this.showSpeed) : jQuery(el).fadeOut(this.showSpeed);
  }

}
