import GameContext from "../GameContext";

export default class DeadWaterLogic extends Laya.Script {

    constructor() { 
        super();
        /** @prop {name:resetPosX, tips:"重置位置", type:Int, default:0}*/
        let resetPosX = 0;
        /** @prop {name:upHeight, tips:"上浮位置", type:Int, default:0}*/
        let upHeight = 0;
        /** @prop {name:upTime, tips:"上浮持续时间", type:Int, default:0}*/
        let upTime = 0;
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

        if (script.upHeight) {
            this.owner.upHeight = script.upHeight;
        } else {
            this.owner.upHeight = 0;
        }

        if (script.upTime) {
            this.owner.upTime = script.upTime;
        } else {
            this.owner.upTime = 0;
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