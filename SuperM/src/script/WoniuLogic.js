export default class WoniuLogic extends Laya.Script {

    constructor() { 
        super();
        this.monsterCount = 2;
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
        if (this.monsterCount) {
            
        }
        // this.owner.removeSelf();
    }

    onMonsterBulletDead(data) {
        if (data.owner != this.owner) {
            return;
        }
        // this.owner.removeSelf();
    }
}