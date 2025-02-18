import { _decorator, Component, Node, size, UITransform, v3, Vec3, Widget } from 'cc';
import { InputManager } from '../Manager/InputManager';
import { Grid } from '../Components/Grid';
import { ObjectController } from '../ObjectController';
const { ccclass, property } = _decorator;

@ccclass('placementSystem')
export class placementSystem extends Component {
    @property(Node)
    inputDirctor: Node = null;

    @property(InputManager)
    inputManager: InputManager = null;

    @property(Node)
    placeObject: Node = null;
    objectController : ObjectController = null;


    @property(Grid)
    grid: Grid = null;

    onPlaceing : boolean = true;

    setPlaceObject(newObject : Node){
        this.placeObject = newObject;
        this.objectController = this.placeObject.getComponent(ObjectController);
        this.placeObject.getComponent(UITransform).setContentSize(size(this.grid.cellSize.x * this.objectController.data.gridSize.x, this.grid.cellSize.y * this.objectController.data.gridSize.y));
    }
    
    protected update(dt: number): void {
        this.inputDirctor.setWorldPosition(this.inputManager.getTouchPosition().x, this.inputManager.getTouchPosition().y, 0);
        let gridPos = this.grid.getWorldtoCellPosition(this.inputDirctor.worldPosition);
        this.placeObject.setWorldPosition(this.grid.getCelltoWorldPosition(gridPos));
    }

}