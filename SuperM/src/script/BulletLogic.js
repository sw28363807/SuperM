import Events from "./Events";
import EventMgr from "./EventMgr";
import Utils from "./Utils";
import GameContext from "../GameContext";
import LoadingLogic from "./LoadingLogic";

export default class BulletLogic extends Laya.Script {

    constructor() { 
        super();
        this.count = 0;
        this.isDrop = false;
        this.speed = 20;
    }
    
    onEnable() {
        EventMgr.getInstance().registEvent(Events.Bullet_Shoot, this, this.onBulletShot);
        this.rigidBody = this.owner.getComponent(Laya.RigidBody);
        this.coll = this.owner.getComponent(Laya.ColliderBase);
        if (Laya.Browser.onMiniGame) {
            Laya.SoundManager.playSound("other1/zidan.mp3");
        } else {
            Laya.loader.load("other1/zidan.mp3", Laya.Handler.create(this, function (data) {
                Laya.SoundManager.playSound("other1/zidan.mp3");
            }), null, Laya.Loader.SOUND);
        }
    }

    onDisable() {
        EventMgr.getInstance().removeEvent(Events.Bullet_Shoot, this, this.onBulletShot);
    }

    onBulletShot(data) {
        if (data.owner != this.owner) {
            return;
        }
        this.bulletType = data.bulletType;
        this.owner.initDirectX = data.x;
        this.owner.directX = data.x;
        if (this.bulletType == 1) {
            this.rigidBody.setVelocity({x: this.owner.directX * this.speed, y: 5});
        } else if (this.bulletType == 2) {
            this.rigidBody.setVelocity({x: this.owner.directX * this.speed, y: 0});
        }
    }

    onUpdate() {
        if (this.owner.name == "Bullet") {
            let linearVelocity = this.rigidBody.linearVelocity;
            if (linearVelocity.x * this.owner.initDirectX < 0) {
                Utils.removeThis(this.owner);
                return;
            }
            else if (this.count > 3) {
                Utils.removeThis(this.owner);
                return;
            } else if (Math.abs(this.owner.x - GameContext.role.x) > 1500 || Math.abs(this.owner.y - GameContext.role.y) > 1500) {
                Utils.removeThis(this.owner);
                return;
            }
        } else if (this.owner.name == "KeBullet") {
            if (Math.abs(this.owner.x - GameContext.role.x) > 3000) {
                Utils.removeThis(this.owner);
                return;
            }
            let linearVelocity = this.rigidBody.linearVelocity;
            this.rigidBody.setVelocity({x: this.owner.directX * this.speed, y: linearVelocity.y});
        }
    }



    onTriggerEnter(other, self, contact) {
        if (this.isDrop == true) {
            return;
        }
        if (other) {
            if (other.label == "AITop" || other.label == "AIBottom" || other.label == "AILeft" || other.label == "AIRight") {
                return;
            }
            if (other.label == "obsDown" || other.label == "obsUp") {
                return;
            }
            let scene = LoadingLogic.curSceneExt;
            if (self.label == "KeBulletFoot") {
                if (other.label == "Hole") {
                    this.coll.isSensor = true;
                    this.isDrop = true;
                    this.rigidBody.gravityScale = 5;
                    let owner = this.owner;
                    Laya.timer.once(1000, null, function() {
                        Utils.removeThis(owner);
                    });
                }
            } else if (self.label == "KeBullet") {
                if (other.label == "Brick") {
                    this.owner.directX = -this.owner.directX;
                } else if (other.label == "Wall" || (scene != "" && scene == "scene/Level3_2.scene" && other.label == "Ground")) {
                    if (other.owner.name != "ShuiguanEnter") {
                        Utils.removeThis(this.owner);
                    } else {
                        this.owner.directX = -this.owner.directX;
                    }
                } else if (other.label == "Wenhao") {
                    this.owner.directX = -this.owner.directX;
                } else if (other.label == "MonsterBody") {
                    EventMgr.getInstance().postEvent(Events.Monster_KeBullet_Dead, {owner: other.owner, dx: Utils.getSign(this.rigidBody.linearVelocity.x)}); 
                }
            } else if (self.label == "Bullet") {
                if (other) {
                    this.count++;
                    if (other.label == "Hole") {
                        this.coll.isSensor = true;
                        let owner = this.owner;
                        this.isDrop = true;
                        Laya.timer.once(3000, null, function() {
                            Utils.removeThis(owner);
                        });
                        return;
                    } else if (other.label == "Brick" || other.label == "TanLiBrick" || other.label == "Wall") {
                        Utils.createBulletEffect(self.owner);
                        Utils.removeThis(this.owner);
                    } else if (other.label == "MonsterBody") {
                        Utils.createBulletEffect(self.owner);
                        EventMgr.getInstance().postEvent(Events.Monster_Bullet_Dead, {owner: other.owner});
                        Utils.removeThis(this.owner);
                    } else if (other.label == "KeBody") {
                        if (other.owner) {
                            Utils.removeThis(other.owner);
                        }
                        if (this.owner) {
                            Utils.removeThis(this.owner);
                        }
                    }
                }
            }
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