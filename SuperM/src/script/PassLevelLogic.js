import GameContext from "../GameContext";

export default class PassLevelLogic extends Laya.Script {

    constructor() { 
        super();
    }
    
    onEnable() {
    }

    onDisable() {
    }

    onTriggerEnter(other, self, contact) {
        if (other.label == "RoleHead" || other.label == "RoleBody" || other.label == "RoleFoot" ) {
            GameContext.initRolePoint = null;
            Laya.Scene.open("scene/Level1_1.scene");
        }
    }
}