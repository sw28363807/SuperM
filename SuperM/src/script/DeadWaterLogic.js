import GameContext from "../GameContext";

export default class DeadWaterLogic extends Laya.Script {

    constructor() { 
        super();
        /** @prop {name:resetPosX, tips:"重置位置", type:Int, default:0}*/
        let resetPosX = 0;
    }
    
    onEnable() {
    }

    onDisable() {
    }

    onStart() {
        let script =  this.owner.getComponent(DeadWaterLogic);
        if (script.resetPosX) {
            this.owner.resetPosX = script.resetPosX;
        } else {
            this.owner.resetPosX = 0;
        }
    }

    onTriggerEnter(other, self, contact) {
        if (self.label == "DeadWater") {
            if (other.label == "RoleHead" || other.label == "RoleFoot" || other.label == "RoleBody" ) {
                GameContext.triggerGotoHole(this.owner, null, this.owner.resetPosX);
            }
        }
    }
}