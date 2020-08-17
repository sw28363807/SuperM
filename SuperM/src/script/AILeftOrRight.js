import Events from "./Events";
import EventMgr from "./EventMgr";
import GameContext from "../GameContext";

export default class AILeftOrRight extends Laya.Script {

    constructor() { 
        super();
    }
    
    onEnable() {
        this.speed = 2;
    }

    onStopAI(data) {
        if (this.owner != data.owner) {
            return;
        }
        this.owner.currentVelocity = null;
        this.owner.rigidBody.setVelocity({x: 0, y: 0});
    }

    onStart() {
        this.startAI();
    }

    onUpdate() {
        this.processMove();
    }


    startAI() {
        EventMgr.getInstance().registEvent(Events.Monster_Stop_AI, this, this.onStopAI);
        this.owner.rigidBody = this.owner.getComponent(Laya.RigidBody);
        this.owner.currentVelocity = {x: this.speed, y: 0};
        this.owner.renderMonster = this.owner.getChildByName("render");
    }

    processMove() {
        if (this.owner.currentVelocity) {
            let linearVelocity = this.owner.rigidBody.linearVelocity;
            this.owner.rigidBody.setVelocity({x: this.owner.currentVelocity.x, y: linearVelocity.y});
        }
    }

    onTriggerEnter(other, self, contact) {
        if (this.owner.renderMonster) {
            if (other.label == "AILeft") {
                this.owner.currentVelocity = {x: 2, y: 0};
                this.owner.renderMonster.scaleX = Math.abs(this.owner.renderMonster.scaleX);
            } else if (other.label == "AIRight") {
                this.owner.currentVelocity = {x: -2, y: 0};
                this.owner.renderMonster.scaleX = -1 * Math.abs(this.owner.renderMonster.scaleX);
            }
        }
    }

    onDisable() {
    }

    onMonsterFootDead(data) {
        if (data.owner != this.owner) {
            return;
        }
        this.owner.rigidBody.enabled = false;
    }
}