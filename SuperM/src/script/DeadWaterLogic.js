import GameContext from "../GameContext";

export default class DeadWaterLogic extends Laya.Script {

    constructor() { 
        super();
    }
    
    onEnable() {
    }

    onDisable() {
    }

    onTriggerEnter(other, self, contact) {
        if (self.label == "DeadWater") {
            if (other.label == "RoleHead" || other.label == "RoleFoot" || other.label == "RoleBody" ) {
                GameContext.triggerGotoHole(this.owner, 100);
            }
        }
    }
}