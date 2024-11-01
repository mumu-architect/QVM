import VComponent from "./vcomponent";
import { dom } from "./common";
import { parseDOM } from "./parser";
import { createVDom } from "./vdom";
import { createProxy } from "./proxy";
import directives from "./directives"

export default class Qvm {
  constructor(options) {
    //系统指令加扩展指令
    this._directives={...directives,...options.directives};
    //获取dom
    let el = dom(options.el);
    //解析dom
    let domTree = parseDOM(el);
    //创建虚拟dom
    let vdomTree = createVDom(domTree, this);

    //存储created，updated初始换方法
    this.created=options.created;
    this.updated=options.updated;

    this.root = vdomTree;


    //创建数据代理
    // this._data = createProxy({ ...options.data, ...options.methods }, () => {
    //   this.render();
    // });
    this._staticData={...options.methods},
    this._data = createProxy(options.data,this._staticData,()=>{
      this.render();
    });

    //标记初始化
    this.state = "init";
    //调用created初始化方法
    this.created && this.created.call(this._data);

    //初始渲染--update
    this.render();


    return this._data;
  }

  render() {
    //渲染自己
    this.root.render();

    //渲染子集
    this.root.$children.forEach(child => child.render());

    this.state='update';
    //调用updated初始化方法
    this.updated && this.updated.call(this._data);
  }
}
