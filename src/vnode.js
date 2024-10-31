import { assert } from "./common";

/**
 * 虚拟节点元素类
 */
export default class VNode {
  constructor(el, component) {
    assert(el);
    assert(el instanceof Node);
    assert(component);

    //标记初始化
    this.state = "";

    this._el = el;
    this._component = component;
  }

  render() {
    throw new Error("render method not defined");
  }
}
