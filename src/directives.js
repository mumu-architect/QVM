import { assert } from "./common";
import { expr } from "./expression";
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
        function () {
          let str = directive.value;
          if (/^[\$_a-z][a-z0-9_\$]*$/i.test(str)) {
            str += "()";
          }
          expr(str, velement._component._data);
        },
        false
      );
    },
    update: null,
    destory() {},
  },
  model() {},
  cloak() {},
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
  if() {},
  else() {},
  "else-if"() {},
  for() {},
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
