import Utils from "./Utils";
import GameContext from "../GameContext";
import LoadingLogic from "./LoadingLogic";

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

        this.owner.doorFinalPoint = [];
        if (script.doorFinalStr) {
            this.owner.doorFinalStr = script.doorFinalStr;
            let points = this.owner.doorFinalStr.split("*");
            for (let index = 0; index < points.length; index++) {
                let pointStr = points[index];
                let p = pointStr.split(",");
                this.owner.doorFinalPoint.push({x:Number(p[0]), y: Number(p[1])});
            }
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
        return null;
    }

    getDoorFinalPoint() {
        let pointNum = this.owner.doorFinalPoint.length;
        if (pointNum != 0) {
            let index = Math.ceil(Math.random() * 65535)%pointNum;
            let p = this.owner.doorFinalPoint[index];
            return {x: p.x, y: p.y};
        }
        return null;
    }

    onDisable() {
    }

    onTriggerEnter(other, self, contact) {
        if (!this.owner) {
            return;
        }
        if (this.owner.inDoor == true) {
            return;
        }
        if (other.label == "RoleHead" || other.label == "RoleBody" || other.label == "RoleFoot") {
            this.owner.inDoor = true;
            if (this.owner.goToType == 1) {
                let scene = this.getScene();
                let gotoPoint = this.getSceneGoToPoint();
                let doorFinalPoint = this.getDoorFinalPoint();
                if (GameContext.doorCount > 2) {
                    gotoPoint = doorFinalPoint;
                }
                Utils.triggerToRandomDoor(this.owner, scene, 1, gotoPoint);
            }
        }
    }
    
    onTriggerExit(other, self, contact) {
        if (!this.owner) {
            return;
        }
        if (other.label == "RoleHead" || other.label == "RoleBody" || other.label == "RoleFoot") {
            // this.owner.inDoor = false;
        }
    }

    onUpdate() {
        if (!this.owner) {
            return;
        }
    }
}