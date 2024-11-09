import { assert } from "./common";
import VNode from "./vnode";
import { parseDirectives, parseDOM, parseListeners } from "./parser";
import { createVDom } from "./vdom";

/**
 * 虚拟元素类
 */
export default class VElement extends VNode {
  constructor(options, parent) {
    assert(options);
    assert(options.el);
    assert(options.tag);
    assert(options.attrs);
    assert(options.children);

    super(options.el, parent);

    this.type = options.tag;
    this.$attrs = options.attrs;
    this.$directives = parseDirectives(options.attrs);
    this.$listeners = parseListeners(this.$directives);
    this.$options = options;

    //
    // this._data = createProxy({},component._data,()=>{
    //   this.render();
    // });

    this._data = {};
    let _this = this;
    this._proxy = new Proxy(this._data, {
      get(data, name) {
        return _this._get(name);
      },
      set(data, name, val) {
        _this.$root._data[name] = val;
        return true;
      },
    });
  }

  _get(name) {
    let cur = this;
    while (cur) {
      if (cur._data[name] !== undefined) {
        return cur._data[name];
      }
      cur = cur.$parent;
    }
    return undefined;
  }

  _set(name, val) {
    this._data[name] = val;
  }

  render() {
    //只渲染自己--指令
    this._directive("update");
    //渲染子集
    this.$children.forEach((child) => {
      child.render();
    });
    //标记初始化
    this.state = "update";

    // console.log('[velement rendered]',this.name);
  }

  _directive(type) {
    //优先执行,执行指令，渲染--指令
    doDirectives.call(this, this.$directives);

    //执行指令，渲染--指令
    function doDirectives(arr) {
      arr.forEach((directive) => {
        let directiveObj = this.$root._directives[directive.name];
        assert(directiveObj, `no directive: ${directive.name}`);
        let dirFn = directiveObj[type];
        if (dirFn) {
          assert(typeof dirFn == "function");
          dirFn(this, directive);
        }
      });
    }
  }

  /**
   * 克隆
   * @returns
   */
  clone() {
    let element = parseDOM(this._el.cloneNode(true));
    delete element.attrs["v-for"];
    let tree = createVDom(element, this.$parent, this.$root);
    //console.log(tree);
    return tree;
  }

  //初始化所有element
  init() {
    //只渲染--指令
    this._directive("init");
    //标记初始化
    this.state = "init";
    if (this.$children) {
      this.$children.forEach((child) => {
        if (child instanceof VElement) {
          child.init();
        }
      });
    }
  }
}
