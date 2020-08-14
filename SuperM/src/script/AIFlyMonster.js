import GameContext from "../GameContext";
import Utils from "./Utils";

export default class AIFlyMonster extends Laya.Script {

    constructor() { 
        super();
    }
    
    onEnable() {
        this.owner.directY = 1;
        this.owner.rigidBody = this.owner.getComponent(Laya.RigidBody);
        Laya.timer.loop(1000, this, this.onMakeIdea);
    }

    onDisable() {

    }

    onMakeIdea() {
        this.owner.directY = -1 * this.owner.directY;
    }

    onUpdate() {
        let v = {x: 0, y: this.owner.directY};
        this.owner.rigidBody.setVelocity(v);
    }
}