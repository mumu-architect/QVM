import { assert } from "./common";

/**
 * 创建Proxy
 * @param {*} data
 * @param {*} cb
 * @returns
 */
export function createProxy(data, cb) {
  assert(data, "data is required");
  assert(cb, "data is required");
  assert(typeof cb == "function", "cb must be function");

  //递归回调
  let res;
  if (data instanceof Array) {
    res = [];
    for (let i = 0; i < data.length; i++) {
      if (typeof data[i] == "object") {
        res[i] = createProxy(data[i], cb);
      } else {
        res[i] = data[i];
      }
    }
  } else {
    res = {};
    for (let key in data) {
      if (typeof data[key] == "object") {
        res[key] = createProxy(data[key], cb);
      } else {
        res[key] = data[key];
      }
    }
  }

  return new Proxy(res, {
    get(data, name) {
      assert(data[name]);
      return data[name];
    },
    set(data, name, val) {
      data[name] = val;
      cb(name);
      return true;
    },
  });
}
