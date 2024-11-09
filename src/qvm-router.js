import { assert } from "./common";
import Qvm from "./qvm";

export default class Router {
  constructor(options) {
    assert(options);
    assert(options.routes);
    assert(options.routes instanceof Array);

    this.routes = [...options.routes];
    this._qvm = null;

  }

  init() {
    this._els = Array.from(document.getElementsByClassName("--router-view"));
    //this._parent = _el.parentNode;
    //hash是URL中#后面那部分，同时修改hash值不会引起页面的刷新
    window.addEventListener(
      "hashchange",
      () => {
        this.parse();
      },
      false
    );
    this.parse();
  }

  //解析
  parse() {
    let hash = location.hash.substring(1);
    if (hash) {
      let route = this.routes.find((route) => route.path == hash);
      assert(route, `path "${hash}" is not defined`);
      assert(route.component, `component is required`);

      
     //创建组件
      for(let i=0;i<this._els.length;i++){
        let cmp = document.createElement(route.component);
        this._els[i].parentNode.replaceChild(cmp, this._els[i]);
        let vdom = this._qvm.createComponent(cmp, this._qvm);
        this._els[i] = vdom.root._el;
      }


      //绑定route的数据
      this._qvm._data.$route=route;

    }
  }
}

Qvm.component("router-link", {
  props: ["to"],
  template: `
    <a :href="'#'+to">
       <slot></slot>
    </a>
    `,
});
Qvm.component("router-view", {
  template: `
   <div class="--router-view">
   aaaa
   </div>
    `,
});
