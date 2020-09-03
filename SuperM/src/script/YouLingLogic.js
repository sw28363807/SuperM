import Utils from "./Utils";
import GameContext from "../GameContext";

export default class YouLingLogic extends Laya.Script {

    constructor() { 
        super();
    }

    onEnable() {
    }

    onDisable() {
    }

    onStart() {
        this.owner.startPoint = {x: this.owner.x, y: this.owner.y};
        this.owner.state = 1;      //1 待机模式 2 追逐模式 3 回归模式
        this.owner.curAni = "";
        this.owner.renderAni = this.owner.getChildByName("render");
        this.owner.rigidBody = this.owner.getComponent(Laya.RigidBody);
        this.owner.maxAreaX = 800;
        this.owner.lookupAreaX = 400;
        this.owner.speedX = 1;
    }

    onUpdate() {
        if (!this.owner) {
            return;
        }

        if (this.owner.state == 1) {
            let distance = Math.abs(GameContext.role.x - this.owner.startPoint.x);
            if (distance <= this.owner.lookupAreaX) {
                this.owner.state = 2;
                if (this.owner.curAni != "ani1") {
                    this.owner.curAni = "ani1"
                    this.owner.renderAni.play(0, true, "ani1");
                }
                this.owner.rigidBody.setVelocity({x: 0, y: 0});
                this.owner.rigidBody.getBody().SetPositionXY(this.owner.startPoint.x/50, this.owner.startPoint.y/50);
            }
        } else if (this.owner.state == 2) {
            let faceup = Utils.getSign(GameContext.roleSpr.scaleX);
            let faceup2 = Utils.getSign(this.owner.x - GameContext.role.x);
            if (faceup != faceup2) {
                if (this.owner.curAni != "ani2") {
                    this.owner.curAni = "ani2"
                    this.owner.renderAni.play(0, true, "ani2");
                }
                let faceup = Utils.getSign(GameContext.role.x - this.owner.x)
                this.owner.rigidBody.setVelocity({x: faceup * this.owner.speedX, y: 0});
                this.owner.renderAni.scaleX = faceup * Math.abs(this.owner.renderAni.scaleX);
            } else {
                if (this.owner.curAni != "ani1") {
                    this.owner.curAni = "ani1";
                    this.owner.renderAni.play(0, true, "ani1");
                }
                this.owner.rigidBody.setVelocity({x: 0, y: 0});
            }
            let distance = Math.abs(this.owner.x - this.owner.startPoint.x);
            if (distance >= this.owner.maxAreaX) {
                this.owner.state = 1;
            }
        }
        Utils.tryRemoveThis(this.owner);
    }

    onTriggerEnter(other, self, contact) {
        if (!this.owner) {
            return;
        }
        // if (other.label == "RoleFoot") {
        //     this.owner.aniRender.play(0, true , "ani2");
        //     Laya.timer.once(500,  this, this.onDisBrick);
        // }
    }
}