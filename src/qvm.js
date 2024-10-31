import VComponent from "./vcomponent";
import { dom } from "./common";
import { parseDOM } from "./parser";
import { createVDom } from "./vdom";
import { createProxy } from "./proxy";

export default class Qvm {
  constructor(options) {
    //获取dom
    let el = dom(options.el);
    //解析dom
    let domTree = parseDOM(el);
    //创建虚拟dom
    let vdomTree = createVDom(domTree, this);

    this.root = vdomTree;
    //创建数据代理
    this._data = createProxy({ ...options.data, ...options.methods }, () => {
      this.render();
    });

    //标记初始化
    this.state = "init";

    //初始渲染
    this.render();
  }

  render() {
    //渲染自己
    this.root.render();

    //渲染子集
    this.root.$children.forEach(child => child.render());
  }
}
