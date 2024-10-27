/**
 * 错误提示
 * @param {*} exp
 * @param {*} msg
 */
export function assert(exp, msg = "assert faild") {
  if (!exp) {
    throw new Error(msg);
  }
}

/**
 * 获取dom元素或节点元素
 * @param {*} arg
 * @returns
 */
export function dom(arg) {
  assert(arg);
  if (typeof arg == "string") {
    let res = document.querySelector(arg);
    assert(res);

    return res;
  } else if (arg instanceof Node) {
    return arg;
  } else {
    assert(false);
  }
}
