import { _decorator, Component, Node, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('grid')
export class grid extends Component {
    
    position : Vec2 = new Vec2();
    
}


