import Utils from "./Utils";
import GameContext from "../GameContext";

export default class DoorLogic extends Laya.Script {

    constructor() { 
        super();
        /** @prop {name:customX, tips:"自定义x", type:Int, default:-9999999}*/
        let customX = 0;
        /** @prop {name:customY, tips:"自定义y", type:Int, default:-9999999}*/
        let customY = 0;
    }
    
    onEnable() {

    }

    onStart() {
        let script =  this.owner.getComponent(DoorLogic);
        if (script.customX) {
            if (script.customX != -9999999) {
                this.owner.customX = script.customX;
            }
        }

        if (script.customY) {
            if (script.customY != -9999999) {
                this.owner.customY = script.customY;
            }
        }

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
        // if (this.owner.inDoor == true) {
        //     if (GameContext.walkDirect && GameContext.walkDirect.y != 0 && GameContext.commandWalk == true && GameContext.roleInGround == true) {
        //         this.owner.enterCount++;
        //         if (this.owner.enterCount > 60) {
        //             this.owner.enterCount = 0;
        //             this.owner.inDoor = false;
        //             Utils.triggerToRandomDoor(this.owner, this.owner.customX, this.owner.customY);
        //         }
        //     } else {
        //         this.owner.enterCount = 0;
        //     }
        // }

        if (this.owner.inDoor == true) {
            this.owner.inDoor = false;
            Utils.triggerToRandomDoor(this.owner, this.owner.customX, this.owner.customY);
        }
    }
}