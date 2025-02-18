import { _decorator, Component, Node, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ObjectData')
export class ObjectData{
    
    gridSize : Vec2 = Vec2.ONE;
    name : string = "";
    id : number = 0;
    canMask : number = 0;

    constructor(_gridSize : Vec2, _name : string, _id : number, _canMask : number){
        this.gridSize = _gridSize;
        this.name = _name;
        this.id = _id;
        this.canMask = _canMask;
    }
}


