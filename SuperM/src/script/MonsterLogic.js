import EventMgr from "./EventMgr";
import Events from "./Events";

export default class MonsterLogic extends Laya.Script {

    constructor() { 
        super();
    }
    
    onEnable() {
        EventMgr.getInstance().registEvent(Events.Monster_Foot_Dead, this, this.onMonsterFootDead);
        EventMgr.getInstance().registEvent(Events.Monster_Bullet_Dead, this, this.onMonsterBulletDead);
    }

    onDisable() {
    }

    onMonsterFootDead(data) {
        if (data.owner != this.owner) {
            return;
        }
        this.owner.removeSelf();
    }

    onMonsterBulletDead(data) {
        if (data.owner != this.owner) {
            return;
        }
        this.owner.removeSelf();
    }
}