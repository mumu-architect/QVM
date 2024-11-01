import { assert } from "./common";
import { expr } from "./expression";
import { createVDom } from "./vdom";
import VElement from "./velement";

/**
 * 指令
 */
export default {
  //{name:"bind",arg:"title",value:"a+b"}
  bind: {
    init: null,
    update(velement, directive) {
      assert(velement);
      assert(velement instanceof VElement);
      assert(directive);
      assert(directive.arg);
      assert(directive.value);

      let res = expr(directive.value, velement._component._data);
      //console.log(directive.arg,res);
      velement._el.setAttribute(directive.arg, res);
      velement._el[directive.arg]=res;
    },
    destory: null,
  },
  //{name:"on",arg:'click',value:"fn"}
  on: {
    init(velement, directive) {
      //value=>'fn'->fn()
      //value=>'fn()' //'fn(a,b)'
      //value=>'a+b' //'sum(a,b)+fn(9)'
      assert(velement);
      assert(velement instanceof VElement);
      assert(directive);
      assert(directive.arg);
      assert(directive.value);

      //TOTD
      velement._el.addEventListener(
        directive.arg,
        function (ev) {
          let str = directive.value;
          if (/^[\$_a-z][a-z0-9_\$]*$/i.test(str)) {
            str += "($event)";
          }
          //velement._component._data.addObj('$event',ev);
          velement._component._staticData.$event=ev;
          expr(str, velement._component._data);
        },
        false
      );
    },
    update: null,
    destory() {},
  },
  //{name:"model",arg:undefined,value:"a"}
  model: {
    init(velement, directive){
      velement.$directives.push({name:'bind',arg:'value',value:directive.value});
      velement.$directives.push({name:'on',arg:'input',value:`${directive.value}=$event.target.value`});

    },
    update: null,
    destory:null,
  },
  //屏蔽页面执行数据转换，数据转化完统一展示
  cloak:{
    init:null,
    update(velement){
      velement._el.removeAttribute('v-cloak');
    },
    destory:null
  },
  //{name:"show",arg:undefined,value:"show"}
  show: {
    init: null,
    update(velement, directive) {
      assert(velement);
      assert(velement instanceof VElement);
      assert(directive);
      assert(directive.value);

      let res = expr(directive.value, velement._component._data);
      if (res) {
        velement._el.style.display = "";
      } else {
        velement._el.style.display = "none";
      }
    },
    destory: null,
  },
  'if':{
    init(velement, directive){
      let holder = document.createComment('qvm holder');
      velement.__parent=velement._el.parentNode;
      velement.__holder=holder;
      velement.__el=velement._el;
    },
    update(velement, directive) {
      let res = expr(directive.value,velement._component._data);

      if(res){
        if(velement.__holder.parentNode){
          velement.__parent.replaceChild(
            velement.__el,
            velement.__holder
          );
        }
      }else{
        velement.__parent.replaceChild(
          velement.__holder,
          velement.__el
        );
      }
    },
    destory(velement, directive) {

    }
  },
  "else-if":{
    init(velement, directive){

    },
    update(velement, directive) {

    },
    destory(velement, directive) {
      
    }
  },
  'else':{
    init(velement, directive){

    },
    update(velement, directive) {

    },
    destory(velement, directive) {
      
    }
  },
  'for':{
    init(velement, directive){
      let holder = document.createComment('for holder');
      velement._for_el=velement._el;
      velement.__for_holder = holder;
      velement.__for_parent=velement._el.parentNode;

      velement._el.parentNode.replaceChild(holder,velement._el);

      velement.__for_elements=[];


    },
    update(velement, directive) {
      //TOTD
      velement.__for_elements.forEach(child=>{
        velement.__for_parent.removeChild(child);
      });
      velement.__for_elements=[];

      let [str,dataName] = directive.value.split(' in ');
      let [valueName,keyName] = str.split(',');

      //1.循环数据
      data = expr(dataName,velement._component._data);
      //2.
      let fragment = document.createDocumentFragment();
      for(let i in data){
        let value=data[i];
        let childNode = velement._for_el.cloneNode(true);

        //创建虚拟dom
        let child = createVDom(child,velement._component);

        fragment.appendChild(child._el);
        velement.__for_elements.push(child._el);
      }


      velement.__for_parent.insertBefore(fragment,element.__for_holder);


      velement.__for_parent.replaceChild(fragment,velement.__for_holder);

      console.log(str,key,value,data);


    },
    destory(velement, directive) {
      
    }
  },
  //{name:"html",arg:undefined,value:"show"}
  html: {
    init: null,
    update(velement, directive) {
      assert(velement);
      assert(velement instanceof VElement);
      assert(directive);
      assert(directive.value);

      let res = expr(directive.value, velement._component._data);
      velement._el.innerHTML = res;
    },
    destory: null,
  },
  //{name:"text",arg:undefined,value:"show"}
  text: {
    init: null,
    update(velement, directive) {
      assert(velement);
      assert(velement instanceof VElement);
      assert(directive);
      assert(directive.value);

      let res = expr(directive.value, velement._component._data);
      let node = document.createTextNode(res);
      velement._el.innerHTML = "";
      velement._el.appendChild(node);
    },
    destory: null,
  },
};
