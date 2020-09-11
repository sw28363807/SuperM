import Events from "./Events";
import EventMgr from "./EventMgr";
import GameContext from "../GameContext";
import Utils from "./Utils";

export default class AILeftOrRight extends Laya.Script {

    constructor() { 
        super();
    }
    
    onEnable() {
        this.speed = 2 + Math.random()* 0.2;
    }

    onStart() {
        this.startAI();
    }

    onUpdate() {
        this.processMove();
    }


    startAI() {
        this.owner.rigidBody = this.owner.getComponent(Laya.RigidBody);
        let a = Utils.randomSign();
        this.owner.currentVelocity = {x:  a * this.speed, y: 0};
        this.owner.renderMonster = this.owner.getChildByName("render");
        this.owner.renderMonster.scaleX = a * Math.abs(this.owner.renderMonster.scaleX);
    }

    processMove() {
        if (this.owner.currentVelocity) {
            let linearVelocity = this.owner.rigidBody.linearVelocity;
            this.owner.rigidBody.setVelocity({x: this.owner.currentVelocity.x, y: linearVelocity.y});
        }
    }

    onTriggerEnter(other, self, contact) {
        if (this.owner.renderMonster) {
            if (other.label == "MonsterBody" || other.label == "MonsterFoot") {
                let dx =  Utils.getSign(this.owner.x - other.owner.x);
                this.owner.currentVelocity = {x: dx * Math.abs(this.owner.currentVelocity.x), y: 0};
                this.owner.renderMonster.scaleX = Utils.getSign(this.owner.currentVelocity.x) * Math.abs(this.owner.renderMonster.scaleX); 
            } else if (other.label == "AILeft") {
                this.owner.currentVelocity = {x: this.speed, y: 0};
                this.owner.renderMonster.scaleX = Math.abs(this.owner.renderMonster.scaleX);
            } else if (other.label == "AIRight") {
                this.owner.currentVelocity = {x: -this.speed, y: 0};
                this.owner.renderMonster.scaleX = -1 * Math.abs(this.owner.renderMonster.scaleX);
            } else if (other.label == "RoleBody" || other.label == "RoleHead" || other.label == "RoleFoot") {
                let dx = Utils.getSign(this.owner.x - GameContext.role.x);
                this.owner.currentVelocity = {x: dx * Math.abs(this.owner.currentVelocity.x), y: 0};
                this.owner.renderMonster.scaleX = Utils.getSign(this.owner.currentVelocity.x) * Math.abs(this.owner.renderMonster.scaleX);
            }
        }
    }

    onDisable() {
    }
}