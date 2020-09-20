import GameContext from "../GameContext";
import LoadingLogic from "./LoadingLogic";

export default class Camera extends Laya.Script {

    constructor() { 
        super();
        /** @prop {name:yCenter, tips:"是否居中", type:Number, default:0}*/
        let yCenter = 0;
        /** @prop {name:yCenter, tips:"y轴偏移", type:Number, default:200}*/
        let yOff = 200;
    }

    lookAt(x, y) {
        let curX = 1136/2.3 - x;
        if (!GameContext.isDie && !GameContext.isWin ) {
            this.owner.x = curX;
        }

        if (this.owner.yCenter == 0) {
            if (this.role.y < this.owner.yOff) {
                if (this.curUpOffY < this.upOffY) {
                    this.upSpeed += this.aSpeed;
                    if (this.upSpeed > 10) {
                        this.upSpeed = 10;
                    }
                    this.curUpOffY += this.upSpeed;
                } else {
                    this.curUpOffY = this.upOffY;
                    this.upSpeed = 0;
                }
                this.curDownOffY = -(this.role.y - this.curUpOffY);
                this.owner.y = this.standY - (this.role.y - this.curUpOffY);
            } else {
                if (this.curDownOffY > 0) {
                    this.upSpeed += this.aSpeed;
                    if (this.upSpeed > 10) {
                        this.upSpeed = 10;
                    }
                    this.curDownOffY -= this.upSpeed;
                    if (this.curDownOffY <= 0) {
                        this.curDownOffY = 0;
                        this.upSpeed = 0;
                    }
                }
                this.curUpOffY = this.role.y + this.curDownOffY;
                this.owner.y =  this.standY + this.curDownOffY;
            }
        } else {
            this.owner.y =  750/2 - y;
        }

        
    }

    onUpdate() {
        if (this.role) {
            this.lookAt(this.role.x, this.role.y);
        }
    }

    onStart() {
        GameContext.resetRolePoint = {x: this.role.x, y: this.role.y};
    }
    
    onEnable() {
        let script = this.owner.getComponent(Camera);
        if (script && script.yCenter) {
            this.owner.yCenter = script.yCenter;
        } else {
            this.owner.yCenter = 0;
        }

        if (script && script.yOff) {
            this.owner.yOff = script.yOff;
        } else {
            this.owner.yOff = 200;
        }

        this.curUpOffY = this.owner.yOff;
        this.curDownOffY = 0;
        this.upOffY = 500;
        this.upSpeed = 0;
        this.aSpeed = 0.5;

        this.zeroY = 0;
        this.role =  this.owner.getChildByName("Role");
        GameContext.mapMaxX = this.role.x;
        if (GameContext.initRolePoint && this.owner.name == "gameScene") {
            this.role.x = GameContext.initRolePoint.x;
            this.role.y = GameContext.initRolePoint.y;
        }
        let w =  Laya.Browser.width;
        let h =  Laya.Browser.height;
        Laya.Physics.I.positionIterations = 3;
        Laya.Physics.I.worldRoot = this.owner;
        this.zeroY = this.owner.yOff;
        if(w/h > 2.0) {
            this.zeroY = 160;
        }
        this.standY = 750/2.3 - 660 + this.zeroY;

        GameContext.monsterArea = 3000;
        GameContext.monsterAreaY = 5000;
        if (LoadingLogic.curSceneExt == "scene/Level3_2.scene") {
            GameContext.monsterArea = 2000;
        }
    }

    onDisable() {
    }
}