import EventMgr from "./EventMgr";
import Events from "./Events";
import Utils from "./Utils";

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
        this.owner.isStart = true;
    }

    onMonsterFootDead(data) {
        if (data.owner != this.owner) {
            return;
        }
        if (!this.owner.isStart) {
            return;
        }
        Laya.SoundManager.playSound("other1/caidiren.mp3");
        let rigidBody = this.owner.getComponent(Laya.RigidBody);
        Utils.createFootEffect(this.owner);
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
        }
        else if (other.label == "Water") {
            let rigidBody = this.owner.getComponent(Laya.RigidBody);
            if (rigidBody.label != "Fish" && rigidBody.label != "ShuiMu") {
                Utils.createMonsterDropDeadEffect(this.owner);
            }
        }
    }

    onUpdate() {
        Utils.tryRemoveThis(this.owner);
    }
}