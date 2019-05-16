import {isNullOrUndefined, isNumber} from "util";
/**
 * 表格对象
 */
export class Table {
  start: number = 1;//当前页
  limit: number = 20;//每页显示条数 默认为20条
  totalSize: number = 0;//总条数
  data : Object[] = [];//表格数据
  loading : boolean = false;//加载层
  indeterminate : boolean = false;//设置 indeterminate 状态，只负责样式控制
  allChecked : boolean = false;//全部选中标识，默认为false
  queryParam : Object = {};//表格查询对象
  isQuery : boolean = false;//是否查询标识，默认为false
  ngModelOptions:Object = {standalone: true};
  checkData : Object[] = [];//选中的记录
  primaryKey : string = 'recNo';//主键key
  isMulti : boolean = false;//批量保存标识 默认为true，如果不需要批量保存，可设置为false
  noRefresh : boolean = true;//删除后无刷新标识，默认为true
  nzScroll : Object = {y: 290};//滚动配置
  //读写 readwrite  ：true -->查看  增删改 导出   false : 查看  导出
  //审核 checkedOn ： 审核
  //导入 importIn ： 导入
  moduleAuth : Object = {readwrite:false,checkedOn:false,importIn:false};//模块权限

  /**
   * 初始化表格参数
   */
  init(paramJson : Object = {}){
    this.showLoading();
    this.indeterminate = false;
    this.allChecked = false;
    this.checkData = [];
    this.primaryKey = paramJson['primaryKey']||this.primaryKey;
    this.isMulti = paramJson['isMulti']==true?true:false;
    this.noRefresh = paramJson['noRefresh']==false?false:true;
  }

  /**
   * 获取分页所需要的参数对象，不同的数据库分页请求参数索引不一样，需根据实际情况进行修改
   * @returns {{start: number, limit: number}}
   */
  getPaginationParam(){
    if(isNaN(this.start)){
      this.start = 1;
    }
    return {start:(this.start-1)*this.limit,limit:this.limit};
  }

  /**
   * 查询或重置时设置表格参数
   */
  isLoad(paramJson:Object = {}){
    paramJson = Object.assign({},{isQuery:false},paramJson);
    this.isQuery = paramJson['isQuery'];
    if(this.start!=1){
      this.showLoading();
      this.start = 1;//如果当前页不是第一页，则设置为第一页，会双向绑定自动加载
      return false;
    }else{
      return true;//如果当前页为第一页时，则需手动加载数据
    }
  }

  /**
   * 表格数据查询
   * @param paramJson 可选参数
   * @param callback 回调
   */
  onQuery(paramJson:Object = {},callback?: Function){
    paramJson = paramJson||{};
    paramJson = Object.assign({isQuery:true},paramJson);
    this.isQuery = paramJson['isQuery'];
    if(this.start!=1){
      //this.showLoading();
      this.start = 1;//如果当前页不是第一页，则设置为第一页，会双向绑定自动加载
    }else{
      if(callback!=null){
        callback();//如果当前页为第一页时，则需手动加载数据
      }
    }
  }

  /**
   * 表格数据重置
   * @param paramJson 可选参数
   * @param callback 回调
   */
  onRest(paramJson:Object = {},callback?: Function){
    paramJson = paramJson||{};
    paramJson = Object.assign({isQuery:false},paramJson);
    this.clearQueryParam();//清空查询参数
    this.isQuery = paramJson['isQuery'];
    if(this.start!=1){
      //this.showLoading();
      this.start = 1;//如果当前页不是第一页，则设置为第一页，会双向绑定自动加载
    }else{
      if(callback!=null){
        callback();//如果当前页为第一页时，则需手动加载数据
      }
    }
  }

  /**
   * 获取表格查询参数
   * @param paramJson
   * @returns {any}
   */
  getQueryParam(paramJson : Object = {}){
    paramJson = Object.assign({},{isPagination:true},paramJson);//默认有分页参数，如不需要则传{isPagination:false}
    let tableQueryParam : Object = {};//当前查询参数
    if(paramJson['isPagination']){
      if(this.isQuery){
        tableQueryParam = Object.assign({},this.queryParam,this.getPaginationParam());
      }else{
        tableQueryParam = this.getPaginationParam();
      }
    }else{
      if(this.isQuery){
        tableQueryParam = this.queryParam;
      }
    }
    return tableQueryParam;
  }

  /**
   * 清除表格查询参数
   */
  clearQueryParam(){
    this.queryParam = {};
  }

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
   * 全部选中
   */
  checkAll() {
    this.data.forEach(item => item['checked'] = this.allChecked);
    this.refChecked();
  }

