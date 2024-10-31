import { assert } from "./common";
import VNode from "./vnode";
import { parseDirectives, parseListeners } from "./parser";
import Directives from "./directives";

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

    //只渲染--指令
    this._directive("init");
    //标记初始化
    this.state = "init";
  }

  render() {
    //只渲染自己--指令
    this._directive("update");
    //渲染子集
    //this.$children.forEach((element) => {});

    //标记初始化
    this.state = "update";
  }

  _directive(type) {
    //只渲染--指令
    this.$directives.forEach(directive => {
      let directiveObj = Directives[directive.name];
      assert(directiveObj, `no directive: ${directive.name}`);
      let dirFn = directiveObj[type];
      if (dirFn) {
        assert(typeof dirFn == "function");
        dirFn(this, directive);
      }
    });
  }
}
