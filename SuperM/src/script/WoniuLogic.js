import EventMgr from "./EventMgr";
import Events from "./Events";
import Utils from "./Utils";
import GameContext from "../GameContext";

export default class WoniuLogic extends Laya.Script {

    constructor() { 
        super();
        /** @prop {name:deadMove, tips:"死亡动画", type:String, default:""}*/
        let deadMove = "";
        /** @prop {name:prefab, tips:"变身动画", type:String, default:""}*/
        let prefab = "";
        /** @prop {name:deadAngle, tips:"死亡角度", type:Number, default:-3.14}*/
        let deadAngle = -3.14;
    }
    
    onEnable() {
    }
    onDisable() {
        EventMgr.getInstance().removeEvent(Events.Monster_Foot_Dead, this, this.onMonsterFootDead);
        EventMgr.getInstance().removeEvent(Events.Monster_Bullet_Dead, this, this.onMonsterBulletDead);
        EventMgr.getInstance().removeEvent(Events.Monster_KeBullet_Dead, this, this.onMonsterKeBulletDead);
    } 

    onMonsterFootDead(data) {
        if (!this.owner) {
            return;
        }
        if (data.owner != this.owner) {
            return;
        }
        Laya.SoundManager.playSound("loading/caidiren.mp3");
        this.removeThisMonster();
    }

    onMonsterBulletDead(data) {
        if (data.owner != this.owner) {
            return;
        }
        this.removeThisMonster();
    }

    removeThisMonster() {
        if (this.owner.monsterCount > 0) {
            this.owner.monsterCount--;
        }
        if (this.owner.monsterCount == 1) {
            let prefab = this.owner.prefab;
            let x = this.owner.x;
            let y = this.owner.y;
            let height = this.owner.height;
            let parent = this.owner.parent;
            this.owner.rigidBody.enabled = false;
            Utils.removeThis(this.owner);
            Laya.loader.create("prefab/oo/Ke.prefab", Laya.Handler.create(this, function (prefabDef) {
                let ke = prefabDef.create();
                ke.prefab = prefab;
                parent.addChild(ke);
                ke.x = x;
                ke.y = y - height/2;
            }));
        }
    }

    onTriggerEnter(other, self, contact) {
        if (other.label == "AILeft") {
            this.owner.currentVelocity = {x: this.speed, y: 0};
            this.owner.renderMonster.scaleX = Math.abs(this.owner.renderMonster.scaleX);
        } else if (other.label == "AIRight") {
            this.owner.currentVelocity = {x: -this.speed, y: 0};
            this.owner.renderMonster.scaleX = -1 * Math.abs(this.owner.renderMonster.scaleX);
        } else if (other.label == "MonsterBody") {
            this.owner.currentVelocity = {x: -this.owner.currentVelocity.x, y: 0};
            this.owner.renderMonster.scaleX = Utils.getSign(this.owner.currentVelocity.x) * Math.abs(this.owner.renderMonster.scaleX); 
        } else if (other.label == "Hole") {
            let colls = self.owner.getComponents(Laya.ColliderBase);
            for (let index = 0; index < colls.length; index++) {
                let coll = colls[index];
                coll.isSensor = true;
            }
        }  else if (other.label == "RoleBody" || other.label == "RoleHead" || other.label == "RoleFoot" || other.label == "RoleFootSensor") {
            let dx = Utils.getSign(this.owner.x - GameContext.role.x);
            this.owner.currentVelocity = {x: dx * Math.abs(this.owner.currentVelocity.x), y: 0};
            this.owner.renderMonster.scaleX = Utils.getSign(this.owner.currentVelocity.x) * Math.abs(this.owner.renderMonster.scaleX);
        }
    }

    onStart() {
        if (!this.owner) {
            return;
        }
        EventMgr.getInstance().registEvent(Events.Monster_Foot_Dead, this, this.onMonsterFootDead);
        EventMgr.getInstance().registEvent(Events.Monster_Bullet_Dead, this, this.onMonsterBulletDead);
        EventMgr.getInstance().registEvent(Events.Monster_KeBullet_Dead, this, this.onMonsterKeBulletDead);


        let script = this.owner.getComponent(WoniuLogic);
        if (script && script.deadMove) {
            this.owner.deadMove = script.deadMove;
        } else {
            this.owner.deadMove = "";
        }

        if (script && script.prefab) {
            this.owner.prefab = script.prefab;
        } else {
            this.owner.prefab = "";
        }

        if (script && script.deadAngle) {
            this.owner.deadAngle = script.deadAngle;
        } else {
            this.owner.deadAngle = -3.14;
        }

        this.speed = 0.5;
        this.owner.currentVelocity = {x: this.speed, y: 0};
        this.owner.monsterCount = 2;
        this.owner.rigidBody = this.owner.getComponent(Laya.RigidBody);
        this.owner.renderMonster = this.owner.getChildByName("render");
    }

    onUpdate() {
        if (!this.owner) {
            return;
        }
        if (this.owner.currentVelocity) {
            let linearVelocity = this.owner.rigidBody.linearVelocity;
            this.owner.rigidBody.setVelocity({x: this.owner.currentVelocity.x, y: linearVelocity.y});
        }
        Utils.tryRemoveThis(this.owner);
    }
    
    onMonsterKeBulletDead(data) {
        if (!this.owner) {
            return;
        }
        if (data.owner != this.owner) {
            return;
        }
        Utils.createFen(this.owner);
        Utils.createMonsterDropDeadEffect(this.owner);
    }
}