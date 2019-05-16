import { Component, ElementRef, Inject, Renderer2, ViewChild } from '@angular/core';
import { Router } from "@angular/router";



@Component({
  selector: 'thirdPage',
  templateUrl: './thirdPage.html',
  styleUrls: ['./thirdPage.scss']
})
export class ThirdPage {
  
  constructor(private router: Router) {
  }


  submit() {
    this.router.navigate(['/dashboard/fourthPage']);
  }

 
}
