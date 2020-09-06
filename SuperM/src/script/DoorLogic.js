import Utils from "./Utils";
import GameContext from "../GameContext";

export default class DoorLogic extends Laya.Script {

    constructor() { 
        super();
        /** @prop {name:goToType, tips:"跳转类型 1 跳转场景 2 场景内跳转", type:Int, default:1}*/
        let goToType = 1;
        /** @prop {name:sceneStr, tips:"跳转场景字符串", type:String, default:""}*/
        let sceneStr = "";
        /** @prop {name:doorInitPointStr, tips:"跳转场景的初始化坐标", type:String, default:""}*/
        let doorInitPointStr = "";
        /** @prop {name:doorFinalStr, tips:"最终的结束跳转的场景坐标", type:String, default:""}*/
        let doorFinalStr = "";
    }
    
    onEnable() {

    }

    onStart() {
        let script =  this.owner.getComponent(DoorLogic);
        if (script.goToType) {
            this.owner.goToType = script.goToType;
        } else {
            this.owner.goToType = 1;
        }

        this.owner.sceneArr = [];
        if (script.sceneStr) {
            this.owner.sceneStr = script.sceneStr;
            this.owner.sceneArr = this.owner.sceneStr.split(",");
        } else {
            this.owner.sceneStr = "";
        }

        this.owner.doorInitPoint = [];
        if (script.doorInitPointStr) {
            this.owner.doorInitPointStr = script.doorInitPointStr;
            let points = this.owner.doorInitPointStr.split("*");
            for (let index = 0; index < points.length; index++) {
                let pointStr = points[index];
                let p = pointStr.split(",");
                this.owner.doorInitPoint.push({x:Number(p[0]), y: Number(p[1])});
            }

        } else {
            this.owner.doorInitPointStr = "";
        }

        this.owner.doorFinalPoint = null;
        if (script.doorFinalStr) {
            this.owner.doorFinalStr = script.doorFinalStr;
            let point = this.owner.doorFinalStr.split(",");
            this.owner.doorFinalPoint = {x: Number(point[0]), y: Number(point[1])};
        } else {
            this.owner.doorFinalStr = "";
        }
        
        this.owner.inDoor = false;
        this.owner.enterCount = 0;
    }

    getScene() {
        let sceneNum = this.owner.sceneArr.length;
        if (sceneNum != 0) {
            let index = Math.ceil(Math.random() * 65535)%sceneNum;
            return this.owner.sceneArr[index];
        }
        return "";
    }

    getSceneGoToPoint() {
        let pointNum = this.owner.doorInitPoint.length;
        if (pointNum != 0) {
            let index = Math.ceil(Math.random() * 65535)%pointNum;
            let p = this.owner.doorInitPoint[index];
            return {x: p.x, y: p.y};
        }
        return "";
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
            if (this.owner.goToType == 1) {
                let scene = this.getScene();
                let gotoPoint = this.getSceneGoToPoint();
                if (GameContext.doorCount > 8) {
                    gotoPoint = this.owner.doorFinalPoint;
                }
                Utils.triggerToRandomDoor(this.owner, scene, 1, gotoPoint);
            }
        }
    }
}