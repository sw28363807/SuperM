import GameContext from "../GameContext";

export default class HuoYanChiLogic extends Laya.Script {

    constructor() { 
        super();
    }
    
    onEnable() {
        
    }

    onDisable() {
    }

    onStart() {
        this.owner.roleZOrder = GameContext.role.zOrder;
    }

    onTriggerEnter(other, self, contact) {
        if (other.label == "RoleHead" || other.label == "RoleBody" || other.label == "RoleFoot") {
            GameContext.role.zOrder = this.owner.zOrder - 1;
            Laya.timer.once(1000, this, function() {
                if (this.owner) {
                    GameContext.triggerInHuoChi(this.owner);
                    GameContext.role.zOrder = this.owner.roleZOrder;
                }
            });
        }
    }

    onTriggerExit(other, self, contact) {
        if (other.label == "RoleHead" || other.label == "RoleBody" || other.label == "RoleFoot") {
            GameContext.role.zOrder = this.owner.roleZOrder;
        }
    }
}