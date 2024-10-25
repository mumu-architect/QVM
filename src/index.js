import {create} from './proxy';
import { parseDOM, parseDirectives } from "./parse";

//1.测试代理proxy
// window.p=create({
//     a:12,
//     b:5,
//     arr:[1,2,3],
//     json:{
//         name:'mumu'
//     }
// },function(){
//     console.log('变了');
// })

//解析dom
let div = document.getElementById("a");
let result = parseDOM(div);
//console.log(result);

let directives = parseDirectives(result.attrs);
console.log(result.attrs);
console.log(directives);