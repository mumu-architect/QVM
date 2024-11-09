import { assert, dom } from "./common";
import { parseDOM } from "./parser";
import { createVDom } from "./vdom";
import { createProxy } from "./proxy";
import directives from "./directives";
import VElement from "./velement";
import { Store } from "./qvmx";
import { v4 as uuid } from "uuid";

export default class Qvm {
  constructor(options) {
    //存储多个watch
    this.__watch_target = [];
    this.$options = options;

    this.name = uuid();

    this.components = options.components || {};

    //store连接
    if (options.store) {
      assert(options.store instanceof Store);
      this.$store = options.store;
      options.store._qvm = options.store._qvm||this;
    }

    //创建数据代理
    this._staticData = {
      ...options.methods,
      __Qvm: this,
      //store连接到模板
      $store: options.store,
    };


    //判断组件data为function
    let __data;
    if(typeof options.data=='function'){
      __data = options.data();
    }else{
      __data=options.data;
    }

    this._data = createProxy(__data || {}, this._staticData, (path) => {
      //watch
      for (let i = 0; i < path.length; i++) {
        let str = path.slice(0, i + 1).join(".");
        let watch = this._watchs[str];
        if (watch) {
          //存储watch
          this.__watch_target.push(watch);
        }
      }

      //执行computed方法
      this._doCompute();

      //通知渲染
      this.forceUpdate();
    });

    //执行computed方法
    this._doCompute();

    //存储watch
    this._watchs = options.watch || {};

    //系统指令加扩展指令
    this._directives = { ...directives, ...options.directives };
    //获取dom
    let el;
    if (typeof options.el == "string") {
      el = dom(options.el);
    } else {
      el = options.el;
    }
 
    //创建component组件
    let vdomTree = this.createComponent(el,this);

    //存储created，updated初始换方法
    this.created = options.created;
    this.updated = options.updated;

    this.root = vdomTree;

    //router 
    if(options.router){
      let router = options.router;
      router._qvm=this;
      //初始化
      router.init();
      this.$router = router;
    }

    //初始化所有element
    this.root.init();

    //标记初始化
    this.state = "init";
    //调用created初始化方法
    this.created && this.created.call(this._data);

    //标识render合并执行一次
    this._render_timer = 0;
    //初始渲染--update
    this.render();
    return this._data;
  }

 
  //执行computed方法
  _doCompute() {
    const options = this.$options;
    for (let key in options.computed) {
      let fn = options.computed[key];
      let result = fn.call(this._data);
      this._staticData[key] = result;
    }
  }

  //提醒执行render()
  forceUpdate() {
    clearTimeout(this._render_timer);
    this._render_timer = setTimeout(() => {
      this.render();
    }, 0);
  }

  render() {
    //渲染自己
    this.root.render();

    //执行watch
    this.__watch_target.forEach((fn) => {
      fn.call(this._data);
    });
    //清空watch
    this.__watch_target.length = 0;

    this.state = "update";
    //调用updated初始化方法
    this.updated && this.updated.call(this._data);
  }

   /**
    * 创建组件component
    * @param {*} el 
    * @param {*} qvm 
    * @returns 
    */
   createComponent(el,qvm){
   //解析dom
   let domTree = parseDOM(el);
   //创建虚拟dom
   let vdomTree = createVDom(domTree, this, this);

   //查找dom中的component
   let findAndCreateComponent = (node, parent) => {
     if (node._blue) {
       //拼接外部组件component
       let component;
       if (node.tag != "component") {
         component = qvm.components[node.tag] || components[node.tag];
         assert(component, `no "${node.tag}" component found`);
       } else {
         assert(node.attrs.is, `no "is" attribute`);
         component =
         qvm.components[node.attrs.is] || componets[node.attrs.is];
         assert(component, `no "${node.tag}" component found`);
       }

       assert(
         component.template !== undefined,
         `"${node.tag}" component no template attribute`
       );
       let oDiv = document.createElement("div");
       oDiv.innerHTML = component.template;
       assert(
         oDiv.children.length == 1,
         `component template must be has a root element`
       );

       //slot位置标记
       let slots = oDiv.getElementsByTagName("slot");
       Array.from(slots).forEach((slot) => {
         let fragment = document.createDocumentFragment();
         node.children.forEach((child) => {
           fragment.appendChild(child.el.cloneNode(true));
         });
         slot.parentNode.replaceChild(fragment, slot);
       });

       let root = oDiv.children[0];
       node.el.parentNode.replaceChild(root, node.el);

       let cmp = new Qvm({
         el: root,
         ...component,
         store: qvm.$store,
       }).__Qvm;

       cmp.$root = cmp;

       //TOTD:props未测试
       component.props &&
         component.props.forEach((name) => {
           cmp._data[name] = node.attrs[name];
         });

       return cmp;


       //return this._createComponent(component); 
     } else {
       if (node instanceof VElement) {
         for (let i = 0; i < node.$children.length; i++) {
           node.$children[i] = findAndCreateComponent(node.$children[i], node);
         }
       }
       return node;
     }
   };
   //查找dom中的component
   vdomTree = findAndCreateComponent(vdomTree, this);
   return vdomTree;
   }
};

//外部调用组件
let components = {};
Qvm.component = function (name, options) {
  components[name] = options;
};
//寻找组件
// Qvm.findComponent=function(name){
//   return components[name];
// }
