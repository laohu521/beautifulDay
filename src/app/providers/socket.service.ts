import { Injectable } from '@angular/core';
// import {Observable} from "rxjs/Observable";

/**
 * 封装WebSocketService
 */
@Injectable()
export class WebSocketService {

  ws:WebSocket;
  ws2:WebSocket;
  constructor() { }

  /**
   * 创建WebSocket
   * @param url
   * @returns {Observable|"../../../Observable".Observable|"../../Observable".Observable}
   */
  // createObservableSocket(url:string):Observable<any>{
  //   this.ws = new WebSocket(url);
  //   return new Observable(
  //     observer=>{
  //       this.ws.onmessage=(event)=>observer.next(event.data);
  //       this.ws.onerror=(event)=>observer.error(event);
  //       this.ws.onclose=(event)=>observer.complete();
  //     }
  //   )
  // }

  /**
   * 发送消息
   * @param message
   */
  sendMessage(message:any){
    this.ws.send(message);
  }

  /**
   * 关闭
   */
  close(){
    this.ws.close();
  }

  /**
   * 创建WebSocket
   * @param url
   * @returns {Observable|"../../../Observable".Observable|"../../Observable".Observable}
   */
  // createObservableSocket2(url:string):Observable<any>{
  //   this.ws2 = new WebSocket(url);
  //   return new Observable(
  //     observer=>{
  //       this.ws2.onmessage=(event)=>observer.next(event.data);
  //       this.ws2.onerror=(event)=>observer.error(event);
  //       this.ws2.onclose=(event)=>observer.complete();
  //     }
  //   )
  // }

  /**
   * 发送消息
   * @param message
   */
  sendMessage2(message:any){
    this.ws2.send(message);
  }

  /**
   * 关闭
   */
  close2(){
    if(this.ws2!=null){
      this.ws2.close();
    }
  }
}
