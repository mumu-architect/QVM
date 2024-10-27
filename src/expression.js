import { assert } from "./common";

//全局关键字
const keyword = {
  new: true,
  class: true,
  for: true,
  if: true,
  else: true,
};

/**
 * 解析表达式，调用数据
 * //str=>"a"
 * //str=>"a+b"
 * //str=>"json.name+'b'"
 * //str=>"fn(a+b)"
 * @param {*} str
 * @param {*} data
 */
export function expr(str, data) {
  /**
   * 判断是否全局变量
   * @param {*} s
   * @param {*} localExpr
   * @returns
   */
  function parseGlobal(s, localExpr) {
    // alert('alert' in window);
    // alert(typeof window.alert === 'function');
    let arr = s.split(" ");
    if (s in window || (keyword[arr[0]] && !data[s])) {
      return s;
    } else {
      return localExpr;
    }
  }

  let arr = preseExpr(str);
  //console.log(arr);
  let arr2 = arr.map((item) => {
    if (typeof item == "string") {
      return "'" + item + "'";
    } else {
      let str = item.expr.replace(/.?[\$_a-z][\sa-z0-9_\$]*/gi, function (s) {
        //console.log(s);
        if (/[\$_a-z]/i.test(s[0])) {
          return parseGlobal(s, "data." + s);
        } else {
          if (s[0] == ".") {
            return s;
          } else {
            return s[0] + parseGlobal(s.substring(1), "data." + s.substring(1));
          }
        }
      });
      return str;
    }
  });

  let str2 = arr2.join("");
  console.log(str2);

  return eval(str2);
}

/**
 * 解析表达式
 * 区分字符串和表达式
 * @param {*} str str="12+'abc'+fn(a+b)+name-age+'www'+'dfa\\'sd'+88";
 * @returns
 */
function preseExpr(str) {
  let arr = [];
  while (1) {
    let n = str.search(/'|"/);
    if (n == -1) {
      arr.push({ expr: str });
      break;
    }

    let m = n + 1;
    while (1) {
      m = str.indexOf(str[n], m);
      if (m == -1) {
        throw new Error("引号没配对");
      }

      if (str[m - 1] == "\\") {
        m++;
        continue;
      } else {
        break;
      }
    }

    arr.push({ expr: str.substring(0, n) });
    arr.push(str.substring(n + 1, m));
    str = str.substring(m + 1);
  }

  return arr;
}
