import { _decorator, Component, Node, Prefab } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ObjectManager')
export class ObjectManager extends Component {
    instance : ObjectManager = null;


    @property(Prefab)
    straightWirePrefab : Prefab;
    @property(Prefab)
    BatteryPrefab : Prefab;

    protected onLoad(): void {
        this.instance = this;
    }
    

}


