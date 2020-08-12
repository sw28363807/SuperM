import EventMgr from "./EventMgr";
import Events from "./Events";
import Utils from "./Utils";
import GameContext from "../GameContext";

export default class MonsterLogic extends Laya.Script {

    constructor() { 
        super();
    }
    
    onEnable() {
        EventMgr.getInstance().registEvent(Events.Monster_Foot_Dead, this, this.onMonsterFootDead);
        EventMgr.getInstance().registEvent(Events.Monster_Bullet_Dead, this, this.onMonsterBulletDead);
        EventMgr.getInstance().registEvent(Events.Monster_KeBullet_Dead, this, this.onMonsterKeBulletDead);
    }

    onDisable() {
        EventMgr.getInstance().removeEvent(Events.Monster_Foot_Dead, this, this.onMonsterFootDead);
        EventMgr.getInstance().removeEvent(Events.Monster_Bullet_Dead, this, this.onMonsterBulletDead);
        EventMgr.getInstance().removeEvent(Events.Monster_KeBullet_Dead, this, this.onMonsterKeBulletDead);
    }

    onMonsterFootDead(data) {
        if (data.owner != this.owner) {
            return;
        }
        this.createFootEffect();
    }

    onMonsterBulletDead(data) {
        if (data.owner != this.owner) {
            return;
        }
        this.createBulletEffect(data);
    }

    onMonsterKeBulletDead(data) {
        if (data.owner != this.owner) {
            return;
        }
        this.createKeBulletEffect(data);
    }

    onUpdate() {
        if (this.owner && GameContext.role) {
            if (this.owner.x < GameContext.role.x - 2000) {
                Utils.removeThis(this.owner);
                return;
            }
        }
    }

    createBulletEffect(data) {
        let deadMove = this.owner.getChildByName("deadMove");
        if (deadMove) {
            EventMgr.getInstance().postEvent(Events.Monster_Stop_AI, {owner: this.owner});
            let x = this.owner.x;
            let y = this.owner.y;
            let parent = this.owner.parent;
            let faceUp = data.dx;
            Laya.loader.create(deadMove.text, Laya.Handler.create(null, function (prefabDef) {
                let dead = prefabDef.create();
                dead.x = x;
                dead.y = y;
                // dead.scaleX = faceUp * Math.abs(dead.scaleX);
                parent.addChild(dead);
                let rigid = dead.getComponent(Laya.RigidBody);
                rigid.setAngle(180);
                rigid.setVelocity({x: 3, y: -15});
                rigid.gravityScale = 5;
                // rigid.angularVelocity = 5;
                Laya.timer.once(3000, this, function() {
                    Utils.removeThis(dead);
                });
            }));
        }
        Utils.removeThis(this.owner);
    }


    createKeBulletEffect(data) {
        // let deadMove = this.owner.getChildByName("deadMove");
        // if (deadMove) {
        //     EventMgr.getInstance().postEvent(Events.Monster_Stop_AI, {owner: this.owner});
        //     let x = this.owner.x;
        //     let y = this.owner.y;
        //     let parent = this.owner.parent;
        //     let faceUp = data.dx;
        //     Laya.loader.create(deadMove.text, Laya.Handler.create(this, function (prefabDef) {
        //         let dead = prefabDef.create();
        //         dead.x = x;
        //         dead.y = y;
        //         dead.scaleX = faceUp * Math.abs(dead.scaleX);
        //         parent.addChild(dead);
        //         Laya.Tween.to(dead, {x: x + faceUp*1000, y: y - 1000, rotation: 2500}, 4000, Laya.Ease.expoOut, Laya.Handler.create(this, function () {
        //             Laya.timer.once(500, this, function() {
        //                 Utils.removeThis(dead);
        //             });
        //         }));
        //     }));
        // }
        // Utils.removeThis(this.owner);
        this.createBulletEffect(data);
    }

    createFootEffect() {
        let deadMove = this.owner.getChildByName("deadMove");
        if (deadMove) {
            EventMgr.getInstance().postEvent(Events.Monster_Stop_AI, {owner: this.owner});
            let x = this.owner.x;
            let y = this.owner.y;
            let parent = this.owner.parent;
            let faceUp = Utils.getFaceUp(this.owner);
            Laya.loader.create(deadMove.text, Laya.Handler.create(this, function (prefabDef) {
                let dead = prefabDef.create();
                dead.x = x;
                dead.y = y;
                dead.scaleX = faceUp * Math.abs(dead.scaleX);
                parent.addChild(dead);
                let rigid = dead.getComponent(Laya.RigidBody);
                rigid.enabled = false;
                Laya.Tween.to(dead, {scaleY: 0.2}, 100, null, Laya.Handler.create(this, function () {
                    Laya.timer.once(200, dead, function() {
                        Utils.removeThis(dead);
                    });
                }));
            }));
        }
        Utils.removeThis(this.owner);
    }
}