import GameContext from "../GameContext";
import Utils from "./Utils";
import EventMgr from "./EventMgr";
import Events from "./Events";

export default class MoveBrickLogic extends Laya.Script {

    constructor() { 
        super(); 
        /** @prop {name:moveType, tips:"1 固定移动 2 路径移动 3 AI碰撞转向", type:Int, default:1}*/
        let moveType = 1;
        /** @prop {name:moveTime, tips:"移动时间", type:Int, default:2000}*/
        let moveTime = 2000;
        /** @prop {name:moveDirect, tips:"1 横向 2 纵向", type:Int, default:1}*/
        let moveDirect = 1;
        /** @prop {name:moveSpeed, tips:"移动速度", type:Int, default:3}*/
        let moveSpeed = 3;
        /** @prop {name:movePoints, tips:"移动路径", type:String, default:""}*/
        let movePoints = "";
        /** @prop {name:moveStartType, tips:"移动开始类型 1 站上去开始 2 随时开始", type:Int, default:1}*/
        let moveStartType = 1;
        /** @prop {name:moveDropType, tips:"移动掉落类型 1 不掉落 2 掉落", type:Int, default:1}*/
        let moveDropType = 1;
    }

    onEnable() {
    }

    onStart() {
        EventMgr.getInstance().registEvent(Events.Role_GoTo_Hole_Or_Water_Dead, this, this.onRoleGoToWaterDead);
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
            this.owner.moveSpeed = 3;
        }

        if (script.movePoints) {
            this.owner.movePoints = script.movePoints;
        } else {
            this.owner.movePoints = "";
        }

        
        if (script.moveStartType) {
            this.owner.moveStartType = script.moveStartType;
        } else {
            this.owner.moveStartType = 1;
        }

        if (script.moveDropType) {
            this.owner.moveDropType = script.moveDropType;
        } else {
            this.owner.moveDropType = 1;
        }

        this.owner.rigidBody = this.owner.getComponent(Laya.RigidBody);
        this.owner.renderBrick = this.owner.getChildByName("render");
        this.owner.direct = {x: 0, y: 0};
        this.owner.isStart = false;
        let colls = this.owner.getComponents(Laya.ColliderBase);
        for (let index = 0; index < colls.length; index++) {
            let coll = colls[index];
            if (coll.label == "MoveBrickArea") {
                this.owner.moveBrickArea = coll;
                break;
            }
        }

