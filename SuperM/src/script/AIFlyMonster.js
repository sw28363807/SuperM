import GameContext from "../GameContext";
import Utils from "./Utils";

export default class AIFlyMonster extends Laya.Script {

    constructor() { 
        super();
        this.state = 0; // 0 随机 1 追逐
        this.direct = null;
    }
    
    onEnable() {
       this.rigidBody = this.owner.getComponent(Laya.RigidBody);
       this.startPoint = new Laya.Point(this.owner.x, this.owner.y);
       Laya.timer.loop(2000, this, this.onMakeIdea);
    }

    onDisable() {

    }

    onMakeIdea() {
        if (this.startPoint.distance(this.owner.x, this.owner.y) > 300) {
            this.direct = Utils.getDirect(this.startPoint.x, this.startPoint.y,
                 this.owner.x, this.owner.y);
            this.state = 0;
            return;
        }
        if (this.state == 0) {
            this.state = 1;
            this.direct = Utils.randomDirect();
        } else if (this.state == 1) {
            this.state = 0;
            if (GameContext.role) {
                let d = Utils.getDistance(GameContext.role.x, GameContext.role.y, this.owner.x, this.owner.y);
                if (d < 500) {
                    this.direct = Utils.getDirect(GameContext.role.x, GameContext.role.y, this.owner.x, this.owner.y);
                }
            }
        }
    }

    onUpdate() {
        let speed = 0;
        if (this.state == 0) {
            speed = 1;
        } else if (this.state == 1) {
            speed = 2;
        }
        if (this.direct) {
            let v = {x: this.direct.x * speed, y: this.direct.y * speed};
            this.rigidBody.setVelocity(v);
        }
    }
}