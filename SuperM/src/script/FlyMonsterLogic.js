import EventMgr from "./EventMgr";
import Events from "./Events";

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
        if (data.owner != this.owner) {
            return;
        }
        let x = this.owner.x;
        let y = this.owner.y;
        let parent = this.owner.parent;
        console.debug("+++++++++++++++++++++");
        console.debug(this.prefabText);
        // Laya.loader.create(this.prefabText, Laya.Handler.create(this, function (prefabDef) {
        //     let monster = prefabDef.create();
        //     parent.addChild(monster);
        //     monster.x = x;
        //     monster.y = y;
        //     this.owner.removeSelf();
        // }));
    }

    onDisable() {
    }
}