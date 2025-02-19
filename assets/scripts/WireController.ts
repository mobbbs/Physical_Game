import { _decorator, Component, Node, SpringJoint2D, Sprite, Vec2 } from 'cc';
import { ObjectController } from './ObjectController';
const { ccclass, property } = _decorator;

enum Direction {
    left,
    right,
    up,
    down,
}

@ccclass('WireController')
export class WireController extends ObjectController {

    static WireType = {
        straight: {
            head: { Vertical: 0, Horizontal: 1 },
            mid: { Vertical: 0, Horizontal: 1 },
            tail: { Vertical: 0, Horizontal: 1 }
        },
    }

    getDirection(Dif: Vec2) { // 假设为 Dif = pos1 - pos2，返回值恒为pos2在pos1的那个方向上 
        if (Dif == new Vec2(0, 1)) {
            return Direction.down;
        } else if (Dif == new Vec2(0, -1)) {
            return Direction.up;
        } else if (Dif == new Vec2(1, 0)) {
            return Direction.left;
        } else {
            return Direction.right;
        }
    }

    override checkType(): void {
        if (this.preController == null) {
            this.Type = WireController.WireType.straight;
            if (this.nextController) {
                let curPos = this.gridPos;
                let nextPos = this.nextController.gridPos;
                let DiffPos = curPos.clone().subtract(nextPos);
                let dir = this.getDirection(DiffPos);
                if (dir == Direction.up || dir == Direction.down) {
                    this.Type = WireController.WireType.straight.head.Vertical;
                } else {
                    this.Type = WireController.WireType.straight.head.Horizontal;
                }
            } else {
                this.Type = WireController.WireType.straight.head.Horizontal;
            }
        } else if (this.nextController == null) {
            this.Type = WireController.WireType;
        } else {
            this.Type = WireController.WireType;
        }
    }

}


