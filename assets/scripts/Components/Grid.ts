import { _decorator, Component, Node, Vec2, Vec3 } from 'cc';
import { pair } from '../Datastructure/pair';
const { ccclass, property } = _decorator;

@ccclass('Grid')
export class Grid extends Component {
    
    // 所有的cell均以其父节点考虑建立坐标系，父节点的containSiz左下角为原点，注意更改锚点
    // 0 index
    @property(Vec2)
    cellSize : Vec2 = null; // worldpos

    originPoint : Vec3 = Vec3.ONE; // worldpos

    gridMap : Map<Vec2, boolean> = new Map<Vec2, boolean>;

    protected onLoad(): void {
        this.originPoint = this.node.parent.getWorldPosition();
    }
    
    getWorldtoCellPosition(pos : Vec3) : Vec3{
        return (new Vec3(Math.floor(pos.subtract(this.originPoint).x / this.cellSize.x), Math.floor(pos.subtract(this.originPoint).y / this.cellSize.y), 0));
    }

    getCelltoWorldPosition(pos : Vec3) : Vec3{
        return (new Vec3(pos.x * this.cellSize.x + this.cellSize.x / 2, pos.y * this.cellSize.y + this.cellSize.y / 2)).add(this.originPoint);
    }

    isGridOccupy(x : number, y : number){
        let pos = new Vec2(x, y);
        if (this.gridMap.has(pos)){
            return this.gridMap.get(pos);
        }else{
            return true;
        }
    }

    setGridtype(x : number, y : number, type : boolean){
        let pos = new Vec2(x, y);
        this.gridMap.set(pos, type);
    }
}


