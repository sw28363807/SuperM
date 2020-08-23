import GameContext from "../GameContext";

export default class WaterLogic extends Laya.Script {

    constructor() { 
        super(); 
        // /** @prop {name:waterType, tips:"1 不可以游泳 2 可以游泳", type:Int, default:1}*/
        // let waterType = 1;
    }
    
    onEnable() {
        this.owner.RoleZOrder = 1;
        this.owner.waterGroundLeft = false;
    }

    onDisable() {
    }

    onTriggerEnter(other, self, contact) {
        if (self.label == "WaterSensor") {
            if (other.label == "RoleHead" || other.label == "RoleFoot" || other.label == "RoleBody" ) {
                if (GameContext.roleInWater == false) {
                    GameContext.roleInWater = true;
                    this.owner.RoleZOrder = GameContext.role.zOrder;
                    GameContext.role.zOrder = this.owner.zOrder + 1;
                    GameContext.setRoleGravityScale(0);
                    GameContext.setRoleSpeed(0, 0);
                    GameContext.roleInWaterObject = this.owner;
                }
            }
        }
    }

    onTriggerExit(other, self, contact) {
        if (self.label == "WaterSensor") {
            if (other.label == "RoleFoot") {
                GameContext.roleInWater = false;
                GameContext.roleInWaterObject = null;
                GameContext.role.zOrder = this.owner.RoleZOrder;
                GameContext.setRoleGravityScale(6);
            }
        }
    }

    onUpdate() {
    }
}