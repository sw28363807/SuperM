import Utils from "./Utils";
import GameContext from "../GameContext";
import EventMgr from "./EventMgr";
import Events from "./Events";
import PassLevelBrickLogic from "./PassLevelBrickLogic";

export default class BrickMonsterLogic extends Laya.Script {

    constructor() { 
        super();

        /** @prop {name:lookArea, tips:"巡逻范围", type:Number, default:250}*/
        let lookArea = 200;
    }
    
    onEnable() {
        EventMgr.getInstance().registEvent(Events.Monster_KeBullet_Dead, this, this.onMonsterKeBulletDead);
        EventMgr.getInstance().registEvent(Events.Monster_Foot_Dead, this, this.onMonsterFootDead);
       
        let script =  this.owner.getComponent(BrickMonsterLogic);
        if (script.lookArea) {
            this.owner.lookArea = script.lookArea;
        } else {
            this.owner.lookArea = 300;
        }
    }

    onMonsterFootDead(data) {
        if (data.owner != this.owner) {
            return;
        }
        Utils.createBrickBrokenEffect(this.owner);
        Utils.removeThis(this.owner);
    }

    onStart() {
        this.owner.rigidBody = this.owner.getComponent(Laya.RigidBody);
        this.owner.eye = this.owner.getChildByName("eye");
        this.owner.idlePoint = {x: this.owner.x, y: this.owner.y};
        this.owner.startPoint = {x: this.owner.x, y: this.owner.y};
        this.owner.state = 0; // 0 搜索 1 攻击 2 等待攻击结束 3 闪避玩家 4 休息状态 5追击模式
        this.owner.idleCount = 0;
        this.owner.footAni = this.owner.getChildByName("foot");
        this.owner.isGround = true;
        this.stopAttackAni();
    }

    onDisable() {
        EventMgr.getInstance().removeEvent(Events.Monster_Foot_Dead, this, this.onMonsterFootDead);
        EventMgr.getInstance().removeEvent(Events.Monster_KeBullet_Dead, this, this.onMonsterKeBulletDead);
    }

    onMonsterKeBulletDead(data) {
        if (data.owner != this.owner) {
            return;
        }
        Utils.createBrickBrokenEffect(this.owner);
        Utils.removeThis(this.owner);
    }

    onUpdate() {
        if (this.owner.state == 0) {
            if (Math.abs(GameContext.role.x - this.owner.idlePoint.x) < this.owner.lookArea) {
                this.owner.state = 1;
            } else {
                this.owner.rigidBody.setVelocity({x: 0, y: 0});
                let body = this.owner.rigidBody.getBody();
                body.SetPositionXY(this.owner.idlePoint.x/50, this.owner.idlePoint.y/50);
            }
            this.owner.idleCount = 0;
            this.stopAttackAni();
        } else if (this.owner.state == 1) {
            this.owner.isGround = false;
            this.playAttackAni();
            this.owner.state = 2;
            this.owner.rigidBody.setVelocity({x: 0, y: -19});
            Laya.timer.once(300, this, function() {
                if (!this.owner) {
                    return;
                }
                this.owner.state = 5;
                this.owner.idleCount = 0;
            });
            this.owner.idleCount = 0;
        } else if (this.owner.state == 5) {
            let distance = Math.abs(GameContext.role.x - this.owner.x);
            let dx = Utils.getSign(GameContext.role.x - this.owner.x);
            let linearVelocity = this.owner.rigidBody.linearVelocity;
            if (this.owner.footAni.visible == true) {
                if (distance > 400) {
                    this.owner.rigidBody.setVelocity({x: dx*1, y: linearVelocity.y});
                } else {
                    this.owner.rigidBody.setVelocity({x: dx * distance/250 * 20, y: linearVelocity.y});
                }
            }
        } else if (this.owner.state == 4) {
            this.stopAttackAni();
            this.owner.idleCount++;
            this.owner.rigidBody.setVelocity({x: 0, y: 0});
            let body = this.owner.rigidBody.getBody();
            body.SetPositionXY(this.owner.idlePoint.x/50, body.GetPosition().y);
            if (this.owner.idleCount > 200) {
                this.owner.state = 0;
                this.owner.idleCount = 0;
            }
        }
        Utils.tryRemoveThis(this.owner);
    }

    playAttackAni() {
        this.owner.eye.visible = true;
        this.owner.footAni.visible = true;
        this.owner.footAni.play(0, false, "ani1");
    }

    stopAttackAni() {
        this.owner.eye.visible = false;
        this.owner.footAni.visible = false;
        this.owner.footAni.stop();
    }

    onTriggerEnter(other, self, contact) {
        if (other.label == "AITop" || other.label == "AIBottom" || other.label == "AILeft" || other.label == "AIRight") {
            return;
        }
        if (other.label == "Hole") {
            let colls = self.owner.getComponents(Laya.ColliderBase);
            for (let index = 0; index < colls.length; index++) {
                let coll = colls[index];
                coll.isSensor = true;
            }
            this.owner.idleCount = 0;
        } else {
            if (self.label == "MonsterFoot") {
                if (this.owner.footAni.visible == true &&(other.label == "RoleHead" ||other.label == "RoleBody" || other.label == "RoleFoot")) {
                    if (other.label == "RoleHead") {
                        this.owner.rigidBody.setVelocity({x: 0, y: 0});
                        this.owner.state = 3;
                        Utils.hurtRole(this.owner);
                    }
                } else if (other.label == "MonsterBody" || other.label == "MonsterFoot") {
                    let dx = Utils.getSign(this.owner.idlePoint.x - this.owner.x);
                    this.owner.rigidBody.setVelocity({x: dx * 3, y: -10});
                    this.owner.state = 3;
                    this.playAttackAni();
                } else if (other.label != "MonsterBody" && other.label != "MonsterFoot") {
                    if (this.owner.state != 0 && other.isSensor == false) {
                        if (this.owner.footAni.visible == true) {
                            if (other.label == "Ground" || (other && other.owner && (other.owner.name == "po1" || 
                            other.owner.name == "po2" || other.owner.name == "po3" || other.owner.name == "po4" || 
                            other.owner.name == "po5" || other.owner.name == "po6" || other.owner.name == "po7" || other.owner.name == "BrickGold"
                            || other.owner.name == "Brick" || other.owner.name == "WenhaoBrick" || other.owner.name == "TanLiBrick" || other.owner.name == "CloudBrick"))) {
                                this.owner.idlePoint = {x: this.owner.x, y: this.owner.y + 10};
                                this.owner.isGround = true;
                                this.owner.state = 4;
                            }
                            Laya.SoundManager.playSound("loading/zadi.mp3");
                        } else {
                            Laya.timer.once(5000, this, function() {
                                this.owner.state = 1;
                            });
                        }
                    }
                    this.stopAttackAni();
                    let linearVelocity = this.owner.rigidBody.linearVelocity;
                    this.owner.rigidBody.setVelocity({x: 0, y: linearVelocity.y});
                }
                this.owner.idleCount = 0;
            }
        }
    }
}