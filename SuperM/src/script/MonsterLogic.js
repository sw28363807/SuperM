import EventMgr from "./EventMgr";
import Events from "./Events";
import Utils from "./Utils";
import GameContext from "../GameContext";

export default class MonsterLogic extends Laya.Script {

    constructor() { 
        super();
        /** @prop {name:deadMove, tips:"死亡动画", type:String, default:""}*/
        let deadMove = "";
        /** @prop {name:deadAngle, tips:"死亡角度", type:Number, default:-3.14}*/
        let deadAngle = -3.14;
    }
    
    onEnable() {
        EventMgr.getInstance().registEvent(Events.Monster_Foot_Dead, this, this.onMonsterFootDead);
        EventMgr.getInstance().registEvent(Events.Monster_Bullet_Dead, this, this.onMonsterBulletDead);
        EventMgr.getInstance().registEvent(Events.Monster_KeBullet_Dead, this, this.onMonsterKeBulletDead);

        let script = this.owner.getComponent(MonsterLogic);
        if (script && script.deadMove) {
            this.owner.deadMove = script.deadMove;
        } else {
            this.owner.deadMove = "";
        }


        if (script && script.deadAngle) {
            this.owner.deadAngle = script.deadAngle;
        } else {
            this.owner.deadAngle = -3.14;
        }

    }

    onDisable() {
        EventMgr.getInstance().removeEvent(Events.Monster_Foot_Dead, this, this.onMonsterFootDead);
        EventMgr.getInstance().removeEvent(Events.Monster_Bullet_Dead, this, this.onMonsterBulletDead);
        EventMgr.getInstance().removeEvent(Events.Monster_KeBullet_Dead, this, this.onMonsterKeBulletDead);
    }

    onStart() {
        let owner = this.owner;
        Laya.timer.once(1000, null, function() {
            owner.isStart = true;
        });
    }

    onMonsterFootDead(data) {
        if (data.owner != this.owner) {
            return;
        }
        if (!this.owner.isStart) {
            return;
        }
        this.createFootEffect();
    }

    onMonsterBulletDead(data) {
        if (!this.owner) {
            return;
        }
        if (data.owner != this.owner) {
            return;
        }
        Utils.createMonsterDropDeadEffect(this.owner);
    }

    onMonsterKeBulletDead(data) {
        if (data.owner != this.owner) {
            return;
        }
        this.createKeBulletEffect(data);
    }

    onUpdate() {
        if (this.owner && GameContext.role) {
            if (this.owner.x < GameContext.role.x - 2000 || Math.abs(this.owner.y - GameContext.y) > 3000) {
                Utils.removeThis(this.owner);
                return;
            }
        }
    }


    createKeBulletEffect(data) {
        if (!this.owner) {
            return;
        }
        if (data.owner != this.owner) {
            return;
        }
        Utils.createMonsterDropDeadEffect(this.owner);
    }

    onTriggerEnter(other, self, contact) {
        if (other.label == "Hole") {
            let colls = self.owner.getComponents(Laya.ColliderBase);
            for (let index = 0; index < colls.length; index++) {
                let coll = colls[index];
                coll.isSensor = true;
            }
        } else {
            
        }
    }

    createFootEffect() {
        let deadMove = this.owner.deadMove;
        if (deadMove != "") {
            EventMgr.getInstance().postEvent(Events.Monster_Stop_AI, {owner: this.owner});
            let x = this.owner.x;
            let y = this.owner.y;
            let parent = this.owner.parent;
            let faceUp = Utils.getFaceUp(this.owner);
            Laya.loader.create(deadMove, Laya.Handler.create(this, function (prefabDef) {
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