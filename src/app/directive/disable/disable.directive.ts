import {Directive, Input, ElementRef, Renderer2} from '@angular/core';

/**
 * html disabled 属性指令
 */
@Directive({
  selector: '[disable]'
})
export class DisableDirective {
  @Input() option: Object = {};//配置

  constructor(public elementRef:ElementRef,private renderer:Renderer2) {}

  ngOnChanges(){
    if(this.option!=null){
      this.renderer.setAttribute(this.elementRef.nativeElement,'disabled','');
    }else{
      this.renderer.removeAttribute(this.elementRef.nativeElement,'disabled');
    }
  }
}

