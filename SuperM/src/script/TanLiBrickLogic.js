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
            GameContext.setRoleSpeed(lineSpeed.x, lineSpeed.y - 30);
        }
    }
    
    onEnable() {
    }

    onDisable() {
    }
}