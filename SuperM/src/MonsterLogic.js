import EventMgr from "./script/EventMgr";
import Events from "./script/Events";
import AILeftOrRight from "./script/AILeftOrRight";

export default class MonsterLogic extends Laya.Script {

    constructor() { 
        super();
    }
    
    onEnable() {
        EventMgr.getInstance().registEvent(Events.Monster_Foot_Dead, this, this.onMonsterFootDead);
    }

    onDisable() {
    }

    onMonsterFootDead(data) {
        if (data.owner != this.owner) {
            return;
        }
        this.owner.removeSelf();
    }
}