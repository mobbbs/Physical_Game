import { _decorator, Component, math, Node, SpringJoint2D, Sprite, spriteAssembler, SpriteFrame, Vec2 } from 'cc';
import { ObjectController } from './ObjectController';
const { ccclass, property } = _decorator;

enum Direction {
    left,
    right,
    up,
    down,
}
enum RotationType { // 以初始状态开始旋转幅度每逆时针90度一档次 {0, 90, 180, 270}
    stateFirst,
    stateSecond,
    stateThird,
    stateFourth
}
const WireType = {
    straight: {
        head: 0,
        mid: 1,
        tail: 2
    },
    corner : {
        mid : 4
    }
}


@ccclass('WireController')
export class WireController extends ObjectController {

    @property(SpriteFrame)
    straight_head: SpriteFrame;
    @property(SpriteFrame)
    straight_mid: SpriteFrame;
    @property(SpriteFrame)
    straight_tail: SpriteFrame;
    @property(SpriteFrame)
    corner_mid : SpriteFrame;
    
    spfs: Map<number, SpriteFrame> = new Map<number, SpriteFrame>;
    rotationType: RotationType = RotationType.stateFirst;
    protected override onLoad(): void {
        super.onLoad();
        this.saveWireTypeSpf(WireType.straight.head, this.straight_head.clone());
        this.saveWireTypeSpf(WireType.straight.mid, this.straight_mid.clone());
        this.saveWireTypeSpf(WireType.straight.tail, this.straight_tail.clone());
        this.saveWireTypeSpf(WireType.corner.mid, this.corner_mid.clone());
    }

    private saveWireTypeSpf(type: any, newspf: SpriteFrame) {
        this.spfs.set(type, newspf);
    }

    getDirection(Dif: Vec2) { // 假设为 Dif = pos1 - pos2，返回值恒为pos2在pos1的那个方向上 
        if (Dif.x == 0 && Dif.y == 1) {
            return Direction.down;
        } else if (Dif.x == 0 && Dif.y == -1) {
            return Direction.up;
        } else if (Dif.x == 1 && Dif.y == 0) {
            return Direction.left;
        } else {
            return Direction.right;
        }
    }

    override checkType(): void {
        if (this.preController == null) {
            if (this.nextController) {
                let curPos = this.gridPos.clone();
                let nextPos = this.nextController.gridPos;
                let DiffPos = curPos.subtract(nextPos);
                let dir = this.getDirection(DiffPos);
                if (dir == Direction.up) {
                    this.Type = WireType.straight.head;
                    this.rotationType = RotationType.stateFourth;
                } else if (dir == Direction.down) {
                    this.Type = WireType.straight.head;
                    this.rotationType = RotationType.stateSecond;
                } else if (dir == Direction.left) {
                    this.Type = WireType.straight.head;
                    this.rotationType = RotationType.stateFirst;
                } else {
                    this.Type = WireType.straight.head;
                    this.rotationType = RotationType.stateThird;
                }
            } else {
                this.Type = WireType.straight.head;
                this.rotationType = RotationType.stateFirst;
            }
        } else if (this.nextController == null) {
            let curPos = this.gridPos.clone();
            let prePos = this.preController.gridPos;
            let DiffPos = curPos.subtract(prePos);
            let dir = this.getDirection(DiffPos);
            if (dir == Direction.up) {
                this.Type = WireType.straight.tail;
                this.rotationType = RotationType.stateFourth;
            } else if (dir == Direction.down) {
                this.Type = WireType.straight.tail;
                this.rotationType = RotationType.stateSecond;
            } else if (dir == Direction.left) {
                this.Type = WireType.straight.tail;
                this.rotationType = RotationType.stateFirst;
            } else {
                this.Type = WireType.straight.tail;
                this.rotationType = RotationType.stateThird;
            }
        } else {
            let curPos = this.gridPos.clone();
            let prePos = this.preController.gridPos;
            let DiffPospre = curPos.subtract(prePos);
            let dirPre = this.getDirection(DiffPospre.clone());
            let nextPos = this.nextController.gridPos;
            curPos = this.gridPos.clone();
            let DiffPosnext = curPos.subtract(nextPos);
            let dirNext = this.getDirection(DiffPosnext.clone());

            if (this.checkDirEqualNoOrder(dirPre, dirNext, Direction.down, Direction.right)){
                this.Type = WireType.corner.mid;
                this.rotationType = RotationType.stateFirst;
            }else if(this.checkDirEqualNoOrder(dirPre, dirNext, Direction.up, Direction.right)){
                this.Type = WireType.corner.mid;
                this.rotationType = RotationType.stateSecond;
            }else if(this.checkDirEqualNoOrder(dirPre, dirNext, Direction.up, Direction.left)){
                this.Type = WireType.corner.mid;
                this.rotationType = RotationType.stateThird;
            }else if(this.checkDirEqualNoOrder(dirPre, dirNext, Direction.down, Direction.left)){
                this.Type = WireType.corner.mid;
                this.rotationType = RotationType.stateFourth;
            }else if(this.checkDirEqualNoOrder(dirPre, dirNext, Direction.right, Direction.left)){
                console.log("DASDSA");
                this.Type = WireType.straight.mid;
                this.rotationType = RotationType.stateFirst;
            }else if(this.checkDirEqualNoOrder(dirPre, dirNext, Direction.down, Direction.up)){
                this.Type = WireType.straight.mid;
                this.rotationType = RotationType.stateSecond;
            }
        }
        this.freshState();
    }

    freshState() {
        this.sp.spriteFrame = this.spfs.get(this.Type);
        this.sp.node.angle = this.rotationType * 90;
    }

    checkDirEqual(d1 : Direction, d2 : Direction, d3 : Direction, d4 : Direction){
        if (d1 == d3 && d2 == d4){
            return true;
        }
        return false;
    }

    checkDirEqualNoOrder(d1 : Direction, d2 : Direction, d3 : Direction, d4 : Direction){ // 不考虑先后链接的方向判定
        if (this.checkDirEqual(d2, d1, d3, d4) || this.checkDirEqual(d1, d2, d3, d4)){
            return true;
        }
        return false;
    }


}


