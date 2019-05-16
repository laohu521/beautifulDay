import {
  Directive, HostListener, Output, EventEmitter, Input, ChangeDetectorRef, Inject
} from '@angular/core';

/**
 * 选择照片指令
 */
@Directive({
  selector: '[selectPicture]'
})
export class SelectPictureDirective {

  @Input() selectOption: Object = {};//select配置
  @Output() selected: any = new EventEmitter();//选择完后输出回调事件
  constructor(@Inject('utilsService') private utilsService,private cdf: ChangeDetectorRef) {}

  @HostListener('change', ['$event'])
  onChange(event) {
    if(event.target.files.length>0){
      let fileType : string = event.target.files[0]['type'];//文件类型
      if(/image\/\w+/.test(fileType)){//图片类型
        let thiz = this;
        let fileReader = new FileReader();
        fileReader.readAsDataURL(event.target.files[0]);
        fileReader.onload = function(ef){
          let result = ef.target['result'];//返回图片URL
          let image = new Image();
          image.src = result;
          image.onload = function() {  //创建一个image对象，给canvas绘制使用
            let cvs = document.createElement('canvas');
            let scale = 1;
            if(this['width'] > 1000 || this['height'] > 1000){  //1000只是示例，可以根据具体的要求去设定
              if(this['width'] > this['height']){//计算等比缩小后图片宽高
                scale = 1000 / this['width'];
              }else{
                scale = 1000 / this['height'];
              }
            }
            cvs.width = this['width'] * scale;
            cvs.height = this['height'] *scale;
            let ctx = cvs.getContext('2d');
            ctx.drawImage(image, 0, 0, cvs.width, cvs.height);
            thiz.selected.emit(cvs.toDataURL(fileType, 0.8));//回调
            thiz.listenerChanges();//监听变更
          }
        }
      }else{
        this.utilsService.alert({title:'请选择图片!'});
      }
    }
  }

  /**
   * 监听变更
   */
  listenerChanges(){
    this.cdf.markForCheck();    // 进行标注
    this.cdf.detectChanges();   // 要多加一行这个 执行一次变化检测
  }
}


/**
 * 删除照片指令
 */
@Directive({
  selector: '[deletePicture]'
})
export class DeletePictureDirective {

  @Input() deleteIndex: number = -1;//删除配置
  @Output() deleted: any = new EventEmitter();//选择完后输出回调事件
  constructor(private cdf: ChangeDetectorRef) {}

  @HostListener('click', ['$event'])
  onClick(event) {
    this.deleted.emit(this.deleteIndex);
    this.listenerChanges();
  }

  /**
   * 监听变更
   */
  listenerChanges(){
    this.cdf.markForCheck();    // 进行标注
    this.cdf.detectChanges();   // 要多加一行这个 执行一次变化检测
  }
}