  /**
   * 选中、不选
   */
  refChecked() {
    const checkedCount = this.data.filter(item => item['checked']).length;
    this.allChecked = checkedCount === this.data.length;
    this.indeterminate = this.allChecked ? false : checkedCount > 0;
  }

  /**
   * 是否有记录选中
   * @returns {number}
   */
  isChecked(){
    this.checkData = [];
    this.data.filter(item => {
      if(item['checked']){
        this.checkData = [...this.checkData,item];
      }
    });
    return this.checkData.length>0;
  }

  /**
   * 获取主键KEY数据集合，用于多条删除
   * @returns {string[]}
   */
  getPrimaryKeyParam(){
    let arrParam : string[] = [];//主键KEY数据
    this.checkData.filter(item=> {
      arrParam = [...arrParam,item[this.primaryKey]];
    });
    return arrParam;
  }

  /**
   * 获取主键KEY数据集合，用于多条删除--返回json
   * @returns {Object[]}
   */
  getPrimaryKeyParamJson(){
    let paramJson : Object = {};//主键KEY数据
    paramJson[this.primaryKey] = this.getPrimaryKeyParam().join(',');
    return paramJson;
  }


  /**
   * 可编辑行--开始编辑
   * @param rowIndex 行索引
   */
  startEdit(rowIndex){
    this.data[rowIndex]['isEdit'] = true;
  }

  /**
   * 可编辑行--结束编辑
   * @param rowIndex 行索引，为-1是关闭所有
   */
  endEdit(rowIndex:number = -1){
    if(rowIndex==-1){
      this.data.forEach(item => item['isEdit'] = false);
    }else{
      this.data[rowIndex]['isEdit'] = false;
    }
  }

  /**
   * 新增行
   * @param paramJson
   */
  insertRow(paramJson){
    paramJson['isEdit'] = true;
    this.data = [paramJson,...this.data];
    this.totalSize++;
  }

  /**
   * 新增行--不分页
   * @param paramJson
   */
  insertRowByNoPagination(paramJson){
    paramJson['isEdit'] = true;
    this.data = [paramJson,...this.data];
  }

  /**
   * 判断行是否处在可编辑状态
   * @returns {boolean}
   */
  isRowEdit(){
    return this.data.filter(item => item['isEdit']).length>0;
  }

  /**
   * 获取表格编辑状态时配置，用于限制单条修改
   */
  getEditOption(){
    return this.isRowEdit()?{}:null;
  }

  /**
   * 获取编辑行数据
   * @returns {Object[]}
   */
  getEditRowData(){
    let editRowData : Object[] = [];//编辑行数据
    this.data.filter(item => {
      if(item['isEdit']){
        editRowData = [...editRowData,item];
      }
    });
    return editRowData;
  }

  /**
   * 删除行
   * @param rowIndex 行索引,为-1是删除多行
   */
  deleteRow(rowIndex:number = -1){
    if(rowIndex==-1){
      let newData : Object[] = [];//删除后的新数据
      this.data.filter(item => {
        if(!item['checked']){
          newData = [...newData,item];
        }
      });
      this.totalSize = this.totalSize - this.data.length + newData.length;
      this.data = newData;
    }else{
      this.data = [...this.data.slice(0,rowIndex),...this.data.slice(rowIndex+1)];
      this.totalSize--;
    }
    return this.deleteRowAfterStart();
  }

  /**
   * 删除行--不分页
   * @param rowIndex 行索引,为-1是删除多行
   */
  deleteRowByNoPagination(rowIndex:number = -1){
    if(rowIndex==-1){
      let newData : Object[] = [];//删除后的新数据
      this.data.filter(item => {
        if(!item['checked']){
          newData = [...newData,item];
        }
      });
      this.data = newData;
    }else{
      this.data = [...this.data.slice(0,rowIndex),...this.data.slice(rowIndex+1)];
    }
  }

  /**
   * 删除行后如果当前页无数据则根据this.start来判断是否要加载上一页或下一页
   */
  deleteRowAfterStart(){
    let refreshByLoad : boolean = false;//刷新是否需要执行load方法，默认为false,因为页数改变自动会刷新
    if(this.noRefresh&&this.data.length==0){
      if(this.start>1){//当前页不是第一页时，加载上一页
        this.showLoading();
        this.start--;
      }else{//当前页是第一页时，如果页总数大于0则加载下一页
        if(this.totalSize>0){
          //this.showLoading();
          //this.start++;
          refreshByLoad = true;
        }
      }
    }
    return refreshByLoad;
  }

