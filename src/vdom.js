import VElement from "./velement";
import VText from "./vtext";
import VComponent from "./vcomponent";
import { assert } from "./common";
import Qvm from "./qvm";

/**
 * 创建虚拟dom
 * @param {*} node
 * @param {*} component
 * @returns
 */
export function createVDom(node, component) {
  assert(node);
  assert(node._blue);
  assert(node.type == "element" || node.type == "text");
  assert(component);
  assert(component instanceof VComponent || component instanceof Qvm);

  if (node.type == "element") {
    let parent;
    if (node.ishtml) {
      //VElement
      parent = new VElement(node, component);
    } else {
      //VComponent
      parent = new VComponent(node, component);
    }

    parent.$children = node.children.map((child) =>
      createVDom(child, component)
    );
    return parent;
  } else {
    //VText
    return new VText(node, component);
  }
}
