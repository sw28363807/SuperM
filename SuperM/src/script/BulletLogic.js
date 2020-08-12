import Events from "./Events";
import EventMgr from "./EventMgr";
import Utils from "./Utils";

export default class BulletLogic extends Laya.Script {

    constructor() { 
        super();
        this.count = 0;
        this.isDrop = false;
    }
    
    onEnable() {
        EventMgr.getInstance().registEvent(Events.Bullet_Shoot, this, this.onBulletShot);
        this.rigidBody = this.owner.getComponent(Laya.RigidBody);
        this.coll = this.owner.getComponent(Laya.ColliderBase);
    }

    onDisable() {

    }

    onBulletShot(data) {
        if (data.owner != this.owner) {
            return;
        }
        this.bulletType = data.bulletType;
        if (this.bulletType == 1) {
            this.rigidBody.setVelocity({x: data.x * 20, y: 8});
        } else if (this.bulletType == 2) {
            this.rigidBody.setVelocity({x: data.x * 20, y: 0});
        }
    }

    onUpdate() {
        if (this.count > 3 && this.owner.name != "KeBullet") {
            Utils.removeThis(this.owner);
        }
    }



    onTriggerEnter(other, self, contact) {
        if (this.isDrop == true) {
            return;
        }
        if (this.owner.name == "KeBullet" && other.label == "Hole") {
            this.coll.isSensor = true;
            this.isDrop = true;
            this.rigidBody.gravityScale = 15;
            Laya.timer.once(1000, null, function() {
                Utils.removeThis(this.owner);
            });
            return;
        }
        this.count++;
        if (other && other.label == "Brick" || 
        other.label == "TanLiBrick" ||
         other.label == "Wall") {
             if (self.label != "KeBullet") {
                 Utils.removeThis(this.owner);
             }
        } else if(other.label == "MonsterBody") {
            if (self.label == "KeBullet") {
                EventMgr.getInstance().postEvent(Events.Monster_KeBullet_Dead, {owner: other.owner, dx: Utils.getSign(this.rigidBody.linearVelocity.x)});
            } else {
                EventMgr.getInstance().postEvent(Events.Monster_Bullet_Dead, {owner: other.owner});
            }
            Utils.removeThis(this.owner);
            return
        }
    }

    onTriggerExit(other, self, contact) {
        if (this.isDrop == true) {
            return;
        }
        if (other && other.label == "Ground"  || other.label == "Brick"
        || other.label == "TanLiBrick" || other.label == "Wall") {
            if (self.label == "KeBullet") {
                let linearVelocity = this.rigidBody.linearVelocity;
                this.rigidBody.setVelocity({x: linearVelocity.x, y: 0});
            }
        }
    }
}