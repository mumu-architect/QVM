import {create} from './proxy';


window.p=create({a:12,b:5},function(){
    console.log('变了');
})