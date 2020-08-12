import Events from "./Events";
import EventMgr from "./EventMgr";
import GameContext from "../GameContext";

export default class AILeftOrRight extends Laya.Script {

    constructor() { 
        super();
        /** @prop {name:time, tips:"巡逻时间", type:Number, default:3000}*/
        this.time = 1000;
        /** @prop {name:speed, tips:"移动速度", type:Number, default:5}*/
        this.speed = 1;
    }
    
    onEnable() {
        let script = this.owner.getComponent(AILeftOrRight);
        if (script.time) {
            this.owner.time = script.time;
        } else {
            this.owner.time = this.time;
        }

        if (script.speed) {
            this.owner.speed = script.speed;
        } else {
            this.owner.speed = this.speed;
        }

        EventMgr.getInstance().registEvent(Events.Monster_Stop_AI, this, this.onStopAI);
        this.owner.rigidBody = this.owner.getComponent(Laya.RigidBody);
        this.owner.faceup = 0;
        this.owner.currentVelocity = null;
        this.owner.renderMonster = this.owner.getChildByName("render");
        Laya.timer.loop(this.owner.time, this, this.onTimeCallback);
    }

    onStopAI(data) {
        if (this.owner != data.owner) {
            return;
        }
        Laya.timer.clear(this, this.onTimeCallback);
        this.owner.currentVelocity = null;
        this.owner.rigidBody.setVelocity({x: 0, y: 0});
    }

    onTimeCallback() {
        if (this.owner.faceup == 0 || this.owner.faceup == 1) {
            this.owner.faceup = 1;
            this.owner.currentVelocity = {x: this.owner.speed, y: 0};
            this.owner.renderMonster.scaleX = Math.abs(this.owner.renderMonster.scaleX);
        } else {
            this.owner.currentVelocity = {x: -this.owner.speed, y: 0};
            this.owner.renderMonster.scaleX = -1 * Math.abs(this.owner.renderMonster.scaleX);
        }
        this.owner.faceup = -1 * this.owner.faceup;
    }

    onUpdate() {
        if (this.owner.currentVelocity) {
            let linearVelocity = this.owner.rigidBody.linearVelocity;
            this.owner.rigidBody.setVelocity({x: this.owner.currentVelocity.x, y: linearVelocity.y});
        }
    }

    onDisable() {
        Laya.timer.clear(this, this.onTimeCallback);
    }

    onMonsterFootDead(data) {
        if (data.owner != this.owner) {
            return;
        }
        this.owner.rigidBody.enabled = false;
        Laya.timer.clear(this, this.onTimeCallback);
    }
}