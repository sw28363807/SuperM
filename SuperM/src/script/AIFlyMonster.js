import GameContext from "../GameContext";
import Utils from "./Utils";

export default class AIFlyMonster extends Laya.Script {

    constructor() { 
        super();
    }
    
    onEnable() {
        this.owner.isStartAI = false;
    }

    startAI() {
        this.owner.directY = 1;
        this.owner.renderMonster = this.owner.getChildByName("render");
        this.owner.renderMonster.scaleX = -1 * Math.abs(this.owner.renderMonster.scaleX);
        this.owner.rigidBody = this.owner.getComponent(Laya.RigidBody);
        Laya.timer.loop(1000, this, this.onMakeIdea);
    }

    onDisable() {

    }

    onMakeIdea() {
        if (this.owner.isStartAI == true) {
            this.owner.directY = -1 * this.owner.directY;
        }
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
        if (this.owner.isStartAI == true) {
            let v = {x: 0, y: this.owner.directY};
            this.owner.rigidBody.setVelocity(v);
        }

    }
}