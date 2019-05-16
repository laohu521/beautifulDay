import { Component, ElementRef, Inject, Renderer2, ViewChild } from '@angular/core';
import { Router } from "@angular/router";



@Component({
  selector: 'secondPage',
  templateUrl: './secondPage.html',
  styleUrls: ['./secondPage.scss']
})
export class SecondPage {
 
 
  constructor( private router: Router) {
  }

  

  IDcard (){
    this.router.navigate(['/dashboard/thirdPage']);
  }

}
