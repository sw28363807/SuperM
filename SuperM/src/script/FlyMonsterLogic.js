import EventMgr from "./EventMgr";
import Events from "./Events";
import Utils from "./Utils";

export default class FlyMonsterLogic extends Laya.Script {

    constructor() { 
        super();
    }
    
    onEnable() {
        let createPrefab = this.owner.getChildByName("createPrefab");
        if (createPrefab) {
            this.prefabText = createPrefab.text;
        }
        EventMgr.getInstance().registEvent(Events.Monster_Foot_Dead, this, this.onCreateGroundMonster);
        EventMgr.getInstance().registEvent(Events.Monster_Bullet_Dead, this, this.onCreateGroundMonster);
        EventMgr.getInstance().registEvent(Events.Monster_KeBullet_Dead, this, this.onCreateGroundMonster);
    }

    onCreateGroundMonster(data) {
        if (!this) {
            return;
        }
        if (!this.owner) {
            return;
        }
        if (!data) {
            return;
        }
        if (!data.owner) {
            return;
        }
        if (data.owner != this.owner) {
            return;
        }
        let x = this.owner.x;
        let y = this.owner.y;
        let parent = this.owner.parent;
        if (parent) {
            Laya.loader.create(this.prefabText, Laya.Handler.create(this, function (prefabDef) {
                let monster = prefabDef.create();
                if (monster) {
                    parent.addChild(monster);
                    monster.x = x;
                    monster.y = y + 100;
                    if (this.owner) {
                        Utils.removeThis(this.owner);
                    }
                }
            }));
        }

    }

    onDisable() {
    }
}