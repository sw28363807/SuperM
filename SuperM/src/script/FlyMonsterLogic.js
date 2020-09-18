import EventMgr from "./EventMgr";
import Events from "./Events";
import Utils from "./Utils";

export default class FlyMonsterLogic extends Laya.Script {

    constructor() { 
        super();
        /** @prop {name:createPrefab, tips:"变身动画", type:String, default:""}*/
        let createPrefab = "";
    }
    
    onEnable() {
        let script = this.owner.getComponent(FlyMonsterLogic);
        if (script && script.createPrefab) {
            this.owner.createPrefab = script.createPrefab;
        } else {
            this.owner.createPrefab = "";
        }

        this.owner.createdMonster = false;


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
        if (this.owner.createdMonster == true) {
            return;
        }
        this.owner.createdMonster = true;
        let owner = this.owner;
        let x = owner.x;
        let y = owner.y;
        let parent = owner.parent;
        Laya.SoundManager.playSound("loading/caidiren.mp3");
        if (parent) {
            Laya.loader.create(owner.createPrefab, Laya.Handler.create(null, function (prefabDef) {
                let monster = prefabDef.create();
                if (monster) {
                    parent.addChild(monster);
                    monster.x = x;
                    monster.y = y + 50;
                    if (owner) {
                        Utils.removeThis(owner);
                    }
                }
            }));
        }

    }

    onDisable() {
    }

    onUpdate() {
        Utils.tryRemoveThis(this.owner);
    }
}