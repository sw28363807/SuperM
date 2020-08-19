import GameContext from "../GameContext";
import Role from "./Role";

export default class MoveBrickLogic extends Laya.Script {

    constructor() { 
        super(); 
        /** @prop {name:moveType, tips:"1 固定移动 2 路径移动", type:Int, default:1}*/
        let moveType = 1;
        /** @prop {name:moveTime, tips:"移动时间", type:Int, default:2000}*/
        let moveTime = 2000;
        /** @prop {name:moveDirect, tips:"1 横向 2 纵向", type:Int, default:1}*/
        let moveDirect = 1;
        /** @prop {name:moveSpeed, tips:"移动速度", type:Int, default:2}*/
        let moveSpeed = 2;
    }
    
    onEnable() {
        let script =  this.owner.getComponent(MoveBrickLogic);
        if (script.moveType) {
            this.owner.moveType = script.moveType;
        } else {
            this.owner.moveType = 1;
        }

        if (script.moveTime) {
            this.owner.moveTime = script.moveTime;
        } else {
            this.owner.moveTime = 2000;
        }

        if (script.moveDirect) {
            this.owner.moveDirect = script.moveDirect;
        } else {
            this.owner.moveDirect = 1;
        }

        if (script.moveSpeed) {
            this.owner.moveSpeed = script.moveSpeed;
        } else {
            this.owner.moveSpeed = 2;
        }

        this.owner.rigidBody = this.owner.getComponent(Laya.RigidBody);
        this.owner.direct = 1;

        // this.owner.startPoint = {x: this.owner.x, y: this.owner.y};
    }

    onStart() {
        if (this.owner.moveType == 1) {
            Laya.timer.loop(this.owner.moveTime, this, this.onSwitchDirect);
        }
    }

    onSwitchDirect() {
        if (this.owner.moveDirect == 1) {
            this.owner.rigidBody.setVelocity({x: this.owner.direct * this.owner.moveSpeed, y: 0});
            this.owner.direct = -this.owner.direct;
            this.refreshSpeed();
        }
    }

    onTriggerEnter(other, self, contact) {
        if (other.label == "RoleFoot") {
            GameContext.roleInMoveGround = true;
            this.refreshSpeed();
        }
    }

    onTriggerExit(other, self, contact) {
        if (other.label == "RoleFoot") {
            GameContext.roleInMoveGround = false;
        }
    }

    refreshSpeed() {
        if (GameContext.roleInMoveGround) {
            if (this.owner.moveDirect == 1) {
                if (GameContext.commandWalk == false) {
                    let lineSpeed =  GameContext.getLineSpeed();
                    GameContext.setRoleSpeed(-this.owner.direct * this.owner.moveSpeed, lineSpeed.y);
                }
            } else if (this.owner.moveDirect == 2) {
                GamepadEvent.roleOutSpeed = {x: 0, y: this.owner.direct * this.owner.moveSpeed};
            }
        }
    }

    onUpdate() {
        this.refreshSpeed();
    }
    
    onDisable() {
        Laya.timer.clear(this, this.onSwitchDirect);
    }
}