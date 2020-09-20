import Utils from "./Utils";
import GameContext from "../GameContext";
import LoadingBgLogic from "./LoadingBgLogic";
import LoadingLogic from "./LoadingLogic";

export default class BossLogic extends Laya.Script {

    constructor() { 
        super();
    }
    
    onEnable() {

    }

    onDisable() {
    }

    onStart() {
        this.owner.curAni = "";
        GameContext.bossState = 1; //1 移动状态 2 攻击状态 3 被打状态 4 死亡状态
        this.owner.renderAni = this.owner.getChildByName("render");
        this.owner.rigidBody = this.owner.getComponent(Laya.RigidBody);
        this.owner.monsterSpeed = 2;
        this.owner.monsterAttackSpeed = 3;
        this.owner.moveCount = 300;
        this.owner.attackCount = 200;
        this.owner.curMoveCount = 0;
        this.owner.curAttackCount = 0;
        this.owner.directX = Utils.randomSign();
        this.owner.hurtingBoss = false;
        this.owner.bossNumber = 20;
    }

    onUpdate() {
        if (GameContext.bossState == 1) {
            if (this.owner.curAni != "move") {
                this.owner.renderAni.play(0, true, "move");
                this.owner.curAni = "move";
            }
            this.owner.rigidBody.setVelocity({x: this.owner.directX * this.owner.monsterSpeed, y: 0});
            if (this.owner.curMoveCount > this.owner.moveCount) {
                this.owner.curMoveCount = 0;
                GameContext.bossState = 2;
            }
            this.owner.curMoveCount++;
            // this.setSensorEnabled(false);
        } else if (GameContext.bossState == 2) {
            if (this.owner.curAni != "widi") {
                this.owner.renderAni.play(0, true, "widi");
                this.owner.curAni = "widi";
            }
            this.owner.rigidBody.setVelocity({x: this.owner.directX * this.owner.monsterAttackSpeed, y: 0});
            if (this.owner.curAttackCount > this.owner.attackCount) {
                this.owner.curAttackCount = 0;
                GameContext.bossState = 1;
            }
            this.owner.curAttackCount++;
            // this.setSensorEnabled(true);
        } else if (GameContext.bossState == 4) {
            if (this.owner.curAni != "siwang") {
                this.owner.renderAni.play(0, true, "siwang");
                this.owner.curAni = "siwang";
            }
            this.owner.rigidBody.getBody().SetActive(false);
            Laya.timer.once(3000, null, function() {
                LoadingLogic.loadScene("scene/Level1_1.scene");
            });
        }
    }

    setSensorEnabled(enabled) {
        let colls = this.owner.getComponents(Laya.ColliderBase);
        for (let index = 0; index < colls.length; index++) {
            let coll = colls[index];
            coll.isSensor = enabled;
        }
    }

    onTriggerEnter(other, self, contact) {
        if (other.label == "AILeftBoss") {
            this.owner.directX = 1;
        } else if (other.label == "AIRightBoss") {
            this.owner.directX = -1;
        } else if (other.label == "RoleHead" || other.label == "RoleBody" || other.label == "RoleFoot") {
            if (GameContext.bossState == 2) {
                Utils.hurtRole(this.owner);
            } else if (GameContext.bossState == 1) {
                if (other.label == "RoleFoot" && self.label == "BossHead") {
                    if (this.owner.hurtingBoss == false) {
                        this.owner.hurtingBoss = true;
                        GameContext.bossState = 3;
                        if (this.owner.curAni != "beida") {
                            this.owner.renderAni.play(0, false, "beida");
                            this.owner.curAni = "beida";
                        }
                        this.owner.rigidBody.setVelocity({x: 0, y: 0});
                        let time = 30
                        this.owner.renderAni.alpha = 1;
                        Laya.Tween.to(this.owner.renderAni, {alpha: 0},time ,null, Laya.Handler.create(this, function() {
                            Laya.Tween.to(this.owner.renderAni, {alpha: 1},time ,null, Laya.Handler.create(this, function() {
                                Laya.Tween.to(this.owner.renderAni, {alpha: 0},time ,null, Laya.Handler.create(this, function() {
                                    Laya.Tween.to(this.owner.renderAni, {alpha: 1},time ,null, Laya.Handler.create(this, function() {
                                        Laya.Tween.to(this.owner.renderAni, {alpha: 0},time ,null, Laya.Handler.create(this, function() {
                                            Laya.Tween.to(this.owner.renderAni, {alpha: 1},time ,null, Laya.Handler.create(this, function() {
                                                this.owner.bossNumber--;
                                                if (this.owner.bossNumber <= 0) {
                                                    GameContext.bossState = 4;
                                                } else {
                                                    GameContext.bossState = 1;
                                                }
                                            }));
                                        }));
                                    }));
                                }));
                            }));
                        }));
                    }
                }
            }
        }
    }


    onTriggerExit(other, self, contact) {
        if (self.label == "BossSensor") {
            if (other.label == "RoleFoot") {
                this.owner.hurtingBoss = false;
            }
        }
    }
}