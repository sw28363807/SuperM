import Utils from "./Utils";
import GameContext from "../GameContext";

export default class CiBrickLogic extends Laya.Script {

    constructor() { 
        super(); 
        /** @prop {name:downDistance, tips:"下落距离", type:Int, default:0}*/
        let downDistance = 0;
        /** @prop {name:upDistance, tips:"上移距离", type:Int, default:0}*/
        let upDistance = 0;
        /** @prop {name:idleCountMax, tips:"移动休眠间隔count", type:Int, default:0}*/
        let idleCountMax = 0;
        /** @prop {name:customResetX, tips:"自定义重置位置X", type:Int, default:-99999999}*/
        let customResetX = -99999999;
        /** @prop {name:customResetY, tips:"自定义重置位置Y", type:Int, default:-99999999}*/
        let customResetY = -99999999;
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

        if (script.customResetX) {
            this.owner.customResetX = script.customResetX;
        } else {
            this.owner.customResetX = -99999999;
        }

        if (script.customResetY) {
            this.owner.customResetY = script.customResetY;
        } else {
            this.owner.customResetY = -99999999;
        }
        this.owner.startPoint = {x: this.owner.x, y: this.owner.y};
        this.owner.upPoint = {x: this.owner.x, y: this.owner.y - this.owner.upDistance};
        this.owner.downPoint = {x: this.owner.x, y: this.owner.y + this.owner.downDistance};
        this.owner.outSpeed = 23;
        this.owner.inSpeed = 2;
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
        this.owner.state = 1;   //1 休息状态 2 攻击 3 回收状态 4 停留阶段
        this.owner.toState = 0; 
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
                if (GameContext.curCiBrick) {
                    return;
                }
                GameContext.curCiBrick = this.owner;
                let lastRoleBodyState = GameContext.gameRoleBodyState;
                Utils.hurtRole(this.owner);
                let owner = this.owner;
                if (lastRoleBodyState == 1) {
                    Laya.timer.once(500, this, function() {
                        if (GameContext.gameRoleNumber > 0) {
                            Laya.loader.create("prefab/other/BlackBox.prefab", Laya.Handler.create(null, function (prefabDef) {
                                let black = prefabDef.create();
                                Laya.stage.addChild(black);
                                black.x = 0;   
                                black.y = 0;
                                black.zOrder = 9999999;
                                black.alpha = 0;
                                Laya.Tween.to(black,{alpha: 1}, 100, null, Laya.Handler.create(null, function(){
                                    if (owner) {
                                        GameContext.curCiBrick = null;
                                        if (owner.customResetX != -99999999 && owner.customResetY != -99999999) {
                                            GameContext.setRolePosition(owner.customResetX, owner.customResetY);
                                        } else {
                                            GameContext.setRolePosition(owner.x -150, owner.y);
                                        }
                                        Laya.Tween.to(black,{alpha: 0}, 100, null, Laya.Handler.create(null, function(){
                                            black.removeSelf();
                                            black.destroy();
                                        }));
                                    }
                                }));
                            }));
                        }
                    });
                }
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


    processWait() {
        this.owner.idleCount++;
        if (this.owner.idleCount >= 150) {
            this.owner.state = 3;
            this.owner.idleCount = 0;
        }
        this.setYSpeed(0);
    }
    processAttack() {
        let body = this.owner.rigidBody.getBody();
        let pos = body.GetPosition();
        if (this.owner.curDirect == 1) {
            if (this.owner.y <= this.owner.upPoint.y) {
                this.owner.state = 4;
                this.owner.idleCount = 0;
                body.SetPositionXY(pos.x, this.owner.upPoint.y/50);
                this.setYSpeed(0);
            }
        } else if (this.owner.curDirect == 2) {
            if (this.owner.y >= this.owner.downPoint.y) {
                this.owner.state = 4;
                this.owner.idleCount = 0;
                body.SetPositionXY(pos.x, this.owner.downPoint.y/50);
                this.setYSpeed(0);
                Laya.SoundManager.playSound("loading/zadi.mp3");
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
        } else if (this.owner.state == 4) {
            this.processWait();
        }
    }
    
    onEnable() {
    }

    onDisable() {
    }
}