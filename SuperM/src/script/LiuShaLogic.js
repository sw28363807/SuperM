import GameContext from "../GameContext";
import EventMgr from "./EventMgr";
import Events from "./Events";

export default class LiuShaLogic extends Laya.Script {

    constructor() { 
        super();
    }
    
    onEnable() {
        EventMgr.getInstance().registEvent(Events.Role_A_Button, this, this.onRoleAButton);
        GameContext.roleInLiuSha = false;
        this.owner.keY =  GameContext.keSpr.y;
        this.owner.roleSprY = GameContext.roleSpr.y;
        this.owner.liuShaDieY = 0;
    }

    onDisable() {
        EventMgr.getInstance().removeEvent(Events.Role_A_Button, this, this.onRoleAButton);
    }

    onRoleAButton() {
        GameContext.keSpr.y = this.owner.keY;
        GameContext.roleSpr.y = this.owner.roleSprY;
        this.owner.liuShaDieY = 0;
        GameContext.roleInLiuSha = false;
    }

    onTriggerEnter(other, self, contact) {
        if (other.label == "RoleFoot") {
            GameContext.roleInLiuSha = true;
            GameContext.curRoleLiuSha = this.owner;
        }
    }

    onTriggerExit(other, self, contact) {
        if (other.label == "RoleFoot") {
            GameContext.roleInLiuSha = false;
            GameContext.keSpr.y = this.owner.keY;
            GameContext.roleSpr.y = this.owner.roleSprY;
            GameContext.curRoleLiuSha = null;
        }
    }

    onUpdate() {
        if (GameContext.roleSpr && GameContext.keSpr && GameContext.roleInLiuSha
             && GameContext.curRoleLiuSha == this.owner) {
            let yOff = 0.5;
            GameContext.keSpr.y += yOff;
            GameContext.roleSpr.y += yOff;
            this.owner.liuShaDieY += yOff;
            if (this.owner.liuShaDieY > 112) {
                GameContext.keSpr.y = this.owner.keY;
                GameContext.roleSpr.y = this.owner.roleSprY;
                this.owner.liuShaDieY = 0;
                GameContext.roleInLiuSha = false;
                GameContext.curRoleLiuSha = null;
                GameContext.triggerInLiuSha(this.owner);
            }
        }
    }
}