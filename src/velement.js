import { assert } from "./common";
import VNode from "./vnode";
import { parseDirectives, parseListeners } from "./parser";

/**
 * 虚拟元素类
 */
export default class VElement extends VNode {
  constructor(options, component) {
    assert(options);
    assert(options.el);
    assert(options.tag);
    assert(options.attrs);
    assert(options.children);

    super(options.el, component);

    this.type = options.tag;
    this.$attrs = options.attrs;
    this.$directives = parseDirectives(options.attrs);
    this.$listeners = parseListeners(this.$directives);
  }

  render() {
    //只渲染--指令
    this._el.this.$children.orEach((element) => {});
  }
}
