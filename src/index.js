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

//4.组件插槽测试
// Qvm.component('cmp2',{
//   data: {
//     arr:[1,2,3]
//   },
//   template:`
//   <div>
//   cmp2cmp2
//   <slot></slot>
//   <slot></slot>
//   </div>
//   `
// });

// window.vm = new Qvm({
//   el: "#root",
//   data: {
//     arr:[12,5,8],
//     a: 12,
//     b: 5,
//     c:3,
//     show: false,
//     str:"<strong>bbbb</strong>",
//     html:"<strong>bbbb</strong>",
//     json:{
//       a:12,
//       user:{
//         age:18
//       },
//       arr:[1,2,3]
//     }
//   },
//   components:{
//     cmp:{
//       props:['a'],
//       data:{
//         name:'blue-component'
//       },
//       template:`
//       <div>
//       <input type="text" value="aaa"/>
//       <button type="button" @click="fn()">按钮</button>
//       </div>
//       `,
//       methods: {
//         fn(){
//           alert(this.name);
//         }
//       },
//     }
//   },
//   created(){
//     console.log('初始化完成components');
//   },
//   updated(){
//     console.log('更新了components');
//   },
// });

// console.log(vm);

//5.store调用
// import Qvm from "./qvm";
// import {Store} from "./qvmx"

// Qvm.component('cmp1',{
//   data(){
//     return{
//       a:99
//     }
//   },
//   methods:{
//     fn(){
//       this.a++;
//     }
//   },
//   template:`
//   <div>
//   <button type="button"  @click="fn">按钮</button>
// {{a}}
//   a={{$store.state.a}}
//   </div>
//   `
// });

// Qvm.component('cmp2',{
//   template:`
//   <div>
//   <button type="button"  @click="fn()">按钮</button>
//   </div>
//   `,
//   methods:{
//     fn(){
//       this.$store.dispatch('setA',88);
//     }
//   }
// });

// let store=new Store({
//   strict:true,//生成环境改为false
//   state:{
//     a:12,b:5
//   },
//   mutations:{
//     setA(state,a){
//       state.a=a;
//     }
//   },
//   actions:{
//     setA(store,a){
//       store.commit('setA',a);
//     }
//   }
// });
// window.store=store;

// window.vm = new Qvm({
//   el: "#root",
//   data: {
//     arr:[12,5,8],
//     a: 12,
//     b: 5,
//     c:3,
//   },
//   store,
//   methods:{
//     fn(){
//       alert(111);
//     }
//   }
// });

// console.log(vm);

//6.router
// import Qvm from "./qvm";
// import Router from "./qvm-router";

// Qvm.component('cmp1',{
//   template:`
//   <div>
//   组件1
//   </div>
//   `,
//   created(){
//     //alert('cmp1');
//   }
// });

// Qvm.component('cmp2',{
//   template:`
//   <div>
//   组件2
//   </div>
//   `
// });
// let router = new Router({
//   routes:[
//     {path:'/a',component:'cmp1',meta:{name:'blue1'}},
//     {path:'/b',component:'cmp2',meta:{name:'blue2'}},
//     {path:'/c',component:'c',meta:{name:'blue3'}},
//   ]
// })

// window.vm = new Qvm({
//   el: "#root",
//   data: {
//     arr:[12,5,8],
//     a: 12,
//     b: 5,
//     c:3,
//   },
//   router,
//   components:{
//     'c':{
//       template:`<div>cccccc</div>`
//     }
//   }
// });

// console.log(vm);
//7.ref="ccc"调用
import Qvm from "./qvm";
// Qvm.component("qrow", {
//   template: `
//   <div>
//   <button @click="$emit('abc',12,5)">触发</button>
//   </div>
//   `,
//   created() {
//     this.$on("aaakkk", sum => {
//       console.log("sum", sum);
//     });
//   },
// });
Qvm.component("qrow", {
  template: `
  <div>
  <button >触发1</button>
  </div>
  `,
});
Qvm.component("q-row", {
  template: `
  <div>
  <button >触发2</button>
  </div>
  `,
  created() {
    this.$on("aaakkk", sum => {
      console.log("sum", sum);
    });
  },
});

window.vm = new Qvm({
  el: "#root",
  data: {
    arr: [12, 5, 8],
    a: 12,
    b: 5,
    c: 3,
  },
  mounted() {
    // this.$refs.ccc.$on("abc", (a,b) => {
    //   alert("aaaa");
    //   console.log(a, b);
    // });
    // setInterval(() => {
    //   this.$refs.ccc.$emit('aaakkk',88);
    // }, 200);
  },
});

console.log(vm);


//8.filter过滤
// mounted(){
//   //过滤执行方法
//   this.getArr();
//   this.getFilterArr();
//   console.log('mounted完成');
// },


// import Qvm from "./qvm";

// window.vm = new Qvm({
//   el: "#root",
//   data: {
//     arr: [],
//     filterArr:[],
//     filterValue: {id:3,money:100},
//     a:5,
//     b:3
//   },
//   mounted(){
//     //过滤执行方法
//     this.getArr();
//     this.getFilterArr();
//     console.log('mounted完成');
//   },
//   methods:{
//    //获取数据
//     getArr(){
//       this.arr = [{id:1,money:23},{id:2,money:54},{id:3,money:58},{id:4,money:100},{id:5,money:200},{id:6,money:300}];
//     },
//      //过滤方法
//     getFilterArr(){
//       this.filterArr=this.arr.filter(item=>item.id>this.filterValue.id&&item.money>this.filterValue.money);
//     }

//   },
//   created(){
//     console.log('初始化完成created');
//   },
//   updated(){
//     console.log('更新了updated');
//   },
// });

// console.log(vm);