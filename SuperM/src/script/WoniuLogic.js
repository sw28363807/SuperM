import EventMgr from "./EventMgr";
import Events from "./Events";
import Utils from "./Utils";
import GameContext from "../GameContext";

export default class WoniuLogic extends Laya.Script {

    constructor() { 
        super();
        /** @prop {name:time, tips:"巡逻时间", type:Number, default:3000}*/
        this.time = 1000;
        /** @prop {name:speed, tips:"移动速度", type:Number, default:5}*/
        this.speed = 1;
    }
    
    onEnable() {
        this.owner.isStartAI = false;
    }

    onDisable() {
        EventMgr.getInstance().removeEvent(Events.Monster_Foot_Dead, this, this.onMonsterFootDead);
        EventMgr.getInstance().removeEvent(Events.Monster_Bullet_Dead, this, this.onMonsterBulletDead);
        EventMgr.getInstance().removeEvent(Events.Monster_KeBullet_Dead, this, this.onMonsterKeBulletDead);
        Laya.timer.clear(this, this.onTimeCallback);
    } 

    onMonsterFootDead(data) {
        if (!this.owner) {
            return;
        }
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
        if (this.owner.monsterCount > 0) {
            this.owner.monsterCount--;
        }
        if (this.owner.monsterCount == 1) {
            let x = this.owner.x;
            let y = this.owner.y;
            let height = this.owner.height
            let parent = this.owner.parent;
            this.owner.rigidBody.enabled = false;
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
        if (this.owner.faceup == 0 || this.owner.faceup == 1) {
            this.owner.faceup = 1;
            this.owner.currentVelocity = {x: this.owner.speed, y: 0};
            this.owner.renderMonster.scaleX = Math.abs(this.owner.renderMonster.scaleX);
        } else {
            this.owner.currentVelocity = {x: -this.owner.speed, y: 0};
            this.owner.renderMonster.scaleX = -1 * Math.abs(this.owner.renderMonster.scaleX);
        }
        this.owner.faceup = -1 * this.owner.faceup;
    }

    onTriggerEnter(other, self, contact) {
        if (other.label == "Hole") {
            let colls = self.owner.getComponents(Laya.ColliderBase);
            for (let index = 0; index < colls.length; index++) {
                let coll = colls[index];
                coll.isSensor = true;
            }
        }
    }

    startAI() {
        if (!this.owner) {
            return;
        }
        EventMgr.getInstance().registEvent(Events.Monster_Foot_Dead, this, this.onMonsterFootDead);
        EventMgr.getInstance().registEvent(Events.Monster_Bullet_Dead, this, this.onMonsterBulletDead);
        EventMgr.getInstance().registEvent(Events.Monster_KeBullet_Dead, this, this.onMonsterKeBulletDead);
        let label = this.owner.getChildByName("prefab");
        if (label) {
            this.prefab = label.text;
        }

        let script = this.owner.getComponent(WoniuLogic);
        if (script.time) {
            this.owner.time = script.time;
        } else {
            this.owner.time = this.time;
        }

        if (script.speed) {
            this.owner.speed = script.speed;
        } else {
            this.owner.speed = this.owner.speed;
        }

        this.owner.faceup = 0;
        this.owner.currentVelocity = null;
        this.owner.monsterCount = 2;
        this.owner.rigidBody = this.owner.getComponent(Laya.RigidBody);
        this.owner.renderMonster = this.owner.getChildByName("render");

        Laya.timer.loop(this.owner.time, this, this.onTimeCallback);
    }

    onUpdate() {
        if (!this.owner) {
            return;
        }
        if (this.owner.isStartAI == false) {
            if (this.owner && GameContext.role) {
                if (this.owner.x < GameContext.role.x + 1500 && this.owner.x > GameContext.role.x) {
                    this.owner.isStartAI = true;
                    this.startAI();
                    return;
                }
            }
        }
        if (this.owner.isStartAI == true) {
            if (this.owner.currentVelocity) {
                let linearVelocity = this.owner.rigidBody.linearVelocity;
                this.owner.rigidBody.setVelocity({x: this.owner.currentVelocity.x, y: linearVelocity.y});
            }
        }
    }
    
    onMonsterKeBulletDead(data) {
        if (!this.owner) {
            return;
        }
        if (data.owner != this.owner) {
            return;
        }
        Utils.createMonsterDropDeadEffect(this.owner);
    }
}