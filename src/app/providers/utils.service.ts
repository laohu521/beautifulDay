import { Injectable } from '@angular/core';
import { isDate, isNullOrUndefined, isNumber } from "util";
import { NzMessageService, NzModalService } from "ng-zorro-antd";

declare let $;

/**
 * UtilsService类存放和业务无关的公共方法
 * @description
 */
@Injectable()
export class UtilsService {

  public fmtYMD: string = 'yyyy-MM-dd';//时间格式 YMD
  public fmtYMDHMS: string = 'yyyy-MM-dd hh:mm:ss';//时间格式 YMDHMS

  constructor(private modalService: NzModalService, private messageService: NzMessageService) {

  }

  /**
   * 判断是否为null、空
   * @param value
   * @returns {boolean}
   */
  public isEmpty(value): boolean {
    return value == null || (typeof value === 'string' && (value.length === 0 || value == undefined || value == 'undefined'));
  }

  /**
   * 判断是否非null、空
   * @param value
   * @returns {boolean}
   */
  public isNotEmpty(value): boolean {
    return !this.isEmpty(value);
  }

  /**
   * 判断是否JSON对象
   * @param value
   */
  public isJson(value): boolean {
    return typeof (value) == "object" && Object.prototype.toString.call(value).toLowerCase() == "[object object]" && !value.length
  }

  /**
   * 格式化日期
   * @param date 日期
   * @param fmt 格式
   * @returns {string}
   */
  format(date: Date, fmt: string): string {
    let o = {
      "M+": date.getMonth() + 1, //月份
      "d+": date.getDate(), //日
      "h+": date.getHours(), //小时
      "m+": date.getMinutes(), //分
      "s+": date.getSeconds(), //秒
      "q+": Math.floor((date.getMonth() + 3) / 3), //季度
      "S": date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt))
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt))
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
  }

  /**
   * 获取当前日期
   * @returns {string}
   */
  public getCurrentDay(): string {
    return this.format(new Date(), this.fmtYMD);
  }

  /**
   * 获取当前日期时、分、秒
   * @returns {string}
   */
  public getDate(paramJson: Object): string {
    let fmt = paramJson['fmt'] || this.fmtYMDHMS;
    if (this.isEmpty(paramJson['timestamp'])) {
      return this.format(new Date(), fmt);
    } else {
      return this.format(new Date(paramJson['timestamp']), fmt);
    }
  }

  /**
   * 时间相加减
   * @param paramJson
   * @param paramJson.date 时间
   * @param paramJson.type d-天，h-小时,m-分钟,s-秒
   * @param paramJson.offSet 相加减 偏移量
   * @param paramJson.fmt 格式
   * @returns {any}
   */
  public addTime(paramJson: Object): string {
    let offSet = paramJson['offSet'] || 1;//默认偏移量为1
    if (paramJson['type'] == 'd') {//天
      let fmt = paramJson['fmt'] || this.fmtYMD;
      return this.format(new Date(this.parserDate(paramJson['date']).getTime() + offSet * 24 * 60 * 60 * 1000), fmt);
    } else if (paramJson['type'] == 'h') {//小时
      let fmt = paramJson['fmt'] || this.fmtYMDHMS;
      return this.format(new Date(this.parserDate(paramJson['date']).getTime() + offSet * 60 * 60 * 1000), fmt);
    } else if (paramJson['type'] == 'm') {//分钟
      let fmt = paramJson['fmt'] || this.fmtYMDHMS;
      return this.format(new Date(this.parserDate(paramJson['date']).getTime() + offSet * 60 * 1000), fmt);
    } else if (paramJson['type'] == 's') {//秒
      let fmt = paramJson['fmt'] || this.fmtYMDHMS;
      return this.format(new Date(this.parserDate(paramJson['date']).getTime() + offSet * 1000), fmt);
    } else {
      return paramJson['date'];
    }
  }

  /**
   * 日期加减得到天数
   * @param beginData string 开始日期
   * @param endData string 结束日期
   * @returns {any}
   */
  public dateDiff(beginData: string, endData: string) {
    return (this.parserDate(endData).getTime() - this.parserDate(beginData).getTime()) / (24 * 60 * 60 * 1000);
  }

  /**
   * 字符串转换成日期
   * @param date
   * @returns {Date}
   */
  public parserDate(date: string): Date {
    if (this.isEmpty(date)) {
      return new Date();
    } else {
      let t = Date.parse(date.replace(/-/g, "/"));
      if (!isNaN(t)) {
        return new Date(t);
      } else {
        return new Date();
      }
    }
  }

  /**
   * 拍照、选择照片选择base64数组
   * @param arrBase64 base64数组
   * @param event 待操作的数组或索引
   */
  getArrBase64(arrBase64, base64OrIndex) {
    if (isNumber(base64OrIndex)) {//整形为索引时删除图片
      arrBase64 = [...arrBase64.slice(0, base64OrIndex), ...arrBase64.slice(base64OrIndex + 1)];
    } else {
      arrBase64 = [...arrBase64, base64OrIndex];
    }
    return arrBase64;
  }


  getBase64(img) {//传入图片路径，返回base64
    let image = new Image();
    image.setAttribute('crossOrigin', 'anonymous');//测试语句
    // image.crossOrigin = '';
    image.src = img;
    let deferred = $.Deferred();
    if (img) {
      let thiz = this;
      // image.onload = function () {
      //   console.log('123')
      //   deferred.resolve(thiz.getBase64Image(image));//将base64传给done上传处理
      // }
      image.onload = () => {
        deferred.resolve(thiz.getBase64Image(image));//将base64传给done上传处理
      }
      return deferred.promise();//问题要让onload完成后再return sessionStorage['imgTest']
    }
  }

  getBase64Image(img) {//width、height调用时传入具体像素值，控制大小 ,不传则默认图像大小
    let canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    let ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    let dataURL = canvas.toDataURL();
    return dataURL;
  }

  /**
   * 根据KEY获取本地存储chu
   * @param key
   */
  getLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key) || '{}');//备注：如果key为空 需赋值{}，不然JSON.parse报异常
  }

  /**
   * 根据KEY获取本地存储
   * @param key
   */
  getSessionStorage(key) {
    return JSON.parse(sessionStorage.getItem(key) || '{}');//备注：如果key为空 需赋值{}，不然JSON.parse报异常
  }

  /**
   * 判断是否登录
   * @returns {boolean}
   */
  isLogin() {
    let loginUser = JSON.parse(this.getLoginUser() || '{}');
    let loginUsername = loginUser['loginUsername'] || '';
    return loginUsername != '';
  }

  /**
   * 获取当前用户对象
   */
  getLoginUser() {
    return sessionStorage.getItem('loginUser');
  }

  /**
   * 清除用户对象
   */
  clearLoginUser() {
    sessionStorage.removeItem('loginUser');
  }

  /**
   * 清除缓存对象
   * @param key
   */
  clearSessionStorage(key) {
    sessionStorage.removeItem(key);
  }

  /**
   * 设置用户缓存
   * @param loginUser
   */
  setLoginUser(loginUser) {
    sessionStorage.setItem('loginUser', JSON.stringify(loginUser));
  }

  /**
   * 设置左侧菜单相关权限信息缓存--以路由路径为KEY
   */
  setAuthStorage(key, value) {
    let authStorage: Object = JSON.parse(sessionStorage.getItem('authStorage') || '{}');
    authStorage[key] = value;
    sessionStorage.setItem('authStorage', JSON.stringify(authStorage));
  }

  /**
   * 获取权限信息
   * @returns {any}
   */
  getAuthStorage() {
    return this.getSessionStorage('authStorage');
  }

  /**
   * 根据KEY获取权限信息
   * @param key
   * @returns {any}
   */
  getAuthStorageByKey(key) {
    return this.getAuthStorage()[key];
  }

  /**
   * 弹框
   * @param param.component 弹框面板
   * @param param.modalParam 弹框参数 默认为{}
   * @param callback 点击提交或确认后回调
   */
  // openModal(param: Object = {}, callback?: Function) {
  //   this.modalService.open({
  //     content: param['component'],
  //     footer: false,
  //     maskClosable: false,
  //     zIndex: param['zIndex'] || 1000,
  //     width: param['width'] || 750,
  //     style: param['style'] || { top: '80px' },
  //     componentParams: {
  //       modalParam: param['modalParam'] || {}
  //     }
  //   }).subscribe(result => {
  //     if (this.isJson(result) && callback != null) {
  //       callback(result);
  //     }
  //   });
  // }

  /**
   * 提示窗口
   * @param param
   */
  tooltip(param: Object = {}) {
    let confirmType: string = param['confirmType'] || 'success';//提示类型： info、success(默认)、error、warning
    let title: string = param['message'] || '操作成功!';//提示标题
    if (isNullOrUndefined(param['confirmType'])) {//优先级 confirmType>success
      if (!isNullOrUndefined(param['success']) && !param['success']) {
        confirmType = 'error';
      }
    }

    if (isNullOrUndefined(param['message'])) {//提示信息
      if (confirmType == 'error') {
        title = '操作失败!';
      } else if (confirmType == 'info') {
        title = '提示';
      } else if (confirmType == 'warning') {
        title = '警告';
      }
    }

    /*const modal = this.modalService._openConfirm({
      confirmType:confirmType,
      title:title,
      style:{top:'10px'},
      okText:param['okText']||'关闭'//按钮名称
    });
    setTimeout(() => modal.destroy(), 3000);//3秒后自动关闭*/
  }

  /**
   * 提示消息窗口
   * @param param
   */
  message(param: Object = {}) {
    let type: string = param['type'] || 'success';//提示类型： info、success(默认)、error、warning
    let content: string = param['message'] || '操作成功!';//提示文本
    if (isNullOrUndefined(param['type'])) {//优先级 type>success
      if (!isNullOrUndefined(param['success']) && !param['success']) {
        type = 'error';
      }
    }

    if (isNullOrUndefined(param['message'])) {//提示文
      if (type == 'error') {
        content = '操作失败,请稍候再尝试...';
      } else if (type == 'info') {
        content = '提示';
      } else if (type == 'warning') {
        content = '警告';
      }
    }

    this.messageService.create(type, content);
  }

  /**
   * 确认对话框
   * @param param
   */
  confirm(onOk: Function, param: Object = {}, onCancel?: Function) {
    let msgIndex: number = 0;//索引默认为0
    let arrMsg: string[] = ['您是否要删除该记录吗?', '您是否要提交该记录吗?', '您是否要删除所选中的记录吗?', '您是否要批量提交所操作的记录吗'];
    let title: string = '';//对话框提示信息
    if (isNullOrUndefined(param['message'])) {
      if (!isNullOrUndefined(param['msgIndex']) && param['msgIndex'] < arrMsg.length) {
        msgIndex = param['msgIndex'];
      }
      title = arrMsg[msgIndex];//对话框提示信息
    } else {
      title = param['message'];
    }

    // this.modalService.confirm({
    //   // title: title,
    //   zIndex: param['zIndex'] || 1001,
    //   onOk: () => {
    //     onOk();
    //   }, onCancel: () => {
    //     if (onCancel != null) {
    //       onCancel();
    //     }
    //   }
    // });
  }

  /**
   * 随机4位16进制
   * @returns {string}
   * @constructor
   */
  S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }

  /**
   * 生成guid
   * @returns {string}
   */
  guid() {
    return (this.S4() + this.S4() + this.S4() + this.S4() + this.S4() + this.S4() + this.S4() + this.S4());
  }

  /**
   * 关闭弹框
   * @param modalSubject
   */
  onClose(modalSubject) {
    modalSubject.destroy('onCancel');
  }

  /**
   * 获取时间
   * @param value
   * @param index
   * @returns {any}
   */
  getDateValue(value, fmtYMD: string = 'yyyy-MM-dd') {
    if (isDate(value)) {
      value = this.format(value, fmtYMD)
    }
    return value;
  }

  /**
   * 对象比较是否相等
   * @param x
   * @param y
   * @returns {any}
   */
  oEquals(x, y) {
    let in1 = x instanceof Object;
    let in2 = y instanceof Object;
    if (!in1 || !in2) {
      return x === y;
    }
    if (Object.keys(x).length !== Object.keys(y).length) {
      return false;
    }
    for (let p in x) {
      let a = x[p] instanceof Object;
      let b = y[p] instanceof Object;
      if (a && b) {
        return this.oEquals(x[p], y[p]);
      }
      else if (x[p] !== y[p]) {
        return false;
      }
    }
    return true;
  }

  /**
   * 判断数组里面是否包含某个对象
   * @param arr
   * @param o
   */
  arrIncludeObject(arr, o) {
    let success: boolean = false;
    for (let key in arr) {
      if (this.oEquals(arr[key], o)) {
        success = true;
        break;
      }
    }
    return success;
  }

  /**
   * 获取当前活动路由的URL
   * @returns {string}
   */
  getActivatedRouteUrl(activatedRoute) {
    let url: string = activatedRoute.snapshot['_routerState']['url'];
    let splitIndex = url.indexOf('?');//url 中的?分割符索引
    if (splitIndex > -1) {
      url = url.substring(0, splitIndex);
    }
    return url;
  }

  /**
   * 获取当前路由权限
   * @param activatedRoute
   */
  getModuleAuth(activatedRoute) {
    return this.getAuthStorageByKey(this.getActivatedRouteUrl(activatedRoute));
  }
}
