import Events from "./Events";
import EventMgr from "./EventMgr";
import GameContext from "../GameContext";
import Utils from "./Utils";

export default class TanLiBrickLogic extends Laya.Script {

    constructor() { 
        super(); 
    }

    onTriggerEnter(other, self, contact) {
        if (other && other.label == "RoleFoot" ) {
            GameContext.roleInGround = false;
            let lineSpeed =  GameContext.getLineSpeed();
            let finalSpeed = lineSpeed.y - 30;
            if (finalSpeed < -40) {
                finalSpeed = -40
            }
            GameContext.setRoleSpeed(lineSpeed.x, finalSpeed);
        }
    }
    
    onEnable() {
    }

    onDisable() {
    }
}