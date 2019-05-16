/**
 * 表单对象
 */
export class Form {
  loading : boolean = false;//加载层
  data: Object = {};//表单数据

  /**
   * 加载loading层
   */
  showLoading(){
    this.loading = true;
  }

  /**
   * 关闭loading层
   */
  closeLoading(){
    this.loading = false;
  }

  /**
   * 返回表单校验对象
   * @param ngForm 表单
   * @param fieldName 校验字段名称
   * @returns {any}
   */
  getValidate(ngForm,fieldName){
    if(ngForm.controls[fieldName]&&ngForm.controls[fieldName]['errors']){
      return ngForm.controls[fieldName]['errors'];
    }else{
      return null;
    }
  }

  /**
   * 获取表单字段校验状态
   * @param ngForm 表单
   * @param fieldRef 校验字段ngModel
   * @param fieldName 校验字段名称
   * @returns {string}
   */
  getValidateStatus(ngForm,fieldRef,fieldName){
    let validateStatus : string = '';//校验状态
    if(fieldRef.touched&&this.getValidate(ngForm,fieldName)){
      validateStatus = 'error';
    }

    return validateStatus;
  }

  /**
   * 获取表单字段校验信息
   * @param ngForm 表单
   * @param fieldName 校验字段名称
   * @returns {string}
   */
  getValidateMessage(ngForm,fieldName){
    let validateMessage : string = '';//校验信息
    let oValidate : Object = this.getValidate(ngForm,fieldName);
    if(oValidate){
      validateMessage = oValidate['errMsg'];
    }

    return validateMessage;
  }

  /**
   * 根据返回过来的errcode判断是否请求成功及回调处理
   * @param result 返回结果
   * @param utilsService 工具类
   * @param paramJson.errCodeKey 返回成功的校验码KEY，默认为errcode
   * @param paramJson.errCodeValue 返回成功的校验码value，默认为0
   * @param successCallback 成功回调函数
   * @param failCallback 失败回调函数
   */
  successByErrcode(result,utilsService?:any,paramJson : Object = {},successCallback?: Function,failCallback?:Function){
    paramJson = paramJson||{};
    paramJson = Object.assign({errCodeKey:'errcode', errCodeValue:0},paramJson);
    this.closeLoading();
   // console.log(result);
    if(this.isJson(result)&&result[paramJson['errCodeKey']]==paramJson['errCodeValue']){
      if(utilsService!=null){
        utilsService.message();
      }

      if(successCallback!=null){
        successCallback();
      }
    }else{
      if(utilsService!=null){
        utilsService.message({success:false});
      }

      if(failCallback!=null){
        failCallback();
      }
    }
  }

  /**
   * 判断是否JSON对象
   * @param value
   */
  isJson(value):boolean{
    return typeof(value) == "object" && Object.prototype.toString.call(value).toLowerCase() == "[object object]" && !value.length;
  }

  /**
   * 获取新增或修改的url
   * @param isInsert true为新增
   * @param insertUrl 新增url
   * @param updateUrl 修改url
   * @returns {any}
   */
  getUpdateUrl(isInsert,insertUrl,updateUrl){
    return isInsert?insertUrl:updateUrl;
  }

  /**
   * 返回的结果为同步树数据时转换为树节点需要的数据格式
   * @param result 同步树数据
   * @param option 配置
   */
  convTreeNode(result,option:Object = {}){
    option = Object.assign({
      name:'text',
      id:'recNo',
      pid:'parentId',
      checked:'checked',
      children:'children',
      leaf:'leaf'
    },option);

    let tempData:Object[] = [];
    for(let i=0;i<result.length;i++){
      let treeNode: Object = {};
      treeNode['name'] = result[i][option['name']];
      treeNode['id'] = result[i][option['id']];
      treeNode['pid'] = result[i][option['pid']];
      treeNode['checked'] = result[i][option['checked']]==true||result[i][option['checked']]=='true'?true:false;
      tempData = [...tempData,treeNode];
      if(!result[i][option['leaf']]){
        let temp = result[i][option['children']];
        if(temp){
          tempData[i]['children'] = this.convTreeNode(temp,option);
        }
      }
    }
    return tempData;
  }

  /**
   * 获取checkbox选中的节点
   * @param treeData
   * @param nodeKey
   * @returns {string[]}
   */
  getTreeCheckNode(treeData,nodeKey : string ='id'){
    let tempData:Object[] = [];
    for(let i=0;i<treeData.length;i++){
      if(treeData[i]['checked']){
        if(nodeKey==''){
          tempData = [...tempData,treeData[i]];
        }else{
          tempData = [...tempData,treeData[i][nodeKey]];
        }
      }

      if(!treeData[i]['leaf']){
        let temp = treeData[i]['children'];
        if(temp){
          tempData = [...tempData,...this.getTreeCheckNode(temp)];
        }
      }
    }
    return tempData;
  }

  /**
   * 表单提交
   * @param result 返回结果
   * @param utilsService 工具类
   * @param paramJson.codeKey 操作标识KEY  result
   * @param paramJson.codeValue 操作标识值 1
   * @param successCallback 操作成功回调
   * @param failCallback 操作失败回调
   */
  submitByRetdata(result,utilsService?:any,paramJson : Object = {},successCallback?: Function,failCallback?:Function){
    paramJson = paramJson||{};
    paramJson = Object.assign({codeKey:'result', codeValue:1},paramJson);//操作成功 result==1
    this.closeLoading();
    if(this.isJson(result)&&this.isJson(result['Retdata'])&&result['Retdata'][paramJson['codeKey']]==paramJson['codeValue']){//操作成功
      if(utilsService!=null){
        utilsService.message();
      }

      if(successCallback!=null){
        successCallback();
      }
    }else{
      if(utilsService!=null){
        utilsService.message({success:false});
      }

      if(failCallback!=null){
        failCallback();
      }
    }
  }

  /**
   * 获取下拉框 valueValue的值
   * @param selectData 下拉框数据
   * @param selectKey 下拉框key --隐藏值
   * @param paramJson.valueValue 下拉框--显示值
   * @param paramJson.valueKey 下拉框--隐藏值
   * @returns {string}
   */
  getSelectValue(selectData,selectKey,paramJson : Object = {}){
    paramJson = paramJson||{};
    paramJson = Object.assign({valueValue:'valueValue', valueKey:'valueKey'},paramJson);
    let valueValue : string = '';
    for(let i = 0;i<selectData.length;i++){
      if(selectData[i][paramJson['valueKey']]==selectKey){
        valueValue = selectData[i][paramJson['valueValue']];
        break;
      }
    }
    return valueValue;
  }

  /**
   * 返回的结果为同步树数据时转换为树节点需要的数据格式--返回树数据跟选中的节点数据
   * @param result 同步树数据
   * @param option 配置
   * @param selectNode 初始已选中的节点
   */
  convTreeNodeSelect(result,option:Object = {},selectNode:Object[] = []){
    option = Object.assign({
      name:'text',
      id:'recNo',
      pid:'parentId',
      checked:'checked',
      children:'children',
      leaf:'leaf',
      treeData:'treeData'
    },option);

    let tempData:Object[] = [];
    for(let i=0;i<result.length;i++){
      let treeNode: Object = {};
      treeNode['name'] = result[i][option['name']];
      treeNode['id'] = result[i][option['id']];
      treeNode['pid'] = result[i][option['pid']];
      treeNode['checked'] = result[i][option['checked']]==true||result[i][option['checked']]=='true'?true:false;
      if(treeNode['checked']){
        selectNode = [...selectNode,treeNode];
      }
      tempData = [...tempData,treeNode];
      if(!result[i][option['leaf']]){
        let temp = result[i][option['children']];
        if(temp){
          tempData[i]['children'] = this.convTreeNodeSelect(temp,option,selectNode)[option['treeData']]||[];
        }
      }
    }
    return {treeData:tempData,selectNodeData:selectNode};
  }

  /**
   * 返回的结果为同步树数据时转换为级联需要的数据格式
   * @param result 同步树数据
   * @param option 配置
   * @param extOption 其它扩展的字段配置
   */
  convCascaderNode(result,option:Object = {},extOption:string[] = []){
    option = Object.assign({
      value:'value',
      label:'label',
      isLeaf:'isLeaf',
      children:'children'
    },option);

    let tempData:Object[] = [];
    for(let i=0;i<result.length;i++){
      let treeNode: Object = {};
      treeNode['value'] = result[i][option['value']];
      treeNode['label'] = result[i][option['label']];
      treeNode['isLeaf'] = result[i][option['isLeaf']]==true||result[i][option['isLeaf']]=='true'?true:false;
      extOption.forEach(item => treeNode[item] = result[i][item]);
      tempData = [...tempData,treeNode];
      if(!result[i][option['leaf']]){
        let temp = result[i][option['children']];
        if(temp){
          tempData[i]['children'] = this.convCascaderNode(temp,option,extOption);
        }
      }
    }
    return tempData;
  }
}
