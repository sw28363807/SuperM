import GameContext from "../GameContext";

export default class AIFlyMonster extends Laya.Script {

    constructor() { 
        super();
    }
    
    onEnable() {
        this.speed = 2;
    }

    onStart() {
        this.startAI();
    }

    startAI() {
        this.owner.rigidBody = this.owner.getComponent(Laya.RigidBody);
        this.owner.currentVelocity = {x: 0, y: this.speed};
        this.owner.renderMonster = this.owner.getChildByName("render");
    }

    processMove() {
        if (this.owner.currentVelocity) {
            let linearVelocity = this.owner.rigidBody.linearVelocity;
            this.owner.rigidBody.setVelocity({x: linearVelocity.x, y: this.owner.currentVelocity.y});
        }
    }

    onTriggerEnter(other, self, contact) {
        if (other.label == "AITop") {
            this.owner.currentVelocity = {x: 0, y: this.speed};
        } else if (other.label == "AIBottom") {
            this.owner.currentVelocity = {x: 0, y: -this.speed};
        }
    }

    onDisable() {

    }

    onUpdate() {
        this.processMove();
    }
}