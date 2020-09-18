import GameContext from "../GameContext";
import EventMgr from "./EventMgr";
import Events from "./Events";
import Utils from "./Utils";

export default class BrickGoldLogic extends Laya.Script {

    constructor() { 
        super();
    }

    onTriggerEnter(other, self, contact) {
        if (!this.owner) {
            return;
        }
        if (this.owner.hasBroken == true) {
            return;
        }
        if (GameContext.brokenBrickTick != 0) {
            return;
        }
        if (other && (other.label == "RoleHead")) {
            if (self) {
                if (!Utils.roleInFloor(self.owner)) {
                    return;
                }
                let lineSpeed = GameContext.getLineSpeed();
                GameContext.setRoleSpeed(lineSpeed.x, 0);
                Utils.createHeadBullet(this.owner);
                if (GameContext.gameRoleBodyState == 1) {
                    this.onCreateBrokenBrick();
                } else {
                    let render = this.owner.getChildByName("render");
                    render.play(0, false, "ani3");
                    Laya.SoundManager.playSound("loading/dingzhuang.mp3");
                }
                GameContext.brokenBrickTick = 5;
            }
        } else if (other && other.label == "KeBullet") {
            if (self) {
                this.onCreateBrokenBrick();
            }
        }
    }

    onCreateBrokenBrick() {
        if (!this.owner) {
           return; 
        }
        if (this.owner.hasBroken == true) {
            return;
        }
        this.owner.hasBroken = true;
        Laya.SoundManager.playSound("loading/posui.mp3");
        Laya.SoundManager.playSound("loading/gold.mp3");
        Utils.createBrickBrokenEffect(this.owner);
        Utils.createGoldEffect(this.owner);
    }
    
    onEnable() {
        // this.owner.isStartAI = false;
    }

    onStart() {
        this.owner.hasBroken =- false;
        this.owner.isPlayingAni = false;
        this.owner.renderBrick = this.owner.getChildByName("render");
    }

    onUpdate() {
        if (!this.owner) {
            return;
        }
        if (this.owner.hasBroken == true) {
            return;
        }
        if (this.owner && GameContext.role && this.owner.renderBrick) {
            let distanceX = Math.abs(GameContext.role.x - this.owner.x);
            let distanceY = Math.abs(GameContext.role.y - this.owner.y);
            if (distanceX <= 1000 && distanceY <= 1000) {
                if (this.owner.isPlayingAni == false) {
                    this.owner.isPlayingAni = true;
                    this.owner.renderBrick.play(0, true, "ani1");
                    this.owner.renderBrick.visible = true;
                }
            } else {
                if (this.owner.isPlayingAni == true) {
                    this.owner.renderBrick.stop();
                    this.owner.renderBrick.visible = false;
                    this.owner.isPlayingAni = false;
                }
            }
        }
    }

    onDisable() {
    }
}