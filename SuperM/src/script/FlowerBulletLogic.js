import EventMgr from "./EventMgr";
import Events from "./Events";
import Utils from "./Utils";
import GameContext from "../GameContext";

export default class FlowerBulletLogic extends Laya.Script {

    constructor() { 
        super();
    }
    
    onEnable() {
        this.owner.speed = 3;
        EventMgr.getInstance().registEvent(Events.Monster_Shoot_Bullet,this, this.onMonsterShootBullet);
        Laya.timer.loop(10000, this, this.onRemoveBullet);
    }

    onDisable() {
        EventMgr.getInstance().removeEvent(Events.Monster_Shoot_Bullet,this, this.onMonsterShootBullet);
        Laya.timer.clear(this, this.onRemoveBullet);
    }

    onRemoveBullet() {
        if (!this.owner) {
            return;
        }
        Utils.removeThis(this.owner);
    }

    onMonsterShootBullet(data) {
        if (!data) {
            return;
        }
        if (!data.direct) {
            return;
        }
        if (!data.owner) {
            return;
        }
        if (data.owner != this.owner) {
            return;
        }
        this.owner.direct = data.direct;
        let rigidBody = this.owner.getComponent(Laya.RigidBody);
        rigidBody.setVelocity({x: this.owner.direct.x * this.owner.speed, y: this.owner.direct.y * this.owner.speed});
        rigidBody.angularVelocity = 10;
        let owner = this.owner;
        Laya.timer.once(100, null, function() {
            if (owner) {
                owner.zOrder = 65538;
            }
        });
    }

    onTriggerEnter(other, self, contact) {
        if (this.owner) {
            Utils.removeThis(this.owner);
        }
    }

    onUpdate() {
        if (!this.owner) {
            return;
        }
        if (Math.abs(this.owner.x - GameContext.role.x) > 1500 || Math.abs(this.owner.y - GameContext.role.y) > 1500) {
            Utils.removeThis(this.owner);
        }
    }
}