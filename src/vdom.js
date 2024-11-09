import VElement from "./velement";
import VText from "./vtext";
import { assert } from "./common";

/**
 * 创建虚拟dom
 * @param {*} node
 * @param {*} component
 * @returns
 */
export function createVDom(node, parent, component) {
  assert(node);
  assert(node._blue);
  assert(node.type == "element" || node.type == "text");

  if (node.type == "element") {
    if (node.ishtml) {
      //VElement
      let ele = new VElement(node, parent);
      ele.$children = node.children.map((child) => {
        return createVDom(child, ele, component);
      });

      ele.$root = component;

      return ele;
    } else {
      // //VComponent
      // let cmp = new VComponent(node, parent);
      // cmp.$children = node.children.map(child =>{
      //   return createVDom(child,cmp,cmp);
      // });
      // //cmp.$root=cmp;
      // return cmp;

      return node;
    }
  } else {
    //VText
    return new VText(node, parent);
  }
}
