import {assert} from './common';



export function create(data,cb){
    assert(data,'data is required');
    assert(cb,'data is required');
    assert(typeof cb=='function','cb must be function');

    
    return new Proxy(data,{
        get(data,name){
           assert(data,[name]);
           return data[name];
        },
        set(data,name,val){
            data[name] =val;
            cb(name);
            return true;
        }
    });
}