import { assert } from "./common";
import VElement from "./velement";

/**
 * 虚拟组件类
 */
export default class VComponent extends VElement {
  //?
  constructor(options, component) {
    assert(options);

    super(options, component);

    //标记初始化
    this.state = "init";
  }

  render(){
   //标记初始化
   this.state = "update";
   //
  }
}
