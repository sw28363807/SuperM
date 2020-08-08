import EventMgr from "./EventMgr";
import Events from "./Events";
import Utils from "./Utils";

export default class WoniuLogic extends Laya.Script {

    constructor() { 
        super();
        this.speed = 3;
        this.faceup = 0;
        this.currentVelocity = null;
        this.monsterCount = 2;
    }
    
    onEnable() {
        EventMgr.getInstance().registEvent(Events.Monster_Foot_Dead, this, this.onMonsterFootDead);
        EventMgr.getInstance().registEvent(Events.Monster_Bullet_Dead, this, this.onMonsterBulletDead);
        EventMgr.getInstance().registEvent(Events.Monster_KeBullet_Dead, this, this.onMonsterKeBulletDead);
        let label = this.owner.getChildByName("prefab");
        if (label) {
            this.prefab = label.text;
        }
        console.debug(this.prefab);
        this.rigidBody = this.owner.getComponent(Laya.RigidBody);
        this.render = this.owner.getChildByName("render");
        Laya.timer.loop(3000, this, this.onTimeCallback);
    }

    onDisable() {
        Laya.timer.clear(this, this.onTimeCallback);
    } 

    onMonsterFootDead(data) {
        if (data.owner != this.owner) {
            return;
        }
        this.removeThisMonster();
    }

    onMonsterBulletDead(data) {
        if (data.owner != this.owner) {
            return;
        }
        this.removeThisMonster();
    }

    removeThisMonster() {
        if (this.monsterCount > 0) {
            this.monsterCount--;
        }
        if (this.monsterCount == 1) {
            let x = this.owner.x;
            let y = this.owner.y;
            let height = this.owner.height
            let parent = this.owner.parent;
            this.rigidBody.enabled = false;
            Laya.timer.clear(this, this.onTimeCallback);
            Utils.removeThis(this.owner);

            Laya.loader.create("prefab/oo/Ke.prefab", Laya.Handler.create(this, function (prefabDef) {
                let ke = prefabDef.create();
                ke.prefab = this.prefab;
                parent.addChild(ke);
                ke.x = x;
                ke.y = y - height/2;
            }));
        }
    }

    
    onTimeCallback() {
        if (this.faceup == 0 || this.faceup == 1) {
            this.faceup = 1;
            this.currentVelocity = {x: this.speed, y: 0};
            this.render.scaleX = Math.abs(this.render.scaleX);
        } else {
            this.currentVelocity = {x: -this.speed, y: 0};
            this.render.scaleX = -1 * Math.abs(this.render.scaleX);
        }
        this.faceup = -1 * this.faceup;
    }

    onUpdate() {
        if (this.currentVelocity) {
            let linearVelocity = this.rigidBody.linearVelocity;
            this.rigidBody.setVelocity({x: this.currentVelocity.x, y: linearVelocity.y});
        }
    }

    onMonsterKeBulletDead(data) {
        if (data.owner != this.owner) {
            return;
        }
        let deadMove = this.owner.getChildByName("deadMove");
        if (deadMove) {
            EventMgr.getInstance().postEvent(Events.Monster_Stop_AI, {owner: this.owner});
            let x = this.owner.x;
            let y = this.owner.y;
            let parent = this.owner.parent;
            let faceUp = data.dx;
            Laya.loader.create(deadMove.text, Laya.Handler.create(this, function (prefabDef) {
                let dead = prefabDef.create();
                dead.x = x;
                dead.y = y;
                dead.scaleX = faceUp * Math.abs(dead.scaleX);
                parent.addChild(dead);
                Laya.Tween.to(dead, {x: x + faceUp*1000, y: y - 1000, rotation: 2500}, 4000, Laya.Ease.expoOut, Laya.Handler.create(this, function () {
                    Laya.timer.once(500, this, function() {
                        Utils.removeThis(dead);
                    });
                }));
            }));
        }
        Utils.removeThis(this.owner);
    }
}