import GameContext from "../GameContext";
import Utils from "./Utils";

export default class CiQiuLogic extends Laya.Script {

    constructor() { 
        super();
    }
    
    onEnable() {
    }

    onDisable() {
    }

    onStart() {
        this.moveSpeed = 11;
        this.jumpSpeed = 40;
        this.owner.state = 1; //1 搜索模式 2 攻击模式 3 等待模式 4 等待模式 5 露头模式
        this.owner.rigidBody = this.owner.getComponent(Laya.RigidBody);
        this.owner.renderAni = this.owner.getChildByName("render");
        this.owner.rigidBody.gravityScale = 0;
        this.owner.curAni = "";

        this.owner.startPoint = {x: this.owner.x, y: this.owner.y};
        this.owner.renderAni.play(0, true, "ani1");
        this.owner.idleCount = 0;
    }

    onTriggerEnter(other, self, contact) {
    }

    onUpdate() {
        if (!this.owner) {
            return;
        }
        if (this.owner.state == 1) {
            if (this.owner.curAni != "ani1") {
                this.owner.renderAni.play(0, true, "ani1");
                this.owner.curAni = "ani1";
            }
            let roleX = GameContext.role.x;
            let x = this.owner.x;
            this.owner.rigidBody.gravityScale = 0;
            this.owner.rigidBody.getBody().SetPositionXY(x/50, this.owner.startPoint.y/50);
            if (Math.abs(roleX - x) < 500) {
                this.owner.state = 5;
            } else {
                let direct = Utils.getSign(roleX - x);
                this.owner.rigidBody.setVelocity({x: direct * this.moveSpeed, y: 0});
            }
        } else if (this.owner.state == 5) {
            if (this.owner.curAni != "ani3") {
                this.owner.renderAni.play(0, false, "ani3");
                this.owner.curAni = "ani3";
            }
            let x = this.owner.x;
            this.owner.rigidBody.setVelocity({x: 0, y: 0});
            this.owner.rigidBody.getBody().SetPositionXY(x/50, this.owner.startPoint.y/50);
            this.owner.idleCount++;
            if (this.owner.idleCount > 100) {
                this.owner.idleCount = 0;
                this.owner.state = 2;
            }
        } else if (this.owner.state == 2) {
            if (this.owner.curAni != "ani2") {
                this.owner.renderAni.play(0, true, "ani2");
                this.owner.curAni = "ani2";
            }
            let roleX = GameContext.role.x;
            let roleY = GameContext.role.y;
            let x = this.owner.x;
            let y = this.owner.y;
            this.owner.rigidBody.gravityScale = 5;
            let direct = Utils.getDirect(roleX, roleY, x, y);
            let speedY = this.jumpSpeed;
            let speedX = 7;
            if (Math.abs(roleX - x) < 150) {
                speedY = this.jumpSpeed * 0.8;
                speedX = speedX * 0.4;
            }
            else if (Math.abs(roleX - x) < 300) {
                speedY = this.jumpSpeed * 0.9;
                speedX = speedX * 0.6;
            }
            this.owner.rigidBody.setVelocity({x: Utils.getSign(direct.x) * speedX, y:  -speedY});
            this.owner.state = 3;
        } else if (this.owner.state == 3) {
            let x = this.owner.x;
            let y = this.owner.y;
            if (y > this.owner.startPoint.y) {
                this.owner.rigidBody.gravityScale = 0;
                this.owner.rigidBody.setVelocity({x: 0, y: 0});
                this.owner.rigidBody.getBody().SetPositionXY(x/50, this.owner.startPoint.y/50);
                this.owner.louTou = false;
                this.owner.state = 4;
            }
        } else if (this.owner.state == 4) {
            let roleX = GameContext.role.x;
            let x = this.owner.x;
            if (this.owner.curAni != "ani1") {
                this.owner.renderAni.play(0, true, "ani1");
                this.owner.curAni = "ani1";
            }
            this.owner.idleCount++;
            if (this.owner.idleCount > 300 || (Math.abs(roleX - x) > 1000)) {
                this.owner.idleCount = 0;
                this.owner.state = 1;
            }
            Laya.SoundManager.playSound
        }
    }
}