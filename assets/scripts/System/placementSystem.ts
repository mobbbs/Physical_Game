import { _decorator, Component, instantiate, Node, Prefab, size, UITransform, v3, Vec2, Vec3, Widget } from 'cc';
import { InputManager } from '../Manager/InputManager';
import { Grid } from '../Components/Grid';
import { ObjectController } from '../ObjectController';
import { ObjectData } from '../ObjectData';
import { WireController } from '../WireController';
const { ccclass, property } = _decorator;

@ccclass('placementSystem')
export class placementSystem extends Component {

    static instance : placementSystem = null;

    @property(Node)
    inputDirctor: Node = null;

    @property(InputManager)
    inputManager: InputManager = null;

    // @property(Node)
    placeObject : Node = null;
    placeObjectController : ObjectController = null;
    placeObjectData : ObjectData = null;

    @property(Node)
    selectIndecate : Node = null;

    @property(Grid)
    grid: Grid = null;

    @property(Node)
    placeObjectParent : Node;

    // onPlaceing : boolean = true;

    placeObjectControllerList : ObjectController[] = [];

    currentPlacenum : number = 0;

    inf : number = 99999999;

    LastgridPos : Vec3 = new Vec3(this.inf, this.inf, this.inf);

    protected onLoad(): void {  
        placementSystem.instance = this;
    }

    setPlaceObject(data : ObjectData){
        this.placeObjectData = data;
        this.selectIndecate.getComponent(UITransform).setContentSize(size(this.grid.cellSize.x * data.gridSize.x, this.grid.cellSize.y * data.gridSize.y));
    }
    
    private createPlaceObject(pos : Vec3, gridPos : Vec2) {
        this.placeObject = instantiate(this.placeObjectData.prefab);
        this.placeObject.setParent(this.placeObjectParent);
        this.placeObjectController = this.placeObject.getComponent(ObjectController);
        this.placeObjectController.button.enabled = false;
        this.placeObject.getComponent(UITransform).setContentSize(size(this.grid.cellSize.x * this.placeObjectController.data.gridSize.x, this.grid.cellSize.y * this.placeObjectController.data.gridSize.y));
        this.placeObject.setWorldPosition(pos);
        this.placeObjectController.onMap = true;
        this.placeObjectController.gridPos = gridPos;
        this.placeObjectControllerList.push(this.placeObjectController);
    }

    undoCreatePlaceObject(){
        if (this.placeObjectControllerList.length <= 0){
            console.log("没了")
            return;
        }
        let temp = this.placeObjectControllerList[this.placeObjectControllerList.length - 1]; // 可用对象池
        this.placeObjectControllerList.pop();
        this.grid.RefreeArea(temp.gridPos.x, temp.gridPos.y, temp.data.gridSize.x, temp.data.gridSize.y);
        temp.node.destroy();
    }

    protected update(dt: number): void {
        this.inputDirctor.setWorldPosition(this.inputManager.getTouchPosition().x, this.inputManager.getTouchPosition().y, 0);
        let gridPos = this.grid.getWorldtoCellPosition(this.inputDirctor.worldPosition);
        
        // 强制grid位移单方向
        if (this.inputManager.isTouching){
            console.log(this.LastgridPos)
            if (this.LastgridPos.x > this.inf / 2){
                this.LastgridPos = gridPos.clone();
            }else{
                let dx = this.LastgridPos.x - gridPos.x;
                let dy = this.LastgridPos.y - gridPos.y;
                if (dx != 0 && dy != 0){
                    dx = 0;
                }
                gridPos.x = this.LastgridPos.x - dx;
                gridPos.y = this.LastgridPos.y - dy;
                this.LastgridPos = gridPos.clone();
            }
        }else{
            this.LastgridPos = new Vec3(this.inf, this.inf, this.inf);
        }
        this.selectIndecate.setWorldPosition(this.grid.getCelltoWorldPosition(gridPos));
        if (this.inputManager.isTouching && this.placeObjectData != null){
            if (this.grid.OccupyArea(gridPos.x, gridPos.y, this.placeObjectData.gridSize.x, this.placeObjectData.gridSize.y)){
                this.createPlaceObject(this.selectIndecate.worldPosition, new Vec2(gridPos.x, gridPos.y));
                this.currentPlacenum++;
                if (this.currentPlacenum > 1){
                    this.placeObjectControllerList[this.placeObjectControllerList.length - 1].setPreNode(this.placeObjectControllerList[this.placeObjectControllerList.length - 2]);
                    this.placeObjectControllerList[this.placeObjectControllerList.length - 1].checkType();
                    this.placeObjectControllerList[this.placeObjectControllerList.length - 2].setNextNode(this.placeObjectControllerList[this.placeObjectControllerList.length - 1]);
                    this.placeObjectControllerList[this.placeObjectControllerList.length - 2].checkType();
                }
            }
        }else if (this.currentPlacenum > 0){
            console.log(this.placeObjectControllerList.length);
            for (let i = 0; i < this.placeObjectControllerList.length; i++){
                console.log(this.placeObjectControllerList[i] as WireController);
            }    
            this.currentPlacenum = 0;
        }
    }

}