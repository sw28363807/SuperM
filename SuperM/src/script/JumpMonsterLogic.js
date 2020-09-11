import Utils from "./Utils";

export default class JumpMonsterLogic extends Laya.Script {

    constructor() { 
        super();
    }
    
    onEnable() {
    }

    onDisable() {
        Laya.timer.clear(this, this.jump);
    }

    onStart() {
        this.owner.startPoint = {x: this.owner.x, y: this.owner.y};
        this.owner.rigidBody = this.owner.getComponent(Laya.RigidBody);
        this.owner.state = 1;   //1 待机模式 2 跳跃模式
        this.owner.jumpSpeed = -20;
        this.owner.renderAni = this.owner.getChildByName("render");
        this.owner.renderAni.play(0, true, "ani1");
        Laya.timer.loop(3000, this, this.jump);
    }

    jump() {
        if (this.owner.state == 1) {
            this.owner.state = 2;
            this.owner.rigidBody.gravityScale = 5;
            this.owner.renderAni.play(0, false, "ani2");
            this.owner.rigidBody.setVelocity({x: 0, y: this.owner.jumpSpeed});
        }
    }

    onUpdate() {
        let p = this.owner.rigidBody.getBody().GetPosition();
        this.owner.rigidBody.getBody().SetPositionXY(this.owner.startPoint.x/50, p.y);
        let speed = this.owner.rigidBody.linearVelocity;
        this.owner.rigidBody.setVelocity({x: 0, y: speed.y});

        if (this.owner.state == 1) {
            this.owner.rigidBody.setVelocity({x: 0, y: 0});
            this.owner.rigidBody.gravityScale = 0;
            this.owner.rigidBody.getBody().SetPositionXY(this.owner.startPoint.x/50, this.owner.startPoint.y/50);
        } else if (this.owner.state == 2) {
            let speed = this.owner.rigidBody.linearVelocity;
            if ((this.owner.y >= this.owner.startPoint.y || Math.abs(this.owner.y - this.owner.startPoint.y) <= 6) && speed.y >= 0) {
                this.owner.state = 1;
                this.owner.renderAni.play(0, false, "ani1");
            }
        }
        Utils.tryRemoveThis(this.owner);
    }
}