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
    arr:[12,5,8],
    a: 12,
    b: 5,
    //$c:3,
    show: false,
    str:"<strong>bbbb</strong>",
    html:"<strong>bbbb</strong>",
    json:{
      a:12
    }
  },
  methods:{
    fn5(){
       this.show = !this.show;
    },
    fn3(){
      return 33;
    },
    fn1(){
      this.json.a=[12,5,8];
    },
    fn2(){
      this.json.a.push(55);
    },
    fn(ev){
      console.log(ev);
    },
  },
  directives:{
    href:{
      init(velement,directive){
        velement._el.onclick=function(){
          window.open(directive.value);
        };
      },
      update(velement,directive){
        velement._el.style.background='red';
      },
      destroy() {
        
      }
    }
  },
  created(){
    console.log('初始化完成');
  },
  updated(){
    console.log('更新了');
  },
});

console.log(vm);
