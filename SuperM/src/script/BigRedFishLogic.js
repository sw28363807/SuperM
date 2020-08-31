import Utils from "./Utils";
import GameContext from "../GameContext";

export default class BigRedFishLogic extends Laya.Script {

    constructor() { 
        super();
    }
    
    onEnable() {
    }

    onDisable() {
    }

    onStart() {
        this.owner.rigidBody = this.owner.getComponent(Laya.RigidBody);
        this.owner.renderAni = this.owner.getChildByName("render");
        this.owner.rigidBody.gravityScale = 0;
        this.owner.startPointX = this.owner.x;
        this.owner.startPointY = this.owner.y - this.owner.height/2;
        this.owner.moveSpeedX = 6;
        this.owner.jumpSpeedX = 5;
        this.owner.jumpSpeedY = 30;

        this.owner.state = 1; // 1追击 2跳跃 3 等待模式

        this.owner.idleCount = 0;
        this.owner.idleCountMax = 100;

        // this.owner.attackTickCount = 0;

        // this.owner.lookupTickCountMax = 100;
        // this.owner.attackTickCountMax = 100;

        // let linearVelocity = GameContext.roleRigidBody.linearVelocity;
        // GameContext.roleRigidBody.setVelocity({x: x, y: linearVelocity.y});
    }

    setSpeed(x, y) {
        this.owner.rigidBody.setVelocity({x: x, y: y});
        this.owner.renderAni.scaleX = Utils.getSign(x) * Math.abs(this.owner.renderAni.scaleX);
    }

    setSpeedX(x) {
        let linearVelocity = this.owner.rigidBody.linearVelocity;
        this.setSpeed(x, linearVelocity.y);
    }

    setSpeedY(y) {
        let linearVelocity = this.owner.rigidBody.linearVelocity;
        this.setSpeed(linearVelocity.x, y);
    }

    getDistanceWithRoleX() {
        return Math.abs(this.owner.x - GameContext.role.x);
    }

    getDirectWithRole() {
        return Utils.getDirect(GameContext.role.x,  GameContext.role.y, this.owner.x, this.owner.y);
    }

    jumpToRole() {
        this.owner.rigidBody.gravityScale = 5;
        let direct = this.getDirectWithRole();
        this.owner.renderAni.scaleX = Utils.getSign(direct.x) * Math.abs(this.owner.renderAni.scaleX);
        this.setSpeed(direct.x * this.owner.jumpSpeedX,  direct.y * this.owner.jumpSpeedY);
    }

    setFishPosition(x, y) {
        let body = this.owner.rigidBody.getBody();
        body.SetPositionXY(x/50, y/50);
    }

    setFishPositionY(y) {
        let body = this.owner.rigidBody.getBody();
        body.SetPositionXY(body.GetPosition().x, y/50);
    }

    onUpdate() {
        if (this.owner.state == 1) {
            let distanceWithRole = this.getDistanceWithRoleX();
            let direct = this.getDirectWithRole();
            if (distanceWithRole > 200) {
                let dx = Utils.getSign(direct.x);
                this.setSpeed(dx * this.owner.moveSpeedX, 0);
            } else {
                this.owner.state = 2;
                this.jumpToRole();
            }
        } else if (this.owner.state == 2) {
            let linearVelocity = this.owner.rigidBody.linearVelocity;
            if (this.owner.y >= this.owner.startPointY && linearVelocity.y > 0) {
                this.owner.state = 3;
                this.owner.rigidBody.gravityScale = 0;
                this.setFishPositionY(this.owner.startPointY);
                this.setSpeed(0, 0);
                let direct = this.getDirectWithRole();
                this.owner.renderAni.scaleX = Utils.getSign(direct.x) * Math.abs(this.owner.renderAni.scaleX);
            }
        } else if (this.owner.state == 3) {
            this.owner.idleCount++;
            if (this.owner.idleCount >= this.owner.idleCountMax) {
                this.owner.state = 1;
                this.owner.idleCount = 0;
            }
        }
        Utils.tryRemoveThis(this.owner);
    }
}