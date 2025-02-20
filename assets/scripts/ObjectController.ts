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

    Type : number = 0;

    // link the object
    preController : ObjectController = null;
    nextController : ObjectController = null;

    setPreNode(Pre : ObjectController){
        // console.log("current : " + this.node._objFlags + " pre : " + Pre.node._objFlags);
        this.preController = Pre; 
    }
    
    setNextNode(next : ObjectController){
        // console.log("current : " + this.node._objFlags + " next : " + next.node._objFlags);
        this.nextController = next;
    }

    checkType(){
        
    }

    protected onLoad(): void {
        this.button = this.getComponent(Button);
        this.sp = this.getComponentInChildren(Sprite);
    }
    
    protected onEnable(): void {
        this.node.on(Button.EventType.CLICK, this.callback, this);  
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
    
    V2EqualJue(v1 : Vec2, v2 : Vec2){ // V2 value check
        if (v1.x == v2.x && v1.y == v2.y){
            return true;
        }
        return false;
    }
    V2absEqualJue(v1 : Vec2, v2 : Vec2){ // V2 value check
        if (Math.abs(v1.x) == Math.abs(v2.x) && Math.abs(v1.y) == Math.abs(v2.y)){
            return true;
        }
        return false;
    }
    Vec2(x : number, y : number){
        return new Vec2(x, y);
    }
    
}


