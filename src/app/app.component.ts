import {Component, Inject} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(@Inject('httpService') private httpService){
  }

  /**
   * 初始加载
   */
  ngOnInit() {
    this.initConfig();
  }

  /**
   * 初始化配置文件
   */
  initConfig(){
    this.httpService.get('assets/json/config.json').then(result => {
      this.setLocalStorage(result);
    });
  }

  /**
   * 设置本地存储
   * @param result
   */
  setLocalStorage(result){
    for (let key in result) {
      sessionStorage.setItem(key,JSON.stringify(result[key]));
    }
  }
}