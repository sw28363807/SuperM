import Events from "./Events";
import EventMgr from "./EventMgr";

export default class BulletLogic extends Laya.Script {

    constructor() { 
        super();
        this.count = 0;
    }
    
    onEnable() {
        EventMgr.getInstance().registEvent(Events.Bullet_Shoot, this, this.onBulletShot);
        this.rigidBody = this.owner.getComponent(Laya.RigidBody);
    }

    onDisable() {

    }

    onBulletShot(data) {
        if (data.owner != this.owner) {
            return;
        }
        this.bulletType = data.bulletType;
        if (this.bulletType == 1) {
            this.rigidBody.setVelocity({x: data.x * 30, y: 3});
        } else if (this.bulletType == 2) {
            this.rigidBody.setVelocity({x: data.x * 30, y: 0});
        }
    }

    onUpdate() {
        if (this.count > 3 && this.owner.name != "KeBullet") {
            this.owner.removeSelf();
        }
    }



    onTriggerEnter(other, self, contact) {
        this.count++;
        if (other && other.label == "Brick" || 
        other.label == "TanLiBrick" ||
         other.label == "Wall") {
             if (self.label != "KeBullet") {
                this.owner.removeSelf();
             }
        } else if(other.label == "MonsterHead" || other.label == "MonsterBody") {
            EventMgr.getInstance().postEvent(Events.Monster_Bullet_Dead, {owner: other.owner});
            this.owner.removeSelf();
            return
        }
    }

    onTriggerExit(other, self, contact) {
        if (other && other.label == "Ground"  || other.label == "Brick"
        || other.label == "TanLiBrick" || other.label == "Wall") {
            if (self.label == "KeBullet") {
                let linearVelocity = this.rigidBody.linearVelocity;
                this.rigidBody.setVelocity({x: linearVelocity.x, y: 0});
            }
        }
    }
}