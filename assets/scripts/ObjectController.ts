import { _decorator, Button, Component, instantiate, Node, Sprite, Vec2 } from 'cc';
import { ObjectData } from './ObjectData';
import { BUILD } from 'cc/env';
import { placementSystem } from './System/placementSystem';
const { ccclass, property } = _decorator;

@ccclass('ObjectController')
export class ObjectController extends Component {

    @property({type : ObjectData})
    data : ObjectData = new ObjectData();

    button : Button = null;

    onMap : boolean = false;

    sp : Sprite = null;

    gridPos : Vec2;

    Type : any;

    // link the ele
    preController : ObjectController = null;
    nextController : ObjectController = null;

    setPreNode(Pre : ObjectController){
        this.preController = Pre;
    }

    setNextNode(next : ObjectController){
        this.nextController = next;
    }

    checkType(){
        
    }

    protected onLoad(): void {
        this.button = this.getComponent(Button);
        this.sp = this.getComponent(Sprite);
    }

    protected onEnable(): void {
        this.button.node.on(Button.EventType.CLICK, this.callback, this);  
    }

    callback(){
        placementSystem.instance.setPlaceObject(this.data);
    }
    
    init(newdata : ObjectData){
        this.data = newdata;
    }
    
    protected onDisable(): void {
        this.button.node.off(Button.EventType.CLICK, this.callback, this);
    }
    

    
}


