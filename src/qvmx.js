import { assert } from "./common";

/**
 * 类似vuex
 * 全局数据存储
 */
export class Store {
  constructor(options) {
    assert(options);
    assert(options.state);

    this.state = options.state;
    //用于更改状态
    this._mutations = options.mutations || {};
    //异步函数，用于处理异步操作和复杂的同步操作
    this._actions = options.actions || {};

    this._qvm = null;

    //开启store严格模式
    this.strict = options.strict;
    if (options.strict) {
      this.lastState = cloneData(this.state);
      //定期检查state有没有意外修改
      setInterval(() => {
        //原始状态
        //this.lastState;
        //现在状态
        //this.state;
        //比较
        if (!compareData(this.lastState, this.state)) {
          console.error("qvmx data changed");
          this.lastState = cloneData(this.state);
        }
      }, 100);
    }
  }

  //commit：同步操作,例如向后台提交数据，
  commit(name, ...args) {
    let mutation = this._mutations[name];
    assert(mutation, `mutation "${name}" is not defined`);

    //this._data
    mutation(this.state, ...args);
    //this._data

    //通知Qvm
    assert(this._qvm, "Store must be a param of Qvm");
    this._qvm.forceUpdate();

    //严格模式正常修改
    if (this.strict) {
      this.lastState = cloneData(this.state);
    }
  }
  //dispatch：含有异步操作，例如向后台提交数据，
  async dispatch(name, ...args) {
    let action = this._actions[name];
    assert(action, `action "${name}" is not defined`);

    await action(this, ...args);
  }
}

/**
 * 克隆数据
 * @param {*} data
 * @returns
 */
function cloneData(data) {
  if (data instanceof Array) {
    let data2 = [];
    for (let i = 0; i < data.length; i++) {
      data2[i] = cloneData(data[i]);
    }
    return data2;
  } else if (typeof data == "object") {
    let data2 = {};
    for (let i in data) {
      data2[i] = cloneData(data[i]);
    }
    return data2;
  } else {
    return data;
  }
}

/**
 * 比较数据是否相同
 * @param {*} data1
 * @param {*} data2
 * @returns
 */
function compareData(data1, data2) {
  if (data1 == data2) {
    return true;
  }
  if (typeof data1 != typeof data2) {
    return false;
  }

  if (data1 instanceof Array) {
    for (let i = 0; i < data1.length; i++) {
      let b = compareData(data1[i], data2[i]);
      if (b == false) {
        return false;
      }
    }
    return true;
  } else if (typeof data1 == "object") {
    for (let i in data1) {
      let b = compareData(data1[i], data2[i]);
      if (b == false) {
        return false;
      }
    }
    return true;
  } else {
    return data1 === data2;
  }
}
