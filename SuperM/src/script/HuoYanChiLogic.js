import GameContext from "../GameContext";
import Utils from "./Utils";

export default class HuoYanChiLogic extends Laya.Script {

    constructor() { 
        super();
        /** @prop {name:customX, tips:"自定义重置X", type:Number, default:-99999999}*/
        let customX = -99999999;
        /** @prop {name:customY, tips:"自定义重置Y", type:Number, default:-99999999}*/
        let customY = -99999999;
    }
    
    onEnable() {
        
    }

    onDisable() {
    }

    onStart() {
        let script = this.owner.getComponent(HuoYanChiLogic);
        if (script && script.customX && script.customX != -99999999) {
            this.owner.customX = script.customX;
        } else {
            this.owner.customX = null;
        }

        if (script && script.customY && script.customY != -99999999) {
            this.owner.customY = script.customY;
        } else {
            this.owner.customY = null;
        }
        this.owner.roleZOrder = GameContext.role.zOrder;
    }

    onTriggerEnter(other, self, contact) {
        if (other.label == "RoleHead" || other.label == "RoleBody" || other.label == "RoleFoot") {
            if (GameContext.roleIsDrop == true) {
                return;
            }
            GameContext.role.zOrder = this.owner.zOrder - 500;
            GameContext.roleIsDrop = true;
            if (this.owner) {
                Utils.triggerInHuoChi(this.owner, this.owner.customX, this.owner.customY);
                GameContext.role.zOrder = this.owner.roleZOrder;
            }
        }
    }

    onTriggerExit(other, self, contact) {
        if (other.label == "RoleHead" || other.label == "RoleBody" || other.label == "RoleFoot") {
            GameContext.role.zOrder = this.owner.roleZOrder;
        }
    }
}