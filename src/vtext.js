import { assert } from "./common";
import { compileStringTemplate } from "./expression";
import VNode from "./vnode";

/**
 * 虚拟文本类
 */
export default class VText extends VNode {
  constructor(options, component) {
    assert(options);
    assert(options.el);
    assert(options.data);

    super(options.el, component);

    //
    this._template = options.data;
    //console.log(options.data);

    //标记初始化
    this.state='init';
  }

  render() {
    let str = compileStringTemplate(this._template,this._component._data);
   // console.log(str);
    this._el.data=str;


   //标记初始化
   this.state = "update";

  }
}
