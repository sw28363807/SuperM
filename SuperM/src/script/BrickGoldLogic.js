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
        if (GameContext.brokenBrickTick != 0) {
            return;
        }
        if (other && (other.label == "RoleHead")) {
            if (self) {
                if (!Utils.roleInFloor(self.owner)) {
                    return;
                }
                Utils.createHeadBullet(this.owner);
                if (GameContext.gameRoleBodyState == 1) {
                    this.onCreateBrokenBrick();
                } else {
                    let render = this.owner.getChildByName("render");
                    render.play(0, false, "ani3");
                }
                GameContext.brokenBrickTick = 10;
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
        Utils.createBrickBrokenEffect(this.owner);
        Utils.createGoldEffect(this.owner);
    }
    
    onEnable() {
        this.owner.isStartAI = false;
    }

    onUpdate() {
        if (this.owner.isStartAI == false) {
            if (this.owner && GameContext.role) {
                if (this.owner.x < GameContext.role.x + 1500 && this.owner.x > GameContext.role.x) {
                    this.owner.isStartAI = true;
                    let render = this.owner.getChildByName("render");
                    render.play(0, true, "ani1");
                    return;
                }
            }
        }
    }

    onDisable() {
    }
}