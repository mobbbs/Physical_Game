import { _decorator, Component, instantiate, Node, Prefab, Vec2 } from 'cc';
import { ObjectController } from '../ObjectController';
import { ObjectData } from '../ObjectData';
const { ccclass, property } = _decorator;

@ccclass('ObjectManager')
export class ObjectManager extends Component {
    instance : ObjectManager = null;


    @property(Prefab)
    straightWirePrefab : Prefab;
    @property(Prefab)
    BatteryPrefab : Prefab;

    @property(Node)
    ObjectListParent : Node;

    protected onLoad(): void {
        this.instance = this;
        let straightWire = instantiate(this.straightWirePrefab);
        let Battery = instantiate(this.BatteryPrefab);
        straightWire.setParent(this.ObjectListParent);
        Battery.setParent(this.ObjectListParent);
    }
    

}