  /**
   * 对表格树数据进行转换
   * @param nodeData 当前返回的节点数据集合
   * @param parentNode 父节点
   * @param parentId 根节点的父节点parentId值 默认为''
   */
  convTreeNode(nodeData,parentNode,parentId:string=''){
    nodeData.forEach(item => {
      item['level'] = parentNode['level']+1;
      item['expand'] = false;//展开标识
      item['isReq'] = false;//展开数据请求标识，防止一直展开重复请求数据
      item['leaf'] = item['leaf']==true||item['leaf']=='true'?true:false;
      if(parentNode[this.primaryKey]!=parentId){//要跟根节点的parentId值一致，当前根节点parentId为，如果为空，则此处要改为''
        if(isNullOrUndefined(parentNode['parentIds'])){
          item['parentIds'] = parentNode[this.primaryKey];//当前节点的所有父节点parentId值,以','隔开
        }else{
          item['parentIds'] = parentNode['parentIds'] + ',' + parentNode[this.primaryKey];//当前节点的所有父节点parentId值,以','隔开
        }
      }
      item['toggle'] = false;//expand展开或隐藏操作子节点
    });
    return nodeData;
  }

  /**
   * 节点展开时异步请求数据，插入至当前节点后面
   * @param result 后端返回的结果
   * @param parentNode 父节点
   * @param isRoot 根节点标识true为根节点,false为非根节点
   * @param paramJson.errCodeKey 返回成功的校验码KEY，默认为errcode
   * @param paramJson.errCodeValue 返回成功的校验码value，默认为0
   * @param successCallback 成功回调函数
   * @param failCallback 失败回调函数
   */
  setTreeTableDataByRetdata(result,parentNode,isRoot,paramJson : Object = {},successCallback?: Function,failCallback?:Function){
    paramJson = paramJson||{};
    paramJson = Object.assign({errCodeKey:'errcode', errCodeValue:0},paramJson);
    this.closeLoading();
    if(this.isJson(result)&&result[paramJson['errCodeKey']]==paramJson['errCodeValue']){
      if(isRoot){
        this.data = this.convTreeNode(result['Retdata'],parentNode);
      }else{
        this.data = [...this.data.slice(0,parentNode['rowIndex']+1),...this.convTreeNode(result['Retdata'],parentNode),
          ...this.data.slice(parentNode['rowIndex']+1)];
      }

      if(successCallback!=null){
        successCallback();
      }
    }else{
      if(failCallback!=null){
        failCallback();
      }
    }
  }

  /**
   * 设置树节点值
   * @param node
   * @param value
   */
  setTreeTableNodePrimaryValue(node,value : string = ''){
    node[this.primaryKey] = value;
  }

  /**
   * 判断当前节点是否为根节点
   * @param node
   * @param value
   * @returns {boolean}
   */
  isRootByNodeParentValue(node,value:string=''){
    return node[this.primaryKey]==value?true:false;
  }

  /**
   * 节点展开事件
   * @param node
   */
  collapse(node){
    this.data.forEach(item => {
      if(!isNullOrUndefined(item['parentIds'] ) &&(','+ item['parentIds'] + ',').indexOf(',' + node[this.primaryKey] + ',')>-1){
        item['toggle'] = !node['expand'];
        if(item['isReq']){//如果数据请求过，设置为展开状态
          item['expand'] = true;
        }
      }
    });
  }

