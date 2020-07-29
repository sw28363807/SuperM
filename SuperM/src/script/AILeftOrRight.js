import Events from "./Events";
import EventMgr from "./EventMgr";

export default class AILeftOrRight extends Laya.Script {

    constructor() { 
        super();
        /** @prop {name:time, tips:"巡逻时间", type:Number, default:3000}*/
        this.time = 3000;
        /** @prop {name:area, tips:"巡逻范围", type:Number, default:200}*/
        this.area = 200;
        /** @prop {name:speed, tips:"移动速度", type:Number, default:5}*/
        this.speed = 5;

        this.faceup = 0;
        this.currentVelocity = null;
    }
    
    onEnable() {
        // EventMgr.getInstance().registEvent(Events.Monster_Foot_Dead, this, this.onMonsterFootDead);

        this.rigidBody = this.owner.getComponent(Laya.RigidBody);
        this.ani = this.owner.getChildByName("ani");
        Laya.timer.loop(this.time, this, this.onTimeCallback);
    }

    onTimeCallback() {
        if (this.faceup == 0 || this.faceup == 1) {
            this.faceup = 1;
            this.currentVelocity = {x: this.speed, y: 0};
            this.ani.scaleX = Math.abs(this.ani.scaleX);
        } else {
            this.currentVelocity = {x: -this.speed, y: 0};
            this.ani.scaleX = -1 * Math.abs(this.ani.scaleX);
        }
        this.faceup = -1 * this.faceup;
    }

    onUpdate() {
        if (this.currentVelocity) {
            let linearVelocity = this.rigidBody.linearVelocity;
            this.rigidBody.setVelocity({x: this.currentVelocity.x, y: linearVelocity.y});
        }
    }

    onDisable() {
        Laya.timer.clear(this, this.onTimeCallback);
    }

    onMonsterFootDead(data) {
        if (data.owner != this.owner) {
            return;
        }
        this.rigidBody.enabled = false;
        Laya.timer.clear(this, this.onTimeCallback);
    }
}