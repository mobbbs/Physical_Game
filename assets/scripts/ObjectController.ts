import { _decorator, Component, Node } from 'cc';
import { ObjectData } from './ObjectData';
const { ccclass, property } = _decorator;

@ccclass('ObjectController')
export class ObjectController extends Component {


    data : ObjectData = null;

    init(newdata : ObjectData){
        this.data = newdata;
    }


    
}


