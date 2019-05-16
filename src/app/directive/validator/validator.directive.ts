import { Validator, AbstractControl,NG_VALIDATORS } from '@angular/forms';
import { Directive,forwardRef, Attribute } from '@angular/core';
import {isNullOrUndefined} from "util";

/**
 * 表单校验指令
 * @param c
 * @returns {{errObj: {valid: boolean, errMsg: string}}}
 */
@Directive({
  selector: '[validateType][ngModel]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => ValidatorDirective), multi: true }
  ]
})
export class ValidatorDirective implements Validator{
  constructor(@Attribute('validateType') public validateType: string) {}

  validate(c: AbstractControl): { [key: string]: any } {
    let value = c.value;
    if(isNullOrUndefined(value)) {
      value = '';
    }

    let validateResult : Object = null;//校验结果
    let arrType : string[] = this.validateType.split('-');
    if(arrType.length==2){
      validateResult = this.validateMaxlength(value,parseInt(arrType[1]));
    }

    if(validateResult==null){
      switch(arrType[0]) {
        case 'required':
          validateResult = this.validateRequired(value);
          break;
        case 'mobile':
          validateResult = this.validateMobile(value,true);
          break;
        case 'mobileE':
          validateResult = this.validateMobile(value,false);
          break;
        case 'email':
          validateResult = this.validateEmail(value,true);
          break;
        case 'emailE':
          validateResult = this.validateEmail(value,false);
          break;
        case 'identity':
          validateResult = this.validateIdentity(value,true);
          break;
        case 'identityE':
          validateResult = this.validateIdentity(value,false);
          break;
        case 'nonnegativeInteger':
          validateResult = this.validateNonnegativeInteger(value,true);
          break;
        case 'nonnegativeIntegerE':
          validateResult = this.validateNonnegativeInteger(value,false);
          break;
        case 'ipv4':
          validateResult = this.validateIp4(value,true);
          break;
        case 'ipv4E':
          validateResult = this.validateIp4(value,false);
          break;
        case 'positive':
          validateResult = this.validatePositive(value,true);
          break;
        case 'positiveE':
          validateResult = this.validatePositive(value,false);
          break;
        case 'money':
          validateResult = this.validateMoney(value,true);
          break;
        case 'moneyE':
          validateResult = this.validateMoney(value,false);
          break;
        case 'date':
          validateResult = this.validateDate(value,true);
          break;
        case 'dateE':
          validateResult = this.validateDate(value,false);
          break;
      }
    }

    return validateResult;
  }

  /**
   * 长度校验
   * @param value
   * @param maxlength
   * @returns {{valid: boolean, errMsg: string}}
   */
  validateMaxlength(value,maxlength){
    return value.length<=maxlength?null:{valid: false,errMsg:'不能超过'+maxlength+'字符!'};
  }

  /**
   * 非空校验
   * @param value
   * @returns {{valid: boolean, errMsg: string}}
   */
  validateRequired(value){
    value = value + '';
    let regx = /(^\s*)|(\s*$)/g;
    return value.replace(regx, '') != ''?null:{valid: false,errMsg:'不能为空!'};
  }

  /**
   * 手机校验
   * @param value
   * @param isRequired 是否必填
   * @returns {{valid: boolean, errMsg: string}}
   */
  validateMobile(value,isRequired){
    let regx = /^1[34578]\d{9}$/;
    if(isRequired||(!isRequired&&value!='')){
      return regx.test(value) ? null : {valid: false,errMsg:'手机/电话号码格式有误!'};
    }
    return null;
  }

  /**
   * 邮箱校验
   * @param value
   * @param isRequired 是否必填
   * @returns {{valid: boolean, errMsg: string}}
   */
  validateEmail(value,isRequired){
    let regx = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
    if(isRequired||(!isRequired&&value!='')){
      return regx.test(value) ? null : {valid: false,errMsg:'邮箱格式有误!'};
    }
    return null;
  }

  /**
   * 身份证校验
   * @param value
   * @param isRequired 是否必填
   * @returns {{valid: boolean, errMsg: string}}
   */
  validateIdentity(value,isRequired){
    let regx = /^[1-9]{1}[0-9]{14}$|^[1-9]{1}[0-9]{16}([0-9]|[xX])$/;
    if(isRequired||(!isRequired&&value!='')){
      return regx.test(value) ? null : {valid: false,errMsg:'身份证格式有误!'};
    }
    return null;
  }

  /**
   * 非负整数校验
   * @param value
   * @param isRequired 是否必填
   * @returns {{valid: boolean, errMsg: string}}
   */
  validateNonnegativeInteger(value,isRequired){
    let regx = /^([1-9]\d*|[0]{1,1})$/;
    if(isRequired||(!isRequired&&value!='')){
      return regx.test(value) ? null : {valid: false,errMsg:'请输入非负整数!'};
    }
    return null;
  }

  /**
   * IP地址校验
   * @param value
   * @param isRequired 是否必填
   * @returns {{valid: boolean, errMsg: string}}
   */
  validateIp4(value,isRequired){
    let regx = /^((25[0-5]|2[0-4]\d|[01]?\d\d?)($|(?!\.$)\.)){4}$/;
    if(isRequired||(!isRequired&&value!='')){
      return regx.test(value) ? null : {valid: false,errMsg:'IP地址格式有误!'};
    }
    return null;
  }

  /**
   * 正数校验
   * @param value
   * @param isRequired 是否必填
   * @returns {{valid: boolean, errMsg: string}}
   */
  validatePositive(value,isRequired){
    let regx = /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/;
    if(isRequired||(!isRequired&&value!='')){
      return regx.test(value) ? null : {valid: false,errMsg:'请输入正数!'};
    }
    return null;
  }

  /**
   * 正数校验
   * @param value
   * @param isRequired 是否必填
   * @returns {{valid: boolean, errMsg: string}}
   */
  validateMoney(value,isRequired){
    let regx = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
    if(isRequired||(!isRequired&&value!='')){
      return regx.test(value) ? null : {valid: false,errMsg:'金额格式有误!'};
    }
    return null;
  }

  /**
   * 日期校验
   * @param value
   * @param isRequired 是否必填
   * @returns {{valid: boolean, errMsg: string}}
   */
  validateDate(value,isRequired){
    let regx = /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;
    if(isRequired||(!isRequired&&value!='')){
      return regx.test(value) ? null : {valid: false,errMsg:'日期格式有误!'};
    }
    return null;
  }
}
