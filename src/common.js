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
