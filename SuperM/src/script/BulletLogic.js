import Events from "./Events";
import EventMgr from "./EventMgr";

export default class BulletLogic extends Laya.Script {

    constructor() { 
        super();
    }
    
    onEnable() {
        EventMgr.getInstance().registEvent(Events.Bullet_Shoot, this, this.onBulletShot);
        this.rigidBody = this.owner.getComponent(Laya.RigidBody);
    }

    onDisable() {

    }

    onBulletShot(data) {
        this.rigidBody.setVelocity({x: data.x * 30, y: 10});
    }

    onTriggerEnter(other, self, contact) {
        if (other && other.label == "Brick" || 
        other.label == "TanLiBrick" ||
         other.label == "Wall") {
            this.owner.removeSelf();
        } else if(other.label == "MonsterHead" || other.label == "MonsterBody") {
            EventMgr.getInstance().postEvent(Events.Monster_Bullet_Dead, {owner: other.owner});
            this.owner.removeSelf();
            return
        }
    }
}