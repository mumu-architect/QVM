import { assert } from "./common";

/**
 * 创建Proxy
 * @param {*} data
 * @param {*} cb
 * @returns
 */
export function createProxy(data,staticData, cb) {
  assert(data, "data is required");
  assert(cb, "data is required");
  assert(typeof cb == "function", "cb must be function");

  //递归回调
  let res;
  if (data instanceof Array) {
    res = [];
    for (let i = 0; i < data.length; i++) {
      if (typeof data[i] == "object") {
        res[i] = createProxy(data[i],staticData,cb);
      } else {
        res[i] = data[i];
      }
    }
  } else {
    res = {};
    for (let key in data) {
      assert(!key.startsWith('$'),'data key must not be $');

      if (typeof data[key] == "object") {
        res[key] = createProxy(data[key],staticData,cb);
      } else {
        res[key] = data[key];
      }
    }
  }

  return new Proxy(res, {
    get(data, name) {
      if(staticData[name]){
        return staticData[name];
      }else{
        return data[name];
      }
      // if(name=='addObj'){
      //   return function(name,val){
      //     data[name] = val;
      //   }.bind(res);
      // }
      //assert(data[name]!==undefined,`"${name}" is not defined`);
    
    },
    set(data, name, val) {
      if(typeof val=='object'){
        data[name] =createProxy(val,staticData,cb);
      }else{
        data[name] = val;
      }
     
      cb(name);
      return true;
    },
  });
}
