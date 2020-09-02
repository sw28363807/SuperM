import Utils from "./Utils";

export default class CiBrickLogic extends Laya.Script {

    constructor() { 
        super(); 
        /** @prop {name:downDistance, tips:"下落距离", type:Int, default:0}*/
        let downDistance = 0;
        /** @prop {name:upDistance, tips:"上移距离", type:Int, default:0}*/
        let upDistance = 0;
        /** @prop {name:idleCountMax, tips:"移动休眠间隔count", type:Int, default:0}*/
        let idleCountMax = 0;
    }

    onStart() {
        let script =  this.owner.getComponent(CiBrickLogic);
        if (script.downDistance) {
            this.owner.downDistance = script.downDistance;
        } else {
            this.owner.downDistance = 0;
        }

        if (script.upDistance) {
            this.owner.upDistance = script.upDistance;
        } else {
            this.owner.upDistance = 0;
        }

        if (script.idleCountMax) {
            this.owner.idleCountMax = script.idleCountMax;
        } else {
            this.owner.idleCountMax = 0;
        }
        this.owner.startPoint = {x: this.owner.x, y: this.owner.y};
        this.owner.upPoint = {x: this.owner.x, y: this.owner.y - this.owner.upDistance};
        this.owner.downPoint = {x: this.owner.x, y: this.owner.y + this.owner.downDistance};
        this.owner.outSpeed = 7;
        this.owner.inSpeed = 4;
        this.owner.moveType = 1; //1 向上 2 向下 3 上下都有 4 不动
        if (this.owner.upDistance != 0 && this.owner.downDistance != 0) {
            this.owner.moveType = 3;
        } else if (this.owner.upDistance != 0) {
            this.owner.moveType = 1;
        } else if (this.owner.downDistance != 0) {
            this.owner.moveType = 2;
        } else {
            this.owner.moveType = 4;
        }
        this.owner.state = 1;   //1 休息状态 2 攻击 3 回收状态
        this.owner.rigidBody = this.owner.getComponent(Laya.RigidBody);
        this.owner.idleCount = 0;
        // this.owner.lastDirect = 1; //1 向上 2 向下
        this.owner.curDirect = 1;  //1 向上 2向下
    }

    setYSpeed(y) {
        // let speed = this.owner.rigidBody.linearVelocity;
        this.owner.rigidBody.setVelocity({x: 0, y: y});
    }

    onTriggerEnter(other, self, contact) {
        if (!this.owner) {
            return;
        }
        if (self.label == "CiBrickSensor") {
            if (other.label == "RoleBody" || other.label == "RoleHead" || other.label == "RoleFoot") {
                if (this.owner.state == 2) {
                    this.owner.state = 3;
                }
                Utils.hurtRole(this.owner);
            }
        }
    }

    processShouQi() {
        let body = this.owner.rigidBody.getBody();
        let pos = body.GetPosition();
        if (this.owner.curDirect == 1) {
            this.setYSpeed(this.owner.inSpeed);
            if (this.owner.y >= this.owner.startPoint.y) {
                this.owner.state = 1;
                this.setYSpeed(0);
                body.SetPositionXY(pos.x, this.owner.startPoint.y/50);
            }
        } else if (this.owner.curDirect == 2) {
            this.setYSpeed(-this.owner.inSpeed);
            if (this.owner.y <= this.owner.startPoint.y) {
                this.owner.state = 1;
                this.setYSpeed(0);
                body.SetPositionXY(pos.x, this.owner.startPoint.y/50);
            }
        }
    }

    processAttack() {
        let body = this.owner.rigidBody.getBody();
        let pos = body.GetPosition();
        if (this.owner.curDirect == 1) {
            if (this.owner.y <= this.owner.upPoint.y) {
                this.owner.state = 3;
                body.SetPositionXY(pos.x, this.owner.upPoint.y/50);
            }
        } else if (this.owner.curDirect == 2) {
            if (this.owner.y >= this.owner.downPoint.y) {
                this.owner.state = 3;
                body.SetPositionXY(pos.x, this.owner.downPoint.y/50);
            }
        }
    }

    onUpdate() {
        if (this.owner.state == 1) {
            this.owner.idleCount++;
            if (this.owner.idleCount >= this.owner.idleCountMax) {
                this.owner.state = 2;
                this.owner.idleCount = 0;
                if (this.owner.moveType == 1) {
                    this.owner.curDirect = 1;
                    this.setYSpeed(-this.owner.outSpeed);
                } else if (this.owner.moveType == 2) {
                    this.owner.curDirect = 2;
                    this.setYSpeed(this.owner.outSpeed);
                } else if (this.owner.moveType == 3) {
                    if (this.owner.curDirect == 1) {
                        // this.owner.lastDirect = 2;
                        this.owner.curDirect = 2;
                        this.setYSpeed(this.owner.outSpeed);
                    } else if (this.owner.curDirect == 2) {
                        // this.owner.lastDirect = 1;
                        this.owner.curDirect = 1;
                        this.setYSpeed(-this.owner.outSpeed);
                    }
                }
            }
        } else if (this.owner.state == 2) {
            this.processAttack();
        } else if (this.owner.state == 3) {
            this.processShouQi();
        }
    }
    
    onEnable() {
    }

    onDisable() {
    }
}