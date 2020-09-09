import GameContext from "../GameContext";
import Utils from "./Utils";

export default class CiQiuLogic extends Laya.Script {

    constructor() { 
        super();
    }
    
    onEnable() {
        this.moveSpeed = 9;
        this.jumpSpeed = 35;
    }

    onDisable() {
        Laya.timer.clear(this, this.onTriggerLookupRole);
        Laya.timer.clear(this, this.onTriggerAttackRole);
    }

    onStart() {
        this.owner.state = 1; //1 搜索模式 2 攻击模式 3 等待模式
        this.owner.rigidBody = this.owner.getComponent(Laya.RigidBody);
        this.owner.renderAni = this.owner.getChildByName("render");
        this.owner.rigidBody.gravityScale = 0;

        this.owner.startPoint = {x: this.owner.x, y: this.owner.y};

        Laya.timer.loop(3000, this, this.onTriggerLookupRole);
        Laya.timer.loop(1500, this, this.onTriggerAttackRole);
        this.owner.renderAni.play(0, true, "ani1");
    }

    onTriggerEnter(other, self, contact) {
        // if (other.label == "Hole") {
        //     let colls = self.owner.getComponents(Laya.ColliderBase);
        //     for (let index = 0; index < colls.length; index++) {
        //         let coll = colls[index];
        //         coll.isSensor = true;
        //     }
        // }
        // else if (other.label == "Water") {
        //     let rigidBody = this.owner.getComponent(Laya.RigidBody);
        //     if (rigidBody.label != "Fish" && rigidBody.label != "ShuiMu") {
        //         Utils.createMonsterDropDeadEffect(this.owner);
        //     }
        // }
    }

    onTriggerLookupRole() {
        if (!this.owner) {
            return;
        }
        if (this.owner.state == 1) {
            this.owner.renderAni.play(0, true, "ani1");
            let roleX = GameContext.role.x;
            let x = this.owner.x;
            let direct = Utils.getSign(roleX - x);
            this.owner.rigidBody.setVelocity({x: direct * this.moveSpeed, y: 0});
        }
    }

    onTriggerAttackRole() {
        if (!this.owner) {
            return;
        }
        if (this.owner.state == 1) {
            let roleX = GameContext.role.x;
            let roleY = GameContext.role.y;
            let x = this.owner.x;
            let y = this.owner.y;
            if (Math.abs(roleX - x) < 300) {
                this.owner.state = 2;
                this.owner.rigidBody.gravityScale = 5;
                let direct = Utils.getDirect(roleX, roleY, x, y);
                let jspeed = this.jumpSpeed;
                if (direct.y <  -0.5) {
                    jspeed = this.jumpSpeed * 0.8;
                } else {
                    jspeed = this.jumpSpeed;
                }
                this.owner.rigidBody.setVelocity({x: direct.x * 5, y: direct.y * jspeed});
                this.owner.renderAni.play(0, true, "ani2");
            }
        }
    }

    onUpdate() {
        if (!this.owner) {
            return;
        }
        if (this.owner.state == 1) {
            let linearVelocity = this.owner.rigidBody.linearVelocity;
            this.owner.rigidBody.setVelocity({x: linearVelocity.x, y: 0});
        }
        else if (this.owner.state == 2) {
            let linearVelocity = this.owner.rigidBody.linearVelocity;
            if (linearVelocity.y > 0) {
                if (this.owner.y > this.owner.startPoint.y) {
                    this.owner.rigidBody.gravityScale = 0;
                    this.owner.state = 3;
                    this.owner.rigidBody.getBody().SetPositionXY(this.owner.x/50, this.owner.startPoint.y/50)
                    this.owner.rigidBody.setVelocity({x: 0, y: 0});
                    this.owner.renderAni.play(0, true, "ani1");
                    Laya.timer.once(2000, this, function() {
                        if (!this.owner) {
                            return;
                        }
                        this.owner.state = 1;
                    });
                }
            }
        }
        // Utils.tryRemoveThis(this.owner);
    }
}