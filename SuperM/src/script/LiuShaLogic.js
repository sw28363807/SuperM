import GameContext from "../GameContext";
import EventMgr from "./EventMgr";
import Events from "./Events";
import Utils from "./Utils";

export default class LiuShaLogic extends Laya.Script {

    constructor() { 
        super();
    }
    
    onEnable() {
    }

    onStart() {
        EventMgr.getInstance().registEvent(Events.Role_A_Button, this, this.onRoleAButton);
        GameContext.roleInLiuSha = false;
        this.owner.keY =  GameContext.keSpr.y;
        this.owner.roleSprY = GameContext.roleSpr.y;
        this.owner.liuShaDieY = 0;
        this.owner.speed = 3;
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
            this.owner.roleZOrder = GameContext.role.zOrder;
            GameContext.roleInLiuSha = true;
            GameContext.curRoleLiuSha = this.owner;
            GameContext.role.zOrder = this.owner.zOrder - 1;
        } else if (other.label == "KeBulletFoot") {
            if (other.owner) {
                Utils.removeThis(other.owner);   
            }
        } else if (other.label == "MonsterBody" || other.label == "MonsterHead" || other.label == "MonsterFoot") {
            if (other) {
                Utils.createMonsterDropDeadEffect(other.owner);   
            }
        }
    }

    onTriggerExit(other, self, contact) {
        if (other.label == "RoleFoot") {
            GameContext.roleInLiuSha = false;
            GameContext.keSpr.y = this.owner.keY;
            GameContext.roleSpr.y = this.owner.roleSprY;
            GameContext.curRoleLiuSha = null;
            GameContext.role.zOrder = this.owner.roleZOrder;
        }
    }

    onUpdate() {
        if (GameContext.roleSpr && GameContext.keSpr && GameContext.roleInLiuSha
             && GameContext.curRoleLiuSha == this.owner) {
            GameContext.keSpr.y += this.owner.speed;
            GameContext.roleSpr.y += this.owner.speed;
            this.owner.liuShaDieY += this.owner.speed;
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