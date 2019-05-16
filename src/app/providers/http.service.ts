import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

/**
 * 封装HttpClient请求
 */
@Injectable()
export class HttpService {

  /**
   * 请求配置文件KEY
   * @type
   */
  requestKey : Object = {
    dashboard:'dashboard',
    dashboard2:'dashboard2',
    dashboard3:'dashboard3',
    dashboard4:'dashboard4',
    dashboard5:'dashboard5',
    dashboard6:'dashboard6',
  };

  constructor(public http: HttpClient) {
  }

  /**
   * httpClient get请求
   * @param url 请求地址
   * @param paramJson 请求参数
   * @param moduleKey 请求模块标识
   * @returns {Promise<T>}
   */
  get(url,paramJson : any = {},moduleKey:string = null): Promise<Object> {
    return new Promise((resolve,reject)=>{
      this.http.get(this.getUrl(url,moduleKey),this.getOptionByGet(paramJson)).subscribe(
        res => {
          resolve(res);
        }, err => {
          //reject(err);
          this.handleError(err);
        }
      );
    });
  }

  /**
   * httpClient post请求
   * @param url 请求地址
   * @param paramJson 请求参数
   * @param moduleKey 请求模块标识
   * @returns {Promise<T>}
   */
  post(url,paramJson : any = {},moduleKey:string = null): Promise<Object> {
    return new Promise((resolve,reject)=>{
      this.http.post(this.getUrl(url,moduleKey),this.getBody(paramJson)).subscribe(
        res => {
          resolve(res);
        }, err => {
          //reject(err);
          this.handleError(err);
        }
      );
    });
  }

  /**
   * httpClient post请求(参数不需要构造在passdata里面)
   * @param url 请求地址
   * @param paramJson 请求参数
   * @param moduleKey 请求模块标识
   * @returns {Promise<T>}
   */
  postSimple(url,paramJson : any = {},moduleKey:string = null): Promise<Object> {
    return new Promise((resolve,reject)=>{
      this.http.post(this.getUrl(url,moduleKey),this.getBodySimple(paramJson)).subscribe(
        res => {
          resolve(res);
        }, err => {
          //reject(err);
          this.handleError(err);
        }
      );
    });
  }

  /**
   * 根据moduleKey获取所对应的config配置信息
   * @param url
   * @param moduleKey
   * @returns {string}
   */
  getUrl(url:string,moduleKey:string):string {
    if(moduleKey==null){
      return url;
    }else{
      let keyJson = JSON.parse(sessionStorage.getItem(moduleKey));
      if(keyJson['proxy']){
        return url;
      }else{
        if(keyJson['test']){//测试环境
          return keyJson['url'] + url;
        }else{//生产环境
          return keyJson['pUrl'] + url;
        }
      }
    }
  }

  /**
   * 构造get请求option
   * @param paramJson
   * @returns {{}&{params: any}}
   */
  getOptionByGet(paramJson){
    return Object.assign({},{
      params:paramJson
    });
  }

  /**
   * 构造post请求body
   * @param paramJson
   * @returns {any}
   */
  getBody(paramJson){
    //paramJson['platformFlag'] = 1;//APP
    let loginUser = JSON.parse(sessionStorage.getItem('loginUser')||'{}');
    return {
      loginUsername :loginUser['loginUsername']||'',
      granularityRoleNo:loginUser['granularityRoleNo']||'',
       comCode : loginUser['customNo']||'',
      //comCode : localStorage.getItem('comCode'),
      token: loginUser['access_token']||'',
      passdata:paramJson
    };
  }

  /**
   * 构造post请求body(参数不需要构造在passdata里面)
   * @param paramJson
   * @returns {any}
   */
  getBodySimple(paramJson){
    //paramJson['platformFlag'] = 1;//APP
    return paramJson;
  }

  /**
   * 异常信息处理
   * @param error
   * @returns {Promise<void>}
   */
  handleError(error: any): Promise<any> {
    return Promise.resolve();
  }
}
