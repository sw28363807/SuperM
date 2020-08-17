import GameContext from "../GameContext";

export default class AIFlyMonster extends Laya.Script {

    constructor() { 
        super();
    }
    
    onEnable() {
        this.owner.isStartAI = false;
        this.speed = 2;
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
            console.debug(this.owner.currentVelocity.x);
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
        if (this.owner.isStartAI == false) {
            if (this.owner && GameContext.role) {
                if (this.owner.x < GameContext.role.x + 1500 && this.owner.x > GameContext.role.x) {
                    this.owner.isStartAI = true;
                    this.startAI();
                    return;
                }
            }
        }
        if (this.owner.isStartAI) {
            this.processMove();
        }
    }
}