import { assert } from "./common";
import { expr } from "./expression";
import VElement from "./velement";

/**
 * 指令
 */
export default {
  //{name:"bind",arg:"title",value:"a+b"}
  bind: {
    init(velement, directive) {
      directive.meta._last_data = "";
    },
    update(velement, directive) {
      assert(velement);
      assert(velement instanceof VElement);
      assert(directive);
      assert(directive.arg);
      assert(directive.value);

      let res = expr(directive.value, velement._proxy);
      //console.log(directive.arg,res);

      if (directive.meta._last_data != res) {
        velement._el.setAttribute(directive.arg, res);
        velement._el[directive.arg] = res;

        directive.meta._last_data = res;

        console.log("[velement rendered]", velement.name);
      }
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
          velement._set('$event',ev);
          expr(str, velement._proxy);
        },
        false
      );
    },
    update: null,
    destory() {},
  },
  //屏蔽页面执行数据转换，数据转化完统一展示
  cloak: {
    init: null,
    update(velement) {
      velement._el.removeAttribute("v-cloak");
    },
    destory: null,
  },
  //{name:"show",arg:undefined,value:"show"}
  show: {
    init: null,
    update(velement, directive) {
      assert(velement);
      assert(velement instanceof VElement);
      assert(directive);
      assert(directive.value);

      let res = expr(directive.value, velement._data);
      if (res) {
        velement._el.style.display = "";
      } else {
        velement._el.style.display = "none";
      }
    },
    destory: null,
  },
  if: {
    init(velement, directive) {
      let holder = document.createComment("qvm holder");
      velement.__parent = velement._el.parentNode;
      velement.__holder = holder;
      velement.__el = velement._el;
    },
    update(velement, directive) {
      let res = expr(directive.value, velement._data);

      if (res) {
        if (velement.__holder.parentNode) {
          velement.__parent.replaceChild(velement.__el, velement.__holder);
        }
      } else {
        velement.__parent.replaceChild(velement.__holder, velement.__el);
      }
    },
    destory(velement, directive) {},
  },
  "else-if": {
    init(velement, directive) {},
    update(velement, directive) {},
    destory(velement, directive) {},
  },
  else: {
    init(velement, directive) {},
    update(velement, directive) {},
    destory(velement, directive) {},
  },
  for: {
    init(velement, directive) {
      //删除等于directive的指令v-for
      velement.$directives.filter((item) => item != directive);

      directive.meta = {};
      let template = (directive.meta.template = velement);
      let parentNode = (directive.meta.parent = velement._el.parentNode);

      let holder = (directive.meta.holder =
        document.createComment("for holder"));
      parentNode.replaceChild(holder, template._el);

      //存储克隆模板
      directive.meta.elements = [];

      //上一次的数据
      let last = [];

      //
      velement.render = function () {
        const template = directive.meta.template;
        const parentNode = directive.meta.parent;
        const holder = directive.meta.holder;
        //存储克隆模板
        let elements = directive.meta.elements;

        //删除
        //1.数据没变--原始velement直接拿过来
        //2.数据删了--原始velement留着备用
        //3.数据添加--优先使用备用velement，创建新的
        let oldElements = [...elements];
        elements.forEach((element) => {
          parentNode.removeChild(element._el);
        });
        elements.length = 0;

        //
        let newElements = [];

        let { key, value, data } = parseFor(directive.value);

        last = [...last];

        //console.log("last:", last);

        let iter = expr(data, velement._proxy);

        //diff
        newElements.length = iter.length;

        for (let i = 0; i < iter.length; i++) {
          let item = iter[i];
          let index = i;
          let n = last.findIndex(i=>i==item);
          if (n != -1) {
            newElements[index] = oldElements[n];
            oldElements.splice(n, 1);
            last.splice(n, 1);
          } else {
            newElements[index] = null;
          }
        }

        newElements.forEach((item, index) => {
          if (item != null) {
            return;
          }
          if (oldElements.length > 0) {
            newElements[index] = oldElements.pop();
          } else {
            newElements[index] = template.clone();
            newElements[index].init();
          }
        });

        last = iter;
        //存储克隆模板
        elements = newElements;

        let fragment = document.createDocumentFragment();
        newElements.forEach((element, index) => {
          key && element._set(key, index);
          element._set(value, iter[index]);

          fragment.appendChild(element._el);
        });
        parentNode.insertBefore(fragment,holder);

        elements.forEach((velement) => {
          //console.log(velement);
          //velement.$root.forceUpdate();
          velement.render();
        });

        directive.meta.elements = elements;
      };
    },
    update(velement, directive) {},
    destory(velement, directive) {},
  },
  //{name:"html",arg:undefined,value:"show"}
  html: {
    init: null,
    update(velement, directive) {
      assert(velement);
      assert(velement instanceof VElement);
      assert(directive);
      assert(directive.value);

      let res = expr(directive.value, velement._data);
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

      let res = expr(directive.value, velement._data);
      let node = document.createTextNode(res);
      velement._el.innerHTML = "";
      velement._el.appendChild(node);
    },
    destory: null,
  },
};

/**
 * 解析for-in
 * @param {*} str
 * @returns
 */
function parseFor(str) {
  //str=>'xxx in arr'
  //str=>'xxx,xx in xx'

  let arr = str.split(" in ");
  let [value, key] = arr[0].split(",");

  return {
    key,
    value,
    data: arr[1],
  };
}
