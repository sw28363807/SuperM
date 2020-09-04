import Utils from "./Utils";

export default class HuoQiuLogic extends Laya.Script {

    constructor() { 
        super(); 
        /** @prop {name:upSpeed, tips:"上升速度", type:Int, default:-10}*/
        let upSpeed = -10;
    }
    
    onEnable() {
    }

    onDisable() {
    }

    onStart() {
        let script =  this.owner.getComponent(HuoQiuLogic);
        if (script.upSpeed) {
            this.owner.upSpeed = script.upSpeed;
        } else {
            this.owner.upSpeed = -20;
        }
        this.owner.startPoint = {x: this.owner.x, y: this.owner.y};
        this.owner.rigidBody = this.owner.getComponent(Laya.RigidBody);
        this.owner.state = 1;   //1 等待模式 2 上升模式
        this.owner.tickCout = 0;
        this.owner.tickCoutMax = 100;
    }

    onUpdate() {
        if (this.owner.state == 1) {
            this.owner.tickCout++;
            let body = this.owner.rigidBody.getBody();
            body.SetPositionXY(this.owner.startPoint.x/50, this.owner.startPoint.y/50);
            this.owner.rigidBody.setVelocity({x: 0, y: 0});
            this.owner.rigidBody.gravityScale = 0;
            if (this.owner.tickCout >= this.owner.tickCoutMax) {
                this.owner.tickCout = 0;
                this.owner.state = 2;
                this.owner.rigidBody.setVelocity({x: 0, y: this.owner.upSpeed});
            }
        } else if (this.owner.state = 2) {
            let body = this.owner.rigidBody.getBody();
            body.SetPositionXY(this.owner.startPoint.x/50, body.GetPosition().y);
            this.owner.rigidBody.gravityScale = 5;
            let linearVelocity = this.owner.rigidBody.linearVelocity;
            this.owner.rigidBody.setVelocity({x: 0, y: linearVelocity.y});
            if (linearVelocity.y > 0 && this.owner.y >= this.owner.startPoint.y) {
                this.owner.state = 1;
            }
        }
    }

    onTriggerEnter(other, self, contact) {
        if (!this.owner) {
            return;
        }
        if (other.label == "RoleHead" || other.label == "RoleBody" || other.label == "RoleFoot") {
            Utils.hurtRole(this.owner);
        }
    }
}