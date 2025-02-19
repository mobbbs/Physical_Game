import { _decorator, Component, Node, UITransform, Vec2, Vec3 } from 'cc';
import { pair } from '../Datastructure/pair';
import { ObjectData } from '../ObjectData';
const { ccclass, property } = _decorator;

@ccclass('Grid')
export class Grid extends Component {

    // 所有的cell均以其父节点考虑建立坐标系，父节点的containSiz左下角为原点，注意更改锚点
    // 0 index
    // 返回为左下角
    @property(Vec2)
    cellSize: Vec2 = null; // worldpos

    originPoint: Vec3 = Vec3.ONE; // worldpos

    width : number;
    height : number;

    gridMap: Array<boolean> = null;

    protected onLoad(): void {
        this.originPoint = this.node.parent.getWorldPosition();
        this.width = this.node.parent.getComponent(UITransform).width / this.cellSize.x;
        this.height = this.node.parent.getComponent(UITransform).height / this.cellSize.y;
        this.gridMap = new Array<boolean>(this.width * this.height);
        this.gridMap.fill(false);
    }

    getWorldtoCellPosition(pos: Vec3): Vec3 {
        return (new Vec3(Math.floor(pos.subtract(this.originPoint).x / this.cellSize.x), Math.floor(pos.subtract(this.originPoint).y / this.cellSize.y), 0));
    }

    getCelltoWorldPosition(pos: Vec3): Vec3 {
        return (new Vec3(pos.x * this.cellSize.x, pos.y * this.cellSize.y)).add(this.originPoint);
    }

    
    isGridOccupy(x: number, y: number) {
        return this.gridMap[this.getGridMapIndex(x, y)];
    }

    getGridMapIndex(x : number, y : number) : number{
        return (x * this.width + y);
    }

    setGridtype(x: number, y: number, type: boolean) {
        this.gridMap[this.getGridMapIndex(x, y)] = type;
    }

    isThisAreaOccupy(x: number, y: number, w: number, h: number) { // 考虑grid坐标，以（x，y）为左下角的矩形是否空旷
        for (let i = x; i < x + w; i++) {
            for (let j = y; j < y + h; j++) {
                if (this.isGridOccupy(i, j)) {
                    return false;
                }
            }
        }
        return true;
    }

    OccupyArea(x: number, y: number, w: number, h: number) { // 占据以（x，y）为左下角的矩形
        if (this.isThisAreaOccupy(x, y, w, h) == false) {
            console.log("Fail Occupy");
            return false;
        }
        for (let i = x; i < x + w; i++) {
            for (let j = y; j < y + h; j++) {
                this.setGridtype(i, j, true);
            }
        }
        return true;
    }

    RefreeArea(x : number, y : number, w : number, h :number){
        for (let i = x; i < x + w; i++) {
            for (let j = y; j < y + h; j++) {
                this.setGridtype(i, j, false);
            }
        }
    }
}


