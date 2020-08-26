import Utils from "./Utils";
import GameContext from "../GameContext";
import EventMgr from "./EventMgr";
import Events from "./Events";

export default class BrickMonsterLogic extends Laya.Script {

    constructor() { 
        super();

        /** @prop {name:lookArea, tips:"巡逻范围", type:Number, default:250}*/
        let lookArea = 200;
    }
    
    onEnable() {
        EventMgr.getInstance().registEvent(Events.Monster_KeBullet_Dead, this, this.onMonsterKeBulletDead);
       
        let script =  this.owner.getComponent(BrickMonsterLogic);
        if (script.lookArea) {
            this.owner.lookArea = script.lookArea;
        } else {
            this.owner.lookArea = 250;
        }
    }

    onStart() {
        this.owner.rigidBody = this.owner.getComponent(Laya.RigidBody);
        this.owner.eye = this.owner.getChildByName("eye");
        this.owner.idlePoint = {x: this.owner.x, y: this.owner.y};
        this.owner.state = 0; // 0 搜索 1 攻击 2 等待攻击结束 3 闪避玩家 4 休息状态 
        this.owner.idleCount = 0;
        this.owner.footAni = this.owner.getChildByName("foot");
        this.stopAttackAni();
    }

    onDisable() {
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
                body.SetPositionXY(this.owner.idlePoint.x/50, body.GetPosition().y);
            }
            this.owner.idleCount = 0;
            this.stopAttackAni();
        } else if (this.owner.state == 1) {
            this.playAttackAni();
            this.owner.state = 2;
            this.owner.rigidBody.setVelocity({x: 0, y: -30});
            Laya.timer.once(300, this, function() {
                if (!this.owner) {
                    return;
                }
                let dx = Utils.getSign(GameContext.role.x - this.owner.x);
                let linearVelocity = this.owner.rigidBody.linearVelocity;
                this.owner.rigidBody.setVelocity({x: dx * 4, y: linearVelocity.y});
            });

            this.owner.idleCount = 0;
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
                if (other.label == "RoleHead" ||other.label == "RoleBody" || other.label == "RoleFoot") {
                    let dx = Utils.getSign(this.owner.idlePoint.x - this.owner.x);
                    this.owner.rigidBody.setVelocity({x: dx * 3, y: -30});
                    this.owner.state = 3;
                    this.playAttackAni();
                } else if (other.label == "MonsterBody" || other.label == "MonsterFoot") {
                    let dx = Utils.getSign(this.owner.idlePoint.x - this.owner.x);
                    this.owner.rigidBody.setVelocity({x: dx * 3, y: -30});
                    this.owner.state = 3;
                    this.playAttackAni();
                } else if (other.label != "MonsterBody" && other.label != "MonsterFoot") {
                    if (this.owner.state != 0 && contact.m_manifold.localNormal.y < 0) {
                        this.owner.idlePoint = {x: this.owner.x, y: this.owner.y};
                        this.owner.state = 4;
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