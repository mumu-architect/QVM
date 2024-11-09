
/**
 * 事件触发器，事件队列
 */
export default class EventQueue{
    constructor(){
        this.events = {};
    }
   
    $on(name,fn){
        this.events[name]=this.events[name]||[];
        this.events[name].push(fn);
    }

    $emit(name,...args){
        if(this.events[name]){
            this.events[name].forEach(fn=>{
                fn.call(this,...args);
            });
        }
    }
}