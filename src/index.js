//import {create} from './proxy';
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

//2.解析dom
// let div = document.getElementById("a");
// let result = parseDOM(div);
// //console.log(result);

// let directives = parseDirectives(result.attrs);
// console.log(result.attrs);
// console.log(directives);

//3.解析执行表达式
//import { expr } from './expression';

//let result=expr("12+'abc'+fn(a+b)+name-age+'www'+'dfa\\'sd'+88",{
//let result=expr("mut(mut(a,b),json.b-7)+json[key]",{
//let result=expr("a>50?a+b:a-b",{
//let result=expr("Math.max(a,b)",{
//let result=expr("new Date().getTime()+'asdsad'+mut(mut(a,b),json.b-7)+json[key]",{
//let result=expr("new Date().getTime()+'asdsad'+(mut(mut(a,b),json.b-7)+json[key])",{
//let result=expr("if(json[key]>10){alert(1)}else{alert(2)}",{

// let result=expr("if(json[key]>10){alert(1)}else{alert(2)}",{
//     a:12,
//     b:5,
//     arr:[1,2,3],
//     //Math:window.Math,
//     key:'a',
//     name:'blue',
//     mut(n,m){
//         return n*m;
//     },
//     json:{
//         a:5,
//         b:9
//     }
// });

// console.log(result);

//4.

import Qvm from "./qvm";

window.vm = new Qvm({
  el: "#root",
  data: {
    a: 12,
    b: 5,
    show: false,
    str:"<strong>bbbb</strong>",
    html:"<strong>bbbb</strong>",
  },
  methods:{
    fn(){
      alert('a');
    }
  }
});

console.log(vm);