        this.owner.movePointsIndex = 0;
        this.owner.nextMovePointsIndex = 0;
        this.owner.movePointsState = 1; // 1 正向 2反向
        this.owner.pointsArray = [];
        this.processPoints();
        if (this.owner.moveStartType == 2) {
            this.processNextMovePoints();
            this.moveBoard();
            this.owner.isStart = true;
        }
        // this.owner.startPoint = {x: this.owner.x, y: this.owner.y};
    }

    resetMoveBrick() {
        this.owner.isStart = false;
        this.setIsSensor(true);
        this.owner.rigidBody.setVelocity({x: 0, y: 10});
        this.owner.movePointsIndex = 0;
        this.owner.nextMovePointsIndex = 0;
        Laya.timer.once(2000, this, function() {
            if (!this.owner) {
                return;
            }
            this.setIsSensor(false);
            let zeroPoint = this.owner.pointsArray[0];
            this.owner.direct = {x: 0, y: 0};
            this.owner.rigidBody.setVelocity({x: 0, y: 0});
            this.owner.rigidBody.getBody().SetPositionXY(zeroPoint.x/50, zeroPoint.y/50);
        });
    }

    setIsSensor(enabled) {
        this.owner.moveBrickArea.isSensor = enabled;
    }

    processPoints() {
        let str = this.owner.movePoints;
        let arr = str.split("*");
        for (let index = 0; index < arr.length; index++) {
            let a = arr[index];
            let b =  a.split(",");
            let x = Number(b[0]);
            let y = Number(b[1]);
            this.owner.pointsArray.push({x: x, y: y});
        }
    }

    processNextMovePoints() {
        let curPintIndex = this.owner.movePointsIndex;
        if (this.owner.movePointsState == 1) { 
            curPintIndex++;
            if (curPintIndex == this.owner.pointsArray.length) {
                curPintIndex = curPintIndex - 2;
                this.owner.movePointsState = 2;
            }
        } else if (this.owner.movePointsState == 2) {
            curPintIndex--;
            if (curPintIndex < 0) {
                curPintIndex = 1;
                this.owner.movePointsState = 1;
            }
        }
        this.owner.nextMovePointsIndex = curPintIndex;
    }

    moveBoard() {
        // let curPoint = this.owner.pointsArray[this.owner.movePointsIndex];
        // this.owner.rigidBody.getBody().SetPositionXY(curPoint.x/50, curPoint.y/50);
        this.processMoveSpeed();
    }

    processMoveSpeed() {
        let x = this.owner.x;
        let y = this.owner.y;
        let nextPoint = this.owner.pointsArray[this.owner.nextMovePointsIndex];
        this.owner.direct = Utils.getDirect(nextPoint.x, nextPoint.y, x, y);
        this.owner.rigidBody.setVelocity({x: this.owner.direct.x * this.owner.moveSpeed,
             y: this.owner.direct.y * this.owner.moveSpeed});
    }

    processReach() {
        if (this.owner.moveType == 2) {
            if (this.owner.isStart == false) {
                return;
            }
            // this.processMoveSpeed();
            // let curPoint = this.owner.pointsArray[this.owner.movePointsIndex];
            let nextPoint = this.owner.pointsArray[this.owner.nextMovePointsIndex];
            let delX = nextPoint.x - this.owner.x;
            let delY = nextPoint.y - this.owner.y;
            if (Utils.getSign(delX) != Utils.getSign(this.owner.direct.x) ||
                Utils.getSign(delY) != Utils.getSign(this.owner.direct.y)) {
                this.owner.movePointsIndex = this.owner.nextMovePointsIndex;
                if (this.owner.moveDropType == 2) {
                    if (this.owner.movePointsIndex == this.owner.pointsArray.length - 1) {
                        this.resetMoveBrick();
                        return;
                    }
                }
                this.processNextMovePoints();
                this.moveBoard();
            }
        }
    }

    startMove() {
        if (this.owner.moveType == 1) {
            Laya.timer.loop(this.owner.moveTime, this, this.onSwitchDirect);
        } else if (this.owner.moveType == 2) {
            this.setIsSensor(false);
            this.processNextMovePoints();
            this.moveBoard();
        } else if (this.owner.moveType == 3) {
            this.owner.rigidBody.setVelocity({x: this.owner.direct.x * this.owner.moveSpeed, y: 0});
            this.refreshSpeed();
        }
    }

    onSwitchDirect() {
        if (this.owner.moveDirect == 1 || this.owner.moveDirect == 3) {
            this.owner.direct.x = -this.owner.direct.x;
            this.owner.rigidBody.setVelocity({x: this.owner.direct.x * this.owner.moveSpeed, y: 0});
            this.refreshSpeed();
        }
    }

    onTriggerEnter(other, self, contact) {
        if (other.label == "RoleFoot" && self.label == "MoveBrickStartArea" && this.owner.isStart == false) {
            if (this.owner.moveStartType == 1) {
                this.owner.isStart = true;
                this.startMove();
            }
        } else if (other.label == "RoleFoot") {
            GameContext.roleInMoveGround = true;
            GameContext.roleInMoveGroundObject = this.owner;
            this.refreshSpeed();
        } else if (other.label == "AILeft") {
            if (this.owner.direct.x == -1) {
                this.onSwitchDirect();
            }
        } else if (other.label == "AIRight") {
            if (this.owner.direct.x == 1) {
                this.onSwitchDirect();
            }
        }
    }

    onTriggerExit(other, self, contact) {
        if (other.label == "RoleFoot") {
            GameContext.roleInMoveGroundObject = null;
            GameContext.roleInMoveGround = false;
        }
    }

    refreshSpeed() {
        if (GameContext.roleInMoveGround && GameContext.roleInMoveGroundObject == this.owner) {
            if (this.owner.moveDirect == 1) {
                if (GameContext.commandWalk == false) {
                    let lineSpeed =  GameContext.getLineSpeed();
                    let lineSpeed2 = this.owner.rigidBody.linearVelocity;
                    GameContext.setRoleSpeed(lineSpeed2.x, lineSpeed.y);
                }
            } else if (this.owner.moveDirect == 2) {
                GameContext.roleOutSpeed = {x: 0, y: this.owner.direct.y * this.owner.moveSpeed};
            }
        }
    }

    onUpdate() {
        this.refreshSpeed();
        this.processReach();

    }
    
    onDisable() {
        EventMgr.getInstance().removeEvent(Events.Role_GoTo_Hole_Or_Water_Dead, this, this.onRoleGoToWaterDead);
        Laya.timer.clear(this, this.onSwitchDirect);
    }

    onRoleGoToWaterDead() {
        if (this.owner.moveDropType == 2) {
            this.resetMoveBrick();   
        }
    }
}