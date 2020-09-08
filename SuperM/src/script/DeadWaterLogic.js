import GameContext from "../GameContext";
import EventMgr from "./EventMgr";
import Events from "./Events";

export default class DeadWaterLogic extends Laya.Script {

    constructor() { 
        super();
        /** @prop {name:resetPosX, tips:"重置位置X", type:Int, default:0}*/
        let resetPosX = 0;
        /** @prop {name:upHeight, tips:"上浮位置", type:Int, default:0}*/
        let upHeight = 0;
    }
    
    onEnable() {
    }

    onDisable() {
        GameContext.DeadWaterY = 0;
    }

    onStart() {
        let script =  this.owner.getComponent(DeadWaterLogic);
        if (script.resetPosX) {
            this.owner.resetPosX = script.resetPosX;
        } else {
            this.owner.resetPosX = 0;
        }

        if (script.upHeight) {
            this.owner.upHeight = script.upHeight;
        } else {
            this.owner.upHeight = 0;
        }

        this.owner.state = 1; //1 退潮 2 退->涨 3 涨潮 4 涨->退
        this.owner.tickCount = 0;
        this.owner.downPosY = this.owner.y;
        this.owner.upPosY = this.owner.y - this.owner.upHeight;
        this.owner.upSpeed = -0.5;
        this.owner.rigidBody = this.owner.getComponent(Laya.RigidBody);
    }

    onUpdate() {
        if (this.owner.upHeight != 0 &&
             this.owner.upHeight != null &&
              this.owner.upHeight != undefined) {
                if (this.owner.state == 1) {
                    this.owner.tickCount++;
                    if (this.owner.tickCount >= 500) {
                        this.owner.tickCount = 0;
                        this.owner.state = 2;
                    }
                } else if (this.owner.state == 2) {
                    this.owner.tickCount++;
                    this.owner.rigidBody.setVelocity({x: 0, y: this.owner.upSpeed});
                    if (this.owner.y <= this.owner.upPosY) {
                        let body = this.owner.rigidBody.getBody();
                        let p = body.GetPosition();
                        body.SetPositionXY(p.x, this.owner.upPosY/50);
                        this.owner.rigidBody.setVelocity({x: 0, y: 0});
                        this.owner.state = 3;
                        this.owner.tickCount = 0;
                    }
                } else if (this.owner.state == 3) {
                    this.owner.tickCount++;
                    if (this.owner.tickCount >= 500) {
                        this.owner.state = 4;
                        this.owner.tickCount = 0;
                    }
                } else if (this.owner.state == 4) {
                    this.owner.tickCount++;
                    this.owner.rigidBody.setVelocity({x: 0, y: -this.owner.upSpeed});
                    if (this.owner.y >= this.owner.downPosY) {
                        let body = this.owner.rigidBody.getBody();
                        let p = body.GetPosition();
                        body.SetPositionXY(p.x, this.owner.downPosY/50);
                        this.owner.rigidBody.setVelocity({x: 0, y: 0});
                        this.owner.state = 1;
                        this.owner.tickCount = 0;
                    }
                }
                GameContext.DeadWaterY = this.owner.y - this.owner.downPosY;
                if (Math.abs(GameContext.DeadWaterY) < 0.000001) {
                    GameContext.DeadWaterY = 0;
                }
        }
    }

    onTriggerEnter(other, self, contact) {
        if (self.label == "DeadWater") {
            if (other.label == "RoleHead" || other.label == "RoleFoot" || other.label == "RoleBody" ) {
                GameContext.triggerGotoHole(this.owner, 100, this.owner.resetPosX);
            }
        }
    }

}