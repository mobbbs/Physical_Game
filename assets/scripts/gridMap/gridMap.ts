import { _decorator, Component, Node, UITransform, Vec2 } from 'cc';
import {grid} from "db://assets/scripts/gridMap/grid";
const { ccclass, property } = _decorator;

@ccclass('gridMap')
export class gridMap extends Component {
    
    static instance: gridMap = null;
    
    width : number = 0;
    height : number = 0;
    
    grids : grid[] = [];
    onLoad() {
        gridMap.instance = this;
        let transform = this.node.getComponent(UITransform);
        this.width = transform.width;
        this.height = transform.height;
        this.grids = this.node.getComponentsInChildren(grid);
    }
    getPosition(index : number) : Vec2 {
        return new Vec2(index % this.width, index / this.width);
    }
    getIndex(pos : Vec2) : number {
        return pos.x * this.width + pos.y;
    }
    
}


