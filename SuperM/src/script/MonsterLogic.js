import EventMgr from "./EventMgr";
import Events from "./Events";
import Utils from "./Utils";

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
        EventMgr.getInstance().postEvent(Events.Monster_Stop_AI, {owner: this.owner});
        let x = this.owner.x;
        let y = this.owner.y;
        let parent = this.owner.parent;
        let faceUp = Utils.getFaceUp(this.owner);
        Laya.loader.create("prefab/monster/DogDead.prefab", Laya.Handler.create(this, function (prefabDef) {
            let dog = prefabDef.create();
            dog.x = x;
            dog.y = y;
            dog.scaleX = faceUp * Math.abs(dog.scaleX);
            parent.addChild(dog);
            Laya.Tween.to(dog, {scaleY: 0.2}, 100, null, Laya.Handler.create(this, function () {
                Laya.timer.once(500, this, function() {
                    dog.removeSelf();
                });
            }));
        }));
        this.owner.removeSelf();
    }

    onMonsterBulletDead(data) {
        if (data.owner != this.owner) {
            return;
        }
        Laya.Tween.to(this.owner, {scaleY: 0.5}, 300, null, Laya.Handler.create(this, function () {
            this.owner.removeSelf();
        }));
    }
}