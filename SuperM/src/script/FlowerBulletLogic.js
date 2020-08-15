import EventMgr from "./EventMgr";
import Events from "./Events";
import Utils from "./Utils";

export default class FlowerBulletLogic extends Laya.Script {

    constructor() { 
        super();
    }
    
    onEnable() {
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
        this.owner.direct = data.direct;
        let rigidBody = this.owner.getComponent(Laya.RigidBody);
        rigidBody.setVelocity({x: this.owner.direct.x * 5, y: this.owner.direct.y * 5});
        rigidBody.angularVelocity = 10;
    }

    onTriggerEnter(other, self, contact) {
        if (this.owner) {
            Utils.removeThis(this.owner);
        }
    }
}