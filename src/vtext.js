import { assert } from "./common";
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
    this._data = options.data;
  }

  render() {}
}
