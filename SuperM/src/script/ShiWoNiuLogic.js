import EventMgr from "./EventMgr";
import Events from "./Events";
import Utils from "./Utils";
import GameContext from "../GameContext";

export default class ShiWoNiuLogic extends Laya.Script {

    constructor() { 
        super();
    }
    
    onEnable() {
    }

    onStart() {
        EventMgr.getInstance().registEvent(Events.Monster_Foot_Dead, this, this.onMonsterFootDead);
        EventMgr.getInstance().registEvent(Events.Monster_Bullet_Dead, this, this.onMonsterBulletDead);
        EventMgr.getInstance().registEvent(Events.Monster_KeBullet_Dead, this, this.onMonsterKeBulletDead);

        this.speed = 2;
        this.owner.currentVelocity = {x: this.speed, y: 0};
        this.owner.rigidBody = this.owner.getComponent(Laya.RigidBody);
        this.owner.renderMonster = this.owner.getChildByName("render");
        this.owner.curAni = "move";
        this.owner.state = 1;   //1 巡逻状态 2 死亡状态 3 复活状态
    }

    onDisable() {
        EventMgr.getInstance().removeEvent(Events.Monster_Foot_Dead, this, this.onMonsterFootDead);
        EventMgr.getInstance().removeEvent(Events.Monster_Bullet_Dead, this, this.onMonsterBulletDead);
        EventMgr.getInstance().removeEvent(Events.Monster_KeBullet_Dead, this, this.onMonsterKeBulletDead);
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
        } else if (other.label == "RoleBody" || other.label == "RoleHead" || other.label == "RoleFoot") {
            let dx = Utils.getSign(this.owner.x - GameContext.role.x);
            this.owner.currentVelocity = {x: dx * Math.abs(this.owner.currentVelocity.x), y: 0};
            this.owner.renderMonster.scaleX = Utils.getSign(this.owner.currentVelocity.x) * Math.abs(this.owner.renderMonster.scaleX);
        }
    }

    onUpdate() {
        if (!this.owner) {
            return;
        }
        if (this.owner.state == 1) {
            if (this.owner.currentVelocity) {
                if (this.owner.curAni != "move") {
                    this.owner.curAni = "move";
                    this.owner.renderMonster.play(0, false, "move");
                }
                let linearVelocity = this.owner.rigidBody.linearVelocity;
                this.owner.rigidBody.setVelocity({x: this.owner.currentVelocity.x, y: linearVelocity.y});
            }
        } else if (this.owner.state == 2) {
            this.owner.rigidBody.setVelocity({x: 0, y: 0});
        }
        Utils.tryRemoveThis(this.owner);
    }

    
    onMonsterFootDead(data) {
        if (!this.owner) {
            return;
        }
        if (data.owner != this.owner) {
            return;
        }
        this.goDie();
    }

    goDie() {
        if (this.owner.curAni != "die") {
            this.owner.curAni = "die";
            this.owner.state = 2;
            this.owner.rigidBody.getBody().SetActive(false);
            this.owner.renderMonster.play(0, false, "die");
            Laya.timer.once(8000, this, this.onMonsterLive);
        }
    }

    onMonsterLive() {
        if (this.owner.curAni != "live") {
            this.owner.curAni = "live";
            this.owner.renderMonster.play(0, false, "live");
            Laya.timer.once(1000, this, this.onResetMonster);
        }
    }

    onResetMonster() {
        this.owner.state = 1;
        this.owner.rigidBody.getBody().SetActive(true);
    }

    
    onMonsterBulletDead(data) {
        if (data.owner != this.owner) {
            return;
        }
        this.goDie();
    }

    onMonsterKeBulletDead(data) {
        if (!this.owner) {
            return;
        }
        if (data.owner != this.owner) {
            return;
        }
        this.goDie();
    }
}