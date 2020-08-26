import EventMgr from "./EventMgr";
import Events from "./Events";
import GameContext from "../GameContext";
import Utils from "./Utils";

export default class Role extends Laya.Script {

    constructor() { 
        super();
        GameContext.walkDirect = null;
        GameContext.commandWalk = false;
        GameContext.roleIsDrop = false;
        GameContext.roleInGround = false;
        GameContext.roleInWater = false;
        GameContext.roleShuiGuanState = 0;
        GameContext.roleHurting = false;
        GameContext.bodyBigScale = 1;
        GameContext.bodySmallScale = 0.6;

        GameContext.curScaleFactor = GameContext.bodySmallScale;
        GameContext.isDie = false;

        this.shuiguanTime = 0;
    }
    
    onEnable() {
        GameContext.role = this.owner;
        EventMgr.getInstance().registEvent(Events.Role_Move, this, this.onRoleWalk);
        EventMgr.getInstance().registEvent(Events.Role_Move_Stop, this, this.onRoleStopWalk);
        EventMgr.getInstance().registEvent(Events.Role_A_Button, this, this.onRoleAButton);
        EventMgr.getInstance().registEvent(Events.Role_B_Button, this, this.onRoleBButton);
        EventMgr.getInstance().registEvent(Events.Role_C_Button, this, this.onRoleCButton);
        EventMgr.getInstance().registEvent(Events.Role_Has_Bullet, this, this.onRoleHasBullet);
        EventMgr.getInstance().registEvent(Events.Role_Change_Big, this, this.onRoleChangeBig);
        
        GameContext.roleCurAni = "";
        GameContext.roleRigidBody = this.owner.getComponent(Laya.RigidBody);
        GameContext.roleGravityScale = GameContext.roleRigidBody.gravityScale;

        GameContext.roleRoot = this.owner.getChildByName("root");
        GameContext.roleNormal = GameContext.roleRoot.getChildByName("roleSpr");
        GameContext.roleLight = GameContext.roleRoot.getChildByName("roleSprLight");
        GameContext.keSpr = this.owner.getChildByName("ke");
        GameContext.keSpr.visible = false;
        GameContext.setBodyState(GameContext.gameRoleBodyState);
        GameContext.setRoleState(GameContext.gameRoleState);
    }

    onStart() {
        if (GameContext.sgOutIndex != 0 && GameContext.gameSceneType == 1) {
            EventMgr.getInstance().postEvent(Events.Role_Exit_Shuiguan);
            GameContext.sgOutIndex = 0;
        }
    }

    changeBigEffect() {
        if (!this.owner) {
            return;
        }
        if (GameContext.isDie) {
            return;
        }
        Laya.Tween.to(GameContext.roleRoot, {scaleX: GameContext.bodyBigScale * 0.7, scaleY: GameContext.bodyBigScale * 0.7}, 70, null, Laya.Handler.create(this, function() {
            Laya.Tween.to(GameContext.roleRoot, {scaleX: GameContext.bodyBigScale * 0.5, scaleY: GameContext.bodyBigScale * 0.5}, 70, null, Laya.Handler.create(this, function() {
                Laya.Tween.to(GameContext.roleRoot, {scaleX: GameContext.bodyBigScale * 0.9, scaleY: GameContext.bodyBigScale * 0.9}, 70,null, Laya.Handler.create(this, function() {
                    Laya.Tween.to(GameContext.roleRoot, {scaleX: GameContext.bodyBigScale * 0.7, scaleY: GameContext.bodyBigScale * 0.7}, 70,null, Laya.Handler.create(this, function() {
                        Laya.Tween.to(GameContext.roleRoot, {scaleX: GameContext.bodyBigScale, scaleY: GameContext.bodyBigScale}, 70,null, Laya.Handler.create(this, function() {
                        }));
                    }));
                }));
            }));
        }));
    }

    onRoleWalk(data) {
        if (!this.owner) {
            return;
        }
        if (GameContext.isDie) {
            return;
        }
        GameContext.commandWalk = true;
        GameContext.walkDirect = data;
    }

    onRoleStopWalk() {
        if (!this.owner) {
            return;
        }
        if (GameContext.isDie) {
            return;
        }
        if (!GameContext.roleRigidBody) {
            return;
        }
        GameContext.resetRoleWalkSpeed();
        GameContext.commandWalk = false;
        GameContext.walkDirect = null;
        let linearVelocity = GameContext.getLineSpeed();
        if (GameContext.roleInGround == true) {
            GameContext.playRoleAni("stand");
            GameContext.setRoleMove(0, linearVelocity.y);
        } else {
            GameContext.setRoleMove(linearVelocity.x, linearVelocity.y);
        }
    }

    onUpdate() {
        if (!this.owner) {
            return;
        }

        GameContext.brokenBrickTick--;
        if (GameContext.brokenBrickTick < 0) {
            GameContext.brokenBrickTick = 0;
        }
        if (GameContext.isDie) {
            this.processRoleDie();
            return;
        }
        this.processRoleMove();
        this.processGotoShuiguan();
        GameContext.processFaceUp();
    }

    processGotoShuiguan() {
        if (!this.owner) {
            return;
        }
        if (GameContext.isDie) {
            this.shuiguanTime = 0;
            return;
        }
        if (GameContext.roleShuiGuanState == 1) {
            this.shuiguanTime++;
            if (this.shuiguanTime >= 100 && GameContext.walkDirect && GameContext.walkDirect.y > 0 && GameContext.commandWalk) {
                EventMgr.getInstance().postEvent(Events.Role_Enter_Shuiguan);
                GameContext.roleShuiGuanState = 2;
            }
        } else {
            this.shuiguanTime = 0;
        }
    }

    processRoleDie() {
        if (!this.owner) {
            return;
        }
        let linearVelocity = GameContext.getLineSpeed();
        GameContext.setRoleSpeed(0, linearVelocity.y);
    }

    processRoleMove() {
        if (!this.owner) {
            return;
        }
        if (GameContext.isDie) {
            return;
        }
        if (GameContext.roleFooting) {
            return;
        }
        GameContext.processRoleWalkSpeed();
        if (GameContext.roleHurting == false) {
            if (GameContext.walkDirect) {
                if (GameContext.walkDirect.x != 0) {
                    let linearVelocity = GameContext.getLineSpeed();
                    let speedX =  GameContext.walkDirect.x * GameContext.roleSpeed;
                    let speedY =  GameContext.walkDirect.y * GameContext.roleSpeed;
                    if (GameContext.roleInWater == true) {
                        speedY = GameContext.walkDirect.y
                        if (speedY == 0) {
                            speedY = 2;
                        }
                        GameContext.setRoleMove(GameContext.walkDirect.x * 5, speedY);
                    } else if (GameContext.roleCommandFly == true) {
                        GameContext.setRoleMove(GameContext.walkDirect.x * 5, speedY);
                    } else {
                        GameContext.setRoleMove(speedX, linearVelocity.y);
                    }
                }
            } else {
                if (GameContext.roleInWater == true) {
                    if (GameContext.commandWalk == false) {
                        GameContext.setRoleMove(0, 2);
                    }
                }
            }
            if (GameContext.roleCommandFly == true) {
                GameContext.playRoleAni("fly");
            } else if (GameContext.roleInWater == true) {
                GameContext.playRoleAni("youyong");
            } else {
                let linearVelocity = GameContext.getLineSpeed();
                if (GameContext.roleInGround) {
                    if (Math.abs(linearVelocity.x) <= 0.0000001) {
                        GameContext.playRoleAni("stand");
                    } else {
                        if (GameContext.commandWalk) {
                            GameContext.playRoleAni("run");
                        }
                    }
                } else {
                    GameContext.playRoleAni("jump");
                }
            }
        }
    }

    onTriggerEnter(other, self, contact) {
        if (!this.owner) {
            return;
        }
        if (!self || !self.owner) {
            return;
        }
        if (!other) {
            return;
        }
        if (GameContext.isDie) {
            return;
        }
        if (other.label == "AITop" || other.label == "AIBottom" || other.label == "AILeft" || other.label == "AIRight") {
            return;
        }
        if (other.label == "Gold") {
            return;
        }
        if (other.label == "PassLevelBrick") {
            GameContext.triggerRoleWin();
            return;
        }
        if (other.label == "obsDown" || other.label == "obsUp") {
            return;
        }
        if (GameContext.roleIsDrop == true) {
            return;
        }
        if (other.label == "Hole" && other.owner) {
            GameContext.triggerGotoHole(other.owner);
            GameContext.roleIsDrop = true;
            return;
        }
        if (GameContext.roleIsDrop) {
            return;
        }
        if (other.owner && other.label == "KeBody") {
            EventMgr.getInstance().postEvent(Events.Role_Get_Ke, {owner: other.owner});
            GameContext.keSpr.visible = true;
            GameContext.roleCurAni = "";
            GameContext.playRoleAni(GameContext.roleCurAni);
        } else if (other.owner && self.label == "RoleFoot" &
            (other.label == "MonsterBody")) {
                if (self.owner) {
                    if (GameContext.roleInWater) {
                        Utils.hurtRole(other.owner);
                    } else {
                        GameContext.roleInGround = true;
                        GameContext.setRoleMove(0, 0);
                        GameContext.playRoleAni("stand");
                        if (other.owner.name == "Flower") {
                        } else {
                            if (Utils.roleInCeil(other.owner)) {
                                Utils.footMonster(other);
                            }
                        }
                    }
                }
        } else if (other.owner && self.label == "RoleBody" && (other.label == "MonsterBody" || other.label == "MonsterFoot") && GameContext.curFootMonster == null) {
            if (other.owner && other.owner.name == "Flower") {
            } else {
                if (self.owner.y + self.owner.height * self.owner.scaleY >= other.owner.y - 10) {
                    Utils.hurtRole(other.owner);
                }
            }
        } else if (other.label == "FlowerBullet") {
            Utils.hurtRole(other.owner);
        } else if ((other.label != "TanLiBrick" && other.label != "Hole") && self.label =="RoleFoot" &&
         other.label != "MonsterBody" &&
          other.label != "MonsterHead" && 
          other.label != "MonsterFoot") {
            if (contact.m_manifold.localNormal >= 0) {
                return;
            }
            if (other.label == "obsGround") {
                if (other.isSensor == true) {
                    return;
                }
            }

            if (other.label == "FlowerNoOut") {
                return;
            }
            if (other.label != "ShuiguanHeadEnter") {
                GameContext.roleShuiGuanState = 0;
            }
            GameContext.roleInGround = true;
            if (GameContext.roleHurting == true) {
                GameContext.roleHurting = false;
                GameContext.setRoleMove(0, 0);
                GameContext.playRoleAni("stand");
            } else {
                if (GameContext.commandWalk == false) {
                    if (GameContext.roleInWater == false) {
                        GameContext.setRoleMove(0, 0);
                    }
                    GameContext.playRoleAni("");
                }
            }
            if (GameContext.isWin) {
                Utils.triggerRoleWinGotoDoor();
            }
        }
    }

    onRoleAButton() {
        if (!this.owner) {
            return;
        }

        if (GameContext.roleShuiGuanState == 2) {
            return;
        }
        if (GameContext.roleInWater == true) {
            this.triggerRoleInWaterJump();
        } else if (GameContext.roleInGround == true) {
            GameContext.roleInGround = false;
            this.triggerRoleGroundJump();
        }
    }

    triggerRoleInWaterJump() {
        this.shuiguanTime = 0;
        GameContext.roleShuiGuanState = 0;
        let xSpeed = 0;
        if (GameContext.walkDirect && GameContext.commandWalk) {
            xSpeed = GameContext.walkDirect.x * 7;
            if (GameContext.gameRoleBodyState == 0) {
                xSpeed = xSpeed * 0.9;
            }
        }
        let ySpeed = GameContext.roleJumpSpeed;
        if (GameContext.gameRoleBodyState == 0) {
            ySpeed = GameContext.roleSmallJumpSpeed;
        }
        GameContext.setRoleSpeed(xSpeed, -5);
    }


    triggerRoleGroundJump() {
        this.shuiguanTime = 0;
        GameContext.playRoleAni("jump");
        GameContext.roleShuiGuanState = 0;
        let xSpeed = 0;
        if (GameContext.walkDirect && GameContext.commandWalk) {
            xSpeed = GameContext.walkDirect.x * 7;
            if (GameContext.gameRoleBodyState == 0) {
                xSpeed = xSpeed * 0.9;
            }
        }
        let ySpeed = GameContext.roleJumpSpeed;
        if (GameContext.gameRoleBodyState == 0) {
            ySpeed = GameContext.roleSmallJumpSpeed;
        }
        GameContext.setRoleSpeed(xSpeed, ySpeed);
    }



    onRoleHasBullet() {
        if (!this.owner) {
            return;
        }
        if (GameContext.isDie) {
            return;
        }
        GameContext.setRoleState(1);
    }

    onRoleChangeBig() {
        if (!this.owner) {
            return;
        }
        if (GameContext.isDie) {
            return;
        }
        this.changeBigEffect();
    }

    shootKe() {
        if (!this.owner) {
            return;
        }
        if (GameContext.isDie) {
            return;
        }
        let x =  this.owner.x;
        let y =  this.owner.y;
        let parent = this.owner.parent;
        GameContext.keSpr.visible = false;
        Laya.loader.create("prefab/KeBullet.prefab", Laya.Handler.create(this, function (prefabDef) {
            let bullet = prefabDef.create();
            let faceup = GameContext.getRoleFaceup();
            parent.addChild(bullet);
            if (faceup > 0) {
                bullet.x = x + 110;
            } else if (faceup < 0) {
                bullet.x = x - 40;
            }
            bullet.y = y + 30;
            EventMgr.getInstance().postEvent(Events.Bullet_Shoot, {x: GameContext.getRoleFaceup(), y: 0, bulletType: 2, owner: bullet});
        }));
        let ani = GameContext.roleCurAni;
        GameContext.roleCurAni = "";
        GameContext.playRoleAni(ani);
    }

    shootBullet() {
        if (!this.owner) {
            return;
        }
        if (GameContext.isDie) {
            return;
        }
        if (GameContext.gameRoleState != 1) {
            return;
        }
        let x =  this.owner.x;
        let y =  this.owner.y;
        let parent = this.owner.parent;
        Laya.loader.create("prefab/Bullet.prefab", Laya.Handler.create(this, function (prefabDef) {
            let bullet = prefabDef.create();
            let faceup = GameContext.getRoleFaceup();
            parent.addChild(bullet);
            if (faceup > 0) {
                bullet.x = x + 80;
            } else if (faceup < 0) {
                bullet.x = x - 20;
            }
            bullet.y = y + 60;
            EventMgr.getInstance().postEvent(Events.Bullet_Shoot, {x: GameContext.getRoleFaceup(), y: 0, bulletType: 1, owner: bullet});
        }));
    }

    onRoleBButton() {
        if (!this.owner) {
            return;
        }
        if (GameContext.isDie) {
            return;
        }
        if (GameContext.keSpr.visible) {
            this.shootKe();
        } else {
            this.shootBullet();
        }
    }

    onRoleCButton(data) {
        if (data == "up") {
            GameContext.roleCommandFly = true;
            GameContext.roleFlyState = true;
        } else {
            GameContext.roleCommandFly = false;
        }
        // Laya.Scene.open("scene/Level2_1.scene");
        // Laya.Scene.open("scene/LittleGameScene1.scene");
    }

    onDisable() {
        EventMgr.getInstance().removeEvent(Events.Role_Move, this, this.onRoleWalk);
        EventMgr.getInstance().removeEvent(Events.Role_Move_Stop, this, this.onRoleStopWalk);
        EventMgr.getInstance().removeEvent(Events.Role_A_Button, this, this.onRoleAButton);
        EventMgr.getInstance().removeEvent(Events.Role_B_Button, this, this.onRoleBButton);
        EventMgr.getInstance().removeEvent(Events.Role_C_Button, this, this.onRoleCButton);
        EventMgr.getInstance().removeEvent(Events.Role_Has_Bullet, this, this.onRoleHasBullet);
        EventMgr.getInstance().removeEvent(Events.Role_Change_Big, this, this.onRoleChangeBig);
        if (GameContext.roleRigidBody) {
            GameContext.roleRigidBody.enabled = false;
            GameContext.roleRigidBody.destroy();
        }
        GameContext.roleRigidBody = null;
        GameContext.role = null;
        this.owner.destroy();
        this.destroy();
        this.owner = null;
        GameContext.roleInGround = false;
    }
}