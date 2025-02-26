import { _decorator, Component, instantiate, Node, Prefab, Vec2 } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('ObjectManager')
export class ObjectManager extends Component {
    instance : ObjectManager = null;


    @property(Prefab)
    straightWirePrefab : Prefab;
    @property(Prefab)
    BatteryPrefab : Prefab;
    @property(Prefab)
    BuldPrefab : Prefab
    @property(Prefab)
    SwitchPrefab : Prefab;

    @property(Node)
    ObjectListParent : Node;



    protected onLoad(): void {
        this.instance = this;
        let straightWire = instantiate(this.straightWirePrefab);
        let Battery = instantiate(this.BatteryPrefab);
        let Buld = instantiate(this.BuldPrefab);
        let SwitchPrefab = instantiate(this.SwitchPrefab);
        straightWire.setParent(this.ObjectListParent);
        straightWire.setScale(1.2, 1.2, 1.2);
        Battery.setParent(this.ObjectListParent);
        Battery.setScale(1.2, 1.2, 1.2);
        Buld.setParent(this.ObjectListParent);
        Buld.setScale(1.2, 1.2, 1.2);
        SwitchPrefab.setParent(this.ObjectListParent);
        SwitchPrefab.setScale(1.2, 1.2, 1.2);
    }
    

}


