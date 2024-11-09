import { assert } from "./common";
import { compileStringTemplate } from "./expression";
import VNode from "./vnode";

/**
 * 虚拟文本类
 */
export default class VText extends VNode {
  constructor(options, parent) {
    assert(options);
    assert(options.el);
    assert(options.data);

    super(options.el, parent);

    //
    this._template = options.data;
    //console.log(options.data);

    //标记初始化
    this.state='init';

    //前一次渲染的结果
    this._last_str = undefined;
  }

  render() {
    let str = compileStringTemplate(this._template,this.$parent._proxy);
   // console.log(str);

   if(this._last_str !=str){
    this._el.data=str;
    //标记初始化
    this.state = "update";
    console.log('[vtext rendered]',this.name);

    this._last_str = str;
   }


  }
}
