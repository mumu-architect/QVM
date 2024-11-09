import { assert } from "./common";
import { v4 as uuid} from "uuid";

/**
 * 虚拟节点元素类
 */
export default class VNode {
  constructor(el, parent) {
    assert(el);
    assert(el instanceof Node);

    //标记初始化
    this.state = '';

    this._el = el;
    this.$parent = parent;

    //区分每个组件，那个数据变动，渲染那个组件
    this.name = uuid();
  }

  //克隆VNode
  clone(){
    return new VNode(this._el.cloneNode(true),this._component);
  }

  render() {
    throw new Error("render method not defined");
  }
}
