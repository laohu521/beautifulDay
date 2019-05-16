import { Component,} from '@angular/core';
import { Router } from "@angular/router";


@Component({
  selector: 'firstPage',
  templateUrl: './firstPage.html',
  styleUrls: ['./firstPage.scss']
})
export class FirstPage {

  constructor(private router: Router) {
  }

  /**
    * 用户登录
    */
   appointment() {
   
    this.router.navigate(['/dashboard/secondPage']);
  }

}
