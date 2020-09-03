import GameContext from "../GameContext";
import Utils from "./Utils";

export default class ShiTou extends Laya.Script {

    constructor() { 
        super();
    }
    
    onEnable() {
    }

    onDisable() {
    }

    onStart() {
        this.owner.rigidBody = this.owner.getComponent(Laya.RigidBody);
        this.owner.state = 1; //1 等待玩家 2 掉落 3 上升 4 休眠
        // this.owner.downSpeed = 3;
        this.owner.upSpeed = -3;
        this.owner.startPoint = {x: this.owner.x, y: this.owner.y};
        this.owner.areaX = 200;
        this.owner.spr1 = this.owner.getChildByName("spr1");
        this.owner.spr2 = this.owner.getChildByName("spr2");
        this.owner.idleCountMax = 100;
        this.owner.idleCount = 0;
    }

    onUpdate() {
        if (this.owner.state == 1) {
            this.owner.idleCount = 0;
            let distance = Math.abs(GameContext.role.x - this.owner.x);
            this.owner.spr1.visible = false;
            this.owner.spr2.visible = true;
            this.owner.rigidBody.setVelocity({x: 0, y: 0});
            this.owner.rigidBody.getBody().SetPositionXY(this.owner.startPoint.x/50, this.owner.startPoint.y/50);
            this.owner.rigidBody.gravityScale = 0;
            if (distance <= this.owner.areaX) {
                this.owner.state = 2;
                this.owner.rigidBody.setVelocity({x: 0, y: 0.0001});
            }
        } else if (this.owner.state == 2) {
            this.owner.rigidBody.gravityScale = 4;
            this.owner.spr1.visible = true;
            this.owner.spr2.visible = false;
        } else if (this.owner.state == 3) {
            if (this.owner.y <= this.owner.startPoint.y) {
                this.owner.state = 4;
                return;
            }
            this.owner.spr1.visible = false;
            this.owner.spr2.visible = true;
            this.owner.rigidBody.gravityScale = 0;
            this.owner.rigidBody.setVelocity({x: 0, y: this.owner.upSpeed});
            let body =  this.owner.rigidBody.getBody();
            body.SetPositionXY(this.owner.startPoint.x/50, body.GetPosition().y);
        } else if (this.owner.state == 4) {
            this.owner.idleCount++;
            if (this.owner.idleCount >= this.owner.idleCountMax) {
                this.owner.idleCount = 0;
                this.owner.state = 1;
                return;
            }
            this.owner.spr1.visible = false;
            this.owner.spr2.visible = true;
            this.owner.rigidBody.setVelocity({x: 0, y: 0});
            this.owner.rigidBody.getBody().SetPositionXY(this.owner.startPoint.x/50, this.owner.startPoint.y/50);
            this.owner.rigidBody.gravityScale = 0;
        }
    }

    onTriggerEnter(other, self, contact) {
        if (!this.owner) {
            return;
        }
        this.owner.state = 3;
        if (other.label == "RoleHead" || other.label == "RoleBody" || other.label == "RoleFoot") {
            Utils.hurtRole(this.owner);
        }
    }
}