import { assert } from "./common";

/**
 * 解析dom
 * @param {*} dom
 * @returns
 */
export function parseDOM(dom) {
  assert(dom);
  assert(dom instanceof Node);

  if (dom.nodeType == dom.ELEMENT_NODE) {
    //1.type--标签
    let tag = dom.tagName.toLowerCase();

    //2.属性
    let attrs = {};
    Array.from(dom.attributes).forEach((attr) => {
      attrs[attr.name] = attr.value;
    });
    //3.children
    let children = Array.from(dom.childNodes)
      .map((child) => parseDOM(child))
      .filter((child) => child !== undefined);

    //判断是否是html
    let ishtml =
      dom.constructor !== HTMLUnknownElement && dom.constructor !== HTMLElement;
    return {
      type: "element",
      el: dom,
      tag,
      attrs,
      children,
      ishtml,
    };
  } else if (dom.nodeType == document.TEXT_NODE) {
    let str = dom.data.trim();
    if (str) {
      return {
        type: "text",
        el: dom,
        data: str,
      };
    } else {
      return undefined;
    }
  }
}

/**
 * 解析指令
 * @param {*} attrs 
 * @returns 
 */
export function parseDirectives(attrs) {
  assert(attrs);
  assert(attrs.constructor == Object);

  let directives = [];

  //v-
  //: v-bind:xxx
  //@ v-on:xxx
  for (let key in attrs) {
    let directive;
    //v-if="xxx" v-bind:title="xxx" v-show="xxx" @xx:xxx
    if (key.startsWith("v-")) {
      //名字：参数
      let [name, arg] = key.split(":");
      directive = { name: name.replace(/^v\-/, ""), arg };

      //:title
    } else if (key.startsWith(":")) {
      directive = { name: "bind", arg: key.substring(1) };
      //@xx:xxx
    } else if (key.startsWith("@")) {
      directive = { name: "on", arg: key.substring(1) };
    }

    if (directive) {
      assert(
        (directive.name == "bind" && directive.arg) || directive.name != "bind",
        "not defined what to bind " + key
      );
      assert(
        (directive.name == "on" && directive.arg) || directive.name != "on",
        "event name is not defined " + key
      );

      directive.value = attrs[key];
      directives.push(directive);
    }
  }
  return directives;
}