  /**
   * 表格排序
   * @param sortName 排序字段
   * @param value ascend升序、descend降序
   * @param isNum 是否是数字标识默认为false
   */
  sort(sortName, value,isNum:boolean = false) {
    if(isNum){
      this.data = [ ...this.data.sort((a, b) => {
        if(isNumber(a[sortName])&&isNumber(b[sortName])){
          if (a[sortName]-b[sortName]>0) {
            return (value === 'ascend') ? 1 : -1;
          } else if (a[sortName ]-b[ sortName ]<0) {
            return (value === 'ascend') ? -1 : 1;
          } else {
            return 0;
          }
        }else if(isNumber(a[sortName])&&!isNumber(b[sortName])){
          return (value === 'ascend') ? 1 : -1;
        }else if(!isNumber(a[sortName])&&isNumber(b[sortName])){
          return (value === 'ascend') ? -1 : 1;
        }else{
          return 0;
        }
      })];
    }else{
      this.data = [ ...this.data.sort((a, b) => {
        if (a[sortName] > b[sortName]) {
          return (value === 'ascend') ? 1 : -1;
        } else if (a[sortName ] < b[ sortName ]) {
          return (value === 'ascend') ? -1 : 1;
        } else {
          return 0;
        }
      })];
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
   * 设置表格数据
   * @param result 后端返回的结果
   * @param paramJson.errCodeKey 返回成功的校验码KEY，默认为errcode
   * @param paramJson.errCodeValue 返回成功的校验码value，默认为0
   * @param successCallback 成功回调函数
   * @param failCallback 失败回调函数
   */
  setTableDataByRetdata(result,paramJson : Object = {},successCallback?: Function,failCallback?:Function){
    paramJson = paramJson||{};
    paramJson = Object.assign({errCodeKey:'errcode', errCodeValue:0},paramJson);
    this.closeLoading();
    if(this.isJson(result)&&result[paramJson['errCodeKey']]==paramJson['errCodeValue']&&this.isJson(result['Retdata'])){
      this.data = result['Retdata']['dataList'];
      this.totalSize = result['Retdata']['totalSize'];
      if(successCallback!=null){
        successCallback();
      }
    }else{
      if(failCallback!=null){
        failCallback();
      }
    }
  }

  /**
   * 设置表格数据--不分页
   * @param result 后端返回的结果
   * @param paramJson.errCodeKey 返回成功的校验码KEY，默认为errcode
   * @param paramJson.errCodeValue 返回成功的校验码value，默认为0
   * @param successCallback 成功回调函数
   * @param failCallback 失败回调函数
   */
  setNoPaginationTableDataByRetdata(result,paramJson : Object = {},successCallback?: Function,failCallback?:Function){
    paramJson = paramJson||{};
    paramJson = Object.assign({errCodeKey:'errcode', errCodeValue:0},paramJson);
    this.closeLoading();
    if(this.isJson(result)&&result[paramJson['errCodeKey']]==paramJson['errCodeValue']){
      this.data = result['Retdata'];
      if(successCallback!=null){
        successCallback();
      }
    }else{
      if(failCallback!=null){
        failCallback();
      }
    }
  }

  /**
   * 可编辑表格增加、修改操作后处理
   * @param result 返回结果
   * @param rowIndex 操作的行索引
   * @param utilsService 工具类
   * @param paramJson.codeKey 操作标识KEY  result
   * @param paramJson.codeValue 操作标识值 1
   * @param successCallback 操作成功回调
   * @param failCallback 操作失败回调
   */
  modifyTableUpdateByRetdata(result,rowIndex,utilsService?:any,paramJson : Object = {},successCallback?: Function,failCallback?:Function){
    paramJson = paramJson||{};
    paramJson = Object.assign({codeKey:'result', codeValue:1},paramJson);//操作成功 result==1
    this.closeLoading();
    if(this.isJson(result)&&this.isJson(result['Retdata'])&&result['Retdata'][paramJson['codeKey']]==paramJson['codeValue']){//操作成功
      if(rowIndex>-1){
        this.endEdit(rowIndex);
        if(this.data[rowIndex][this.primaryKey]==''){
          this.data[rowIndex][this.primaryKey] = result['Retdata'][this.primaryKey];
        }
      }

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
   * 获取主键值
   * @param rowIndex
   * @returns {any}
   */
  getPrimaryValue(rowIndex){
    return rowIndex>-1?this.data[rowIndex][this.primaryKey]:'';
  }

  /**
   * 获取新增或修改的url
   * @param rowIndex 索引
   * @param insertUrl 新增url
   * @param updateUrl 修改url
   * @returns {any}
   */
  getUpdateUrl(rowIndex,insertUrl,updateUrl){
    return this.getPrimaryValue(rowIndex)==''?insertUrl:updateUrl;
  }

  /**
   * 删除表格行
   * @param result 返回结果
   * @param rowIndex 操作的行索引
   * @param utilsService 工具类
   * @param paramJson.codeKey 操作标识KEY  result
   * @param paramJson.codeValue 操作标识值 1
   * @param successCallback 操作成功回调
   * @param failCallback 操作失败回调
   */
  deleteTableRowByRetdata(result,rowIndex,utilsService?:any,paramJson : Object = {},successCallback?: Function,failCallback?:Function){
    paramJson = paramJson||{};
    paramJson = Object.assign({codeKey:'result', codeValue:1},paramJson);//操作成功 result==1
    if(this.isJson(result)&&this.isJson(result['Retdata'])&&result['Retdata'][paramJson['codeKey']]==paramJson['codeValue']){//操作成功
      let refreshByLoad : boolean = this.deleteRow(rowIndex);
      if(utilsService!=null){
        utilsService.message();
      }

      if(successCallback!=null){
        successCallback({refreshByLoad:refreshByLoad});
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
   * 删除表格行--不分页
   * @param result 返回结果
   * @param rowIndex 操作的行索引
   * @param utilsService 工具类
   * @param paramJson.codeKey 操作标识KEY  result
   * @param paramJson.codeValue 操作标识值 1
   * @param successCallback 操作成功回调
   * @param failCallback 操作失败回调
   */
  deleteNoPaginationTableRowByRetdata(result,rowIndex,utilsService?:any,paramJson : Object = {},successCallback?: Function,failCallback?:Function){
    paramJson = paramJson||{};
    paramJson = Object.assign({codeKey:'result', codeValue:1},paramJson);//操作成功 result==1
    if(this.isJson(result)&&this.isJson(result['Retdata'])&&result['Retdata'][paramJson['codeKey']]==paramJson['codeValue']){//操作成功
      this.deleteRowByNoPagination(rowIndex);
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
   * 返回是否需要刷新标识
   * @param data
   */
  isRefreshByLoad(data){
    return data['refreshByLoad'];
  }

  /**
   * 弹框数据发布后列表数据刷新或更新
   * @param data 列表数据
   * @param result 弹框返回的数据
   * @param callback 回调
   */
  releaseAfter(data,result,callback?: Function){
    if(this.isEmpty(data[this.primaryKey])) {//新增
      if(callback!=null){
        callback();
      }
    }else{
      data =  Object.assign(data,result);
    }
  }

  /**
   * 弹框数据发布后列表数据刷新或更新--(树表格)
   * @param data 列表数据
   * @param result 弹框返回的数据
   * @param isInsert 新增、修改标识
   * @param callback 回调
   */
  releaseAfterByTreeTable(data,result,isInsert,callback?: Function){
    if(isInsert) {//新增
      if(callback!=null){
        callback();
      }
    }else{
      data =  Object.assign(data,result);
    }
  }

  /**
   * 判断是否为null、空
   * @param value
   * @returns {boolean}
   */
  isEmpty(value): boolean {
    return value == null || (typeof value === 'string' && (value.length === 0||value ==undefined||value=='undefined'));
  }

  /**
   * 判断是否非null、空
   * @param value
   * @returns {boolean}
   */
  isNotEmpty(value): boolean {
    return !this.isEmpty(value);
  }

  /**
   * 根据索引获取数据
   * @param rowIndex 行索引
   * @returns {Object}
   */
  getDataByRowIndex(rowIndex){
    return this.data[rowIndex];
  }

  /**
   * 删除表格行--树表格
   * @param result 返回结果
   * @param rowIndex 操作的行索引
   * @param utilsService 工具类
   * @param paramJson.codeKey 操作标识KEY  result
   * @param paramJson.codeValue 操作标识值 1
   * @param successCallback 操作成功回调
   * @param failCallback 操作失败回调
   */
  deleteTreeTableRowByRetdata(result,rowIndex,utilsService?:any,paramJson : Object = {},successCallback?: Function,failCallback?:Function){
    paramJson = paramJson||{};
    paramJson = Object.assign({codeKey:'result', codeValue:1},paramJson);//操作成功 result==1
    if(this.isJson(result)&&this.isJson(result['Retdata'])&&result['Retdata'][paramJson['codeKey']]==paramJson['codeValue']){//操作成功
      this.deleteTreeRow(rowIndex);
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
   * 删除行--树表格
   * @param rowIndex 行索引
   */
  deleteTreeRow(rowIndex){
    this.data = [...this.data.slice(0,rowIndex),...this.data.slice(rowIndex+1)];
  }

  /**
   * 节点展开时异步请求数据，插入至当前节点后面
   * @param result 后端返回的结果
   * @param parentNode 父节点
   * @param parentId 根节点的父节点parentId值 默认为''
   * @param isRoot 根节点标识true为根节点,false为非根节点
   * @param callback 回调函数
   */
  setTreeTableData(result,parentNode,isRoot,parentId:string='',callback?: Function){
    this.closeLoading();
    if(isRoot){
      this.data = this.convTreeNode(result,parentNode,parentId);
    }else{
      this.data = [...this.data.slice(0,parentNode['rowIndex']+1),...this.convTreeNode(result,parentNode,parentId),
        ...this.data.slice(parentNode['rowIndex']+1)];
    }

    if(callback!=null){
      callback();
    }
  }
}
