import Utils from "./Utils";
import GameContext from "../GameContext";

export default class DoorLogic extends Laya.Script {

    constructor() { 
        super();
    }
    
    onEnable() {
        this.owner.inDoor = false;
        this.owner.enterCount = 0;
    }

    onDisable() {
    }

    onTriggerEnter(other, self, contact) {
        if (!this.owner) {
            return;
        }
        if (other.label == "RoleHead" || other.label == "RoleBody" || other.label == "RoleFoot") {
            this.owner.inDoor = true;
        }
    }
    
    onTriggerExit(other, self, contact) {
        if (!this.owner) {
            return;
        }
        if (other.label == "RoleHead" || other.label == "RoleBody" || other.label == "RoleFoot") {
            this.owner.inDoor = false;
        }
    }

    onUpdate() {
        if (this.owner.inDoor == true) {
            if (GameContext.walkDirect && GameContext.walkDirect.y != 0 && GameContext.commandWalk == true && GameContext.roleInGround == true) {
                this.owner.enterCount++;
                if (this.owner.enterCount > 60) {
                    this.owner.enterCount = 0;
                    this.owner.inDoor = false;
                    Utils.triggerToRandomDoor(this.owner);
                }
            } else {
                this.owner.enterCount = 0;
            }
        }
    }
}