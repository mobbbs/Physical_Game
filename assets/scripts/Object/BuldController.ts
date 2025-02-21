import { _decorator, Component, Node, Sprite, SpriteFrame } from 'cc';
import { ObjectController } from './ObjectController';
const { ccclass, property } = _decorator;

@ccclass('BuldController')
export class BuldController extends ObjectController {

    @property([SpriteFrame])
    sps : SpriteFrame[] = [];

    protected override onLoad(): void {
        super.onLoad();
        this.beNode = true;
    }

    override freshState(){
        this.sp.spriteFrame = this.sps[Number(this.Onele)];
    }
}


