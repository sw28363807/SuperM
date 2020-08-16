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
        GameContext.roleShuiGuanState = 0;
        GameContext.roleHurting = false;
        GameContext.bodyBigScale = 1;
        GameContext.bodySmallScale = 0.6;

        GameContext.curScaleFactor = GameContext.bodySmallScale;
        GameContext.isDie = false;

        this.shuiguanTime = 0;
    }
    
    onEnable() {
        this.owner.zOrder = 65535;
        GameContext.role = this.owner;
        EventMgr.getInstance().registEvent(Events.Role_Move, this, this.onRoleWalk);
        EventMgr.getInstance().registEvent(Events.Role_Move_Stop, this, this.onRoleStopWalk);
        EventMgr.getInstance().registEvent(Events.Role_A_Button, this, this.onRoleAButton);
        EventMgr.getInstance().registEvent(Events.Role_B_Button, this, this.onRoleBButton);
        EventMgr.getInstance().registEvent(Events.Role_C_Button, this, this.onRoleCButton);
        // EventMgr.getInstance().registEvent(Events.Role_Give_Speed, this, this.onRoleGiveSpeed);
        EventMgr.getInstance().registEvent(Events.Role_Has_Bullet, this, this.onRoleHasBullet);
        EventMgr.getInstance().registEvent(Events.Role_Change_Big, this, this.onRoleChangeBig);
        
        GameContext.roleCurAni = "";
        GameContext.roleRigidBody = this.owner.getComponent(Laya.RigidBody);
        GameContext.roleNormal = this.owner.getChildByName("roleSpr");
        GameContext.roleLight = this.owner.getChildByName("roleSprLight");
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

    onTriggerExit(other, self, contact) {

    }

    changeBigEffect() {
        if (!this.owner) {
            return;
        }
        if (GameContext.isDie) {
            return;
        }
        Laya.Tween.to(this.owner, {scaleX: GameContext.bodyBigScale * 0.7, scaleY: GameContext.bodyBigScale * 0.7}, 100, null, Laya.Handler.create(this, function() {
            Laya.Tween.to(this.owner, {scaleX: GameContext.bodyBigScale * 0.5, scaleY: GameContext.bodyBigScale * 0.5}, 100, null, Laya.Handler.create(this, function() {
                Laya.Tween.to(this.owner, {scaleX: GameContext.bodyBigScale * 0.9, scaleY: GameContext.bodyBigScale * 0.9}, 100,null, Laya.Handler.create(this, function() {
                    Laya.Tween.to(this.owner, {scaleX: GameContext.bodyBigScale * 0.7, scaleY: GameContext.bodyBigScale * 0.7}, 100,null, Laya.Handler.create(this, function() {
                        Laya.Tween.to(this.owner, {scaleX: GameContext.bodyBigScale, scaleY: GameContext.bodyBigScale}, 100,null, Laya.Handler.create(this, function() {
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
                    GameContext.setRoleMove(speedX, linearVelocity.y);
                }
            }
            let linearVelocity = GameContext.getLineSpeed();
            if (GameContext.roleInGround) {
                if (Math.abs(linearVelocity.x) <= 0.0000001) {
                    GameContext.playRoleAni("stand");
                } else {
                    if (GameContext.commandWalk) {
                        if (Math.abs(linearVelocity.y) < 1) {
                            GameContext.playRoleAni("run");
                        } else {
                            GameContext.roleInGround = false;
                            GameContext.playRoleAni("jump");
                        }
                    }
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
        if (!other || !other.owner) {
            return;
        }
        if (GameContext.isDie) {
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
        if (other.label == "Hole") {
            GameContext.triggerGotoHole(other.owner);
            GameContext.roleIsDrop = true;
            return;
        }
        if (GameContext.roleIsDrop) {
            return;
        }
        if (other.label == "KeBody") {
            EventMgr.getInstance().postEvent(Events.Role_Get_Ke, {owner: other.owner});
            GameContext.keSpr.visible = true;
            GameContext.roleCurAni = "";
            GameContext.playRoleAni(GameContext.roleCurAni);
        } else if (self.label == "RoleFoot" &&
            (other.label == "MonsterBody")) {
                if (self.owner) {
                    if (other.owner.name == "Flower") {
                    } else {
                        if (Utils.roleInCeil(other.owner)) {
                            GameContext.footMonster(other);
                        }
                    }
                }
        } else if (self.label == "RoleBody" && (other.label == "MonsterBody") && GameContext.curFootMonster == null) {
            if (other.owner && other.owner.name == "Flower") {
            } else {
                if (self.owner.y + self.owner.height * self.owner.scaleY >= other.owner.y - 10) {
                    GameContext.hurtRole();
                }
            }

        } else if (other.label == "FlowerBullet") {
            GameContext.hurtRole();
        } else if ((other.label != "TanLiBrick" || other.label != "Hole") && self.label =="RoleFoot") {
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
                    GameContext.setRoleMove(0, 0);
                    GameContext.playRoleAni("");
                }
            }
            if (GameContext.isWin) {
                GameContext.triggerRoleWinGotoDoor();
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
        if (GameContext.roleInGround == true) {
            GameContext.roleInGround = false;
            GameContext.playRoleAni("jump");
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
            GameContext.setRoleSpeed(xSpeed, ySpeed);

        }
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

    onRoleCButton() {
        Laya.Scene.open("scene/Level1_1.scene");
    }

    onDisable() {
        EventMgr.getInstance().removeEvent(Events.Role_Move, this, this.onRoleWalk);
        EventMgr.getInstance().removeEvent(Events.Role_Move_Stop, this, this.onRoleStopWalk);
        EventMgr.getInstance().removeEvent(Events.Role_A_Button, this, this.onRoleAButton);
        EventMgr.getInstance().removeEvent(Events.Role_B_Button, this, this.onRoleBButton);
        EventMgr.getInstance().removeEvent(Events.Role_C_Button, this, this.onRoleCButton);
        EventMgr.getInstance().removeEvent(Events.Role_Give_Speed, this, this.onRoleGiveSpeed);
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