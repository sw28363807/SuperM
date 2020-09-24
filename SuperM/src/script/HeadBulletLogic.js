import Utils from "./Utils";
import HanbaoLogic from "./HanbaoLogic";

export default class HeadBulletLogic extends Laya.Script {

    constructor() { 
        super();
    }
    
    onEnable() {
    }

    onDisable() {
    }

    onStart() {
        let owner = this.owner;
        Laya.timer.once(100, null, function() {
            Utils.removeThis(owner);
        });
    }

    onTriggerEnter(other, self, contact) {
        if (other.label == "MonsterBody") {
            if (other && other.owner) {
                Utils.createFen(other.owner);
                Utils.createMonsterDropDeadEffect(other.owner);
            }
        }
    }
}