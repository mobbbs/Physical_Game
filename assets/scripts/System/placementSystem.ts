import { _decorator, Component, instantiate, Node, Prefab, size, UITransform, v3, Vec2, Vec3, Widget } from 'cc';
import { InputManager } from '../Manager/InputManager';
import { Grid } from '../Components/Grid';
import { ObjectController } from '../Object/ObjectController';
import { ObjectData } from '../Object/ObjectData';
import { WireController } from '../Object/WireController';
import { BatteryController } from '../Object/BatteryController';
const { ccclass, property } = _decorator;

@ccclass('placementSystem')
export class placementSystem extends Component {

    static instance: placementSystem = null;

    @property(Node)
    inputDirctor: Node = null;

    @property(InputManager)
    inputManager: InputManager = null;

    // @property(Node)
    placeObject: Node = null;
    placeObjectController: ObjectController = null;
    placeObjectData: ObjectData = null;

    @property(Node)
    selectIndecate: Node = null;
    b
    @property(Grid)
    grid: Grid = null;

    @property(Node)
    placeObjectParent: Node;

    // onPlaceing : boolean = true;

    placeObjectControllerList: ObjectController[] = [];

    dx: number[] = [0, 0, 0, 1, -1];
    dy: number[] = [0, 1, -1, 0, 0];


    currentPlacenum: number = 0;

    inf: number = 99999999;

    LastgridPos: Vec3 = new Vec3(this.inf, this.inf, this.inf);

    protected onLoad(): void {
        placementSystem.instance = this;
    }

    setPlaceObject(data: ObjectData) {
        this.placeObjectData = data;
        this.selectIndecate.getComponent(UITransform).setContentSize(size(this.grid.cellSize.x * data.gridSize.x, this.grid.cellSize.y * data.gridSize.y));
    }

    private createPlaceObject(pos: Vec3, gridPos: Vec2) {
        this.placeObject = instantiate(this.placeObjectData.prefab);
        this.placeObject.setParent(this.placeObjectParent);
        this.placeObjectController = this.placeObject.getComponent(ObjectController);
        this.placeObjectController.offselect();
        this.placeObjectController.onSomething();
        this.placeObjectController.grid = this.grid;
        this.placeObject.getComponent(UITransform).setContentSize(size(this.grid.cellSize.x * this.placeObjectController.data.gridSize.x, this.grid.cellSize.y * this.placeObjectController.data.gridSize.y));
        this.placeObject.setWorldPosition(pos);
        this.placeObjectController.onMap = true;
        this.placeObjectController.gridPos = gridPos;
        this.placeObjectControllerList.push(this.placeObjectController);
    }

    undoCreatePlaceObject() {
        if (this.placeObjectControllerList.length <= 0) {
            console.log("没了")
            return;
        }
        let temp = this.placeObjectControllerList[this.placeObjectControllerList.length - 1]; // 可用对象池
        this.grid.RefreeArea(temp.gridPos.x, temp.gridPos.y, temp.data.gridSize.x, temp.data.gridSize.y);
        this.placeObjectControllerList.pop();
        temp.isDestroy = true;
        let x = temp.gridPos.x;
        let y = temp.gridPos.y;
        for (let i = 1; i < 5; i++) {
            let u = x + this.dx[i];
            let v = y + this.dy[i];
            if (this.grid.getGridController(u, v) == null || this.grid.getGridController(u, v).isDestroy){
                continue;
            }
            this.grid.getGridController(u, v)?.buildNeighbour();
            this.grid.getGridController(u, v)?.checkType();
            this.grid.getGridController(u, v)?.freshState();
        }
        temp.grid = null;
        temp.node.destroy();
    }

    protected update(dt: number): void {
        this.inputDirctor.setWorldPosition(this.inputManager.getTouchPosition().x, this.inputManager.getTouchPosition().y, 0);
        let gridPos = this.grid.getWorldtoCellPosition(this.inputDirctor.worldPosition);

        // 强制grid位移单方向
        if (this.inputManager.isTouching) {
            if (this.LastgridPos.x > this.inf / 2) {
                this.LastgridPos = gridPos.clone();
            } else {
                let dx = this.LastgridPos.x - gridPos.x;
                let dy = this.LastgridPos.y - gridPos.y;
                if (dx != 0 && dy != 0) {
                    dx = 0;
                }
                gridPos.x = this.LastgridPos.x - dx;
                gridPos.y = this.LastgridPos.y - dy;
                this.LastgridPos = gridPos.clone();
            }
        } else {
            this.LastgridPos = new Vec3(this.inf, this.inf, this.inf);
        }
        this.selectIndecate.setWorldPosition(this.grid.getCelltoWorldPosition(gridPos));
        if (this.inputManager.isTouching && this.placeObjectData != null) {
            if (this.grid.isThisAreaOccupy(gridPos.x, gridPos.y, this.placeObjectData.gridSize.x, this.placeObjectData.gridSize.y)) {
                this.createPlaceObject(this.selectIndecate.worldPosition, new Vec2(gridPos.x, gridPos.y));
                this.grid.OccupyArea(gridPos.x, gridPos.y, this.placeObjectData.gridSize.x, this.placeObjectData.gridSize.y, this.placeObjectController);
                this.currentPlacenum++;

                let z = -1;
                for (let i = 0; i < 5; i++) {
                    let u = this.placeObjectController.gridPos.x + this.dx[i];
                    let v = this.placeObjectController.gridPos.y + this.dy[i];
                    if (this.grid.getGridController(u, v) == null || this.grid.getGridController(u, v).isDestroy){
                        continue;
                    }
                    if (this.grid.getGridController(u, v).data.id == 1){
                        z = i;
                    }else{
                        this.grid.getGridController(u, v)?.buildNeighbour();
                        this.grid.getGridController(u, v)?.checkType();
                        (this.grid.getGridController(u, v))?.freshState();
                    }
                }
                if (z >= 0){
                    let u = this.placeObjectController.gridPos.x + this.dx[z];
                    let v = this.placeObjectController.gridPos.y + this.dy[z];
                    if (this.grid.getGridController(u, v) == null || this.grid.getGridController(u, v).isDestroy){
                    }else{
                        this.grid.getGridController(u, v)?.buildNeighbour();
                        this.grid.getGridController(u, v)?.checkType();
                        (this.grid.getGridController(u, v))?.freshState();
                    }
                }
            }
        } else if (this.currentPlacenum > 0) {
            // console.log(this.placeObjectControllerList.length);
            // for (let i = 0; i < this.placeObjectControllerList.length; i++) {
            //     console.log(this.placeObjectControllerList[i]);
            // }
            this.currentPlacenum = 0;
        }
    }

    protected onDestroy(): void {

    }
}