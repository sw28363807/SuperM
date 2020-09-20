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
        GameContext.roleFlyDrop = false;

        GameContext.curScaleFactor = GameContext.bodySmallScale;
        GameContext.isDie = false;

        this.shuiguanTime = 0;
    }
    
    onEnable() {
    }

    onStart() {

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

        if (GameContext.sgOutIndex != 0 && GameContext.gameSceneType == 1) {
            EventMgr.getInstance().postEvent(Events.Role_Exit_Shuiguan);
            GameContext.sgOutIndex = 0;
        }

        if (GameContext.doorInitPoint != null) {
            GameContext.role.x = GameContext.doorInitPoint.x;
            GameContext.role.y = GameContext.doorInitPoint.y;
            GameContext.doorInitPoint = null;
        }
        
    }

    changeBigEffect() {
        if (!this.owner) {
            return;
        }
        if (GameContext.isDie) {
            return;
        }
        let body = GameContext.roleRigidBody.getBody();
        let pos = body.GetPosition();
        body.SetPositionXY(pos.x, pos.y - 1);
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
            if (GameContext.roleIsDrop == false) {
                GameContext.playRoleAni("stand");
                GameContext.setRoleMove(0, linearVelocity.y);
            }
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
            if (this.shuiguanTime >= 50 && GameContext.walkDirect && GameContext.walkDirect.y > 0 && GameContext.commandWalk) {
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
        if (GameContext.roleIsDrop == true) {
            return;
        }
        if (GameContext.isWin == true) {
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
            if (GameContext.roleInWater == true) {
                let speedX = 0;
                if (GameContext.walkDirect) {
                    speedX = GameContext.walkDirect.x;
                }
                if (GameContext.roleInWaterJump == false) {
                    GameContext.setRoleMove(speedX * GameContext.roleInWaterSpeed, 3);  
                }
                GameContext.playRoleAni("youyong");
            } else if ( GameContext.roleCommandFly ==true && GameContext.roleFlyState == true) {
                let upSpeed = -7;
                if (GameContext.commandWalk == true) {
                    if (GameContext.walkDirect) {
                        GameContext.setRoleMove(7 * GameContext.walkDirect.x, upSpeed);
                    } else {
                        GameContext.setRoleMove(0, -3);
                    }

                } else {
                    GameContext.setRoleMove(0, upSpeed);
                }
                GameContext.playRoleAni("fly");
            } else {
                let linearVelocity = GameContext.getLineSpeed();
                if (GameContext.roleFlyDrop == true && GameContext.roleFlyState == true) {
                    GameContext.playRoleAni("fly");
                } else if (GameContext.roleInGround) {
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
            let linearVelocity = GameContext.getLineSpeed();
            if (linearVelocity.y > 15) {
                GameContext.setRoleSpeedY(15);
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
        if (self.label == "RoleBody") {
            if (other.label == "Ground" || other.label == "Wall") {
                return;
            }
        }
        if (other.label == "Hole" && other.owner) {
            GameContext.triggerGotoHole(other.owner);
            GameContext.roleIsDrop = true;
            return;
        }
        if (GameContext.roleIsDrop) {
            return;
        }
        if (self && self.label == "RoleHead" && other && (other.label == "BigBlueBrick" || 
        other.label == "BlueBrick" || other.label == "CiBrick3" || other.label == "CloudBrick" ||
         other.label == "DisBrick" || other.label == "DropBrick" || other.label == "GreenBrick" || 
         other.label == "MoveBrick" || other.label == "MuBrick" || other.label == "TanLiBrick")) {
            Laya.SoundManager.playSound("loading/dingzhuang.mp3");
        }
        if (other.owner && other.label == "KeBody") {
            EventMgr.getInstance().postEvent(Events.Role_Get_Ke, {owner: other.owner});
            GameContext.keSpr.visible = true;
            GameContext.roleCurAni = "";
            GameContext.playRoleAni(GameContext.roleCurAni);
        } else if (other.owner && self.label == "RoleFoot" &
            (other.label == "MonsterBody" || other.label == "MonsterFoot")) {
                if (self.owner) {
                    if (other && other.owner && other.owner.name == "PenShuiMonsterEffect") {
                        GameContext.setRoleSpeed(-15, -15);
                        GameContext.roleHurting = true;
                        GameContext.keSpr.visible = false;
                        GameContext.roleInGround = false;
                        Laya.timer.once(100, this, function() {
                            GameContext.roleHurting = false;
                        });
                    } else {
                        if (GameContext.roleInWater) {
                            Utils.hurtRole(other.owner);
                        } else {
                            GameContext.roleInGround = true;
                            GameContext.setRoleMove(0, 0);
                            GameContext.playRoleAni("stand");
                            if (other.owner.name == "Flower" ||
                              other.owner.name == "Fish") {
                            } else {
                                if ( other.owner.name == "BrickMonster") {
                                    if (Utils.roleInCeil2(other.owner)) {
                                        // Utils.footMonster(other);
                                        // Laya.SoundManager.playSound("loading/posui.mp3");
                                    } else {
                                        if (other.label == "MonsterFoot") {
                                            if (Utils.roleInFloor2(other.owner)) {
                                                Utils.hurtRole(other.owner); 
                                            }
                                        }
                                    }
                                } else {
                                    if (Utils.roleInCeil(other.owner)) {
                                        Utils.footMonster(other);
                                    } else {
                                        Utils.hurtRole(other.owner);
                                    }
                                }
                            }
                        }
                    }
                }
        } else if (other.owner && self.label == "RoleBody" && (other.label == "MonsterBody" || other.label == "MonsterFoot") && GameContext.curFootMonster == null) {
            if (other.owner && (other.owner.name == "Flower" || other.owner.name == "BrickMonster" )) {
                if (other.label == "MonsterFoot") {
                    if (Utils.roleInFloor2(other.owner)) {
                        Utils.hurtRole(other.owner);
                    }
                }
            } else {
                if (other && other.owner && other.owner.name == "PenShuiMonsterEffect") {
                    GameContext.setRoleSpeed(-15, -15);
                    GameContext.roleHurting = true;
                    GameContext.keSpr.visible = false;
                    GameContext.roleInGround = false;
                    Laya.timer.once(100, this, function() {
                        GameContext.roleHurting = false;
                    });
                } else {
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
            if (other.label == "CiBrickSensor") {
                return;
            }
            if (other.label == "obsGround" || other.label == "MoveBrickStartArea") {
                if (other.isSensor == true) {
                    return;
                }
            }

            if (other.label == "FlowerNoOut") {
                return;
            }

            if ( other.label == "Reward") {
                return;
            }

            if (other.label == "BossBody" || other.label == "BossHead") {
                if (GameContext.bossState == 2) {
                    return;
                }
            }

            if (other.label != "ShuiguanHeadEnter") {
                GameContext.roleShuiGuanState = 0;
            }
            GameContext.roleInGround = true;
            GameContext.roleFlyDrop = false;
            if (GameContext.commandWalk == false) {
                if (GameContext.roleInWater == false) {
                    GameContext.setRoleMove(0, 0);
                }
                GameContext.playRoleAni("stand");
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

        if (GameContext.roleIsDrop == true) {
            return;
        }

        if (GameContext.roleShuiGuanState == 2) {
            return;
        }

        if (GameContext.roleInWater == true) {
            this.triggerRoleInWaterJump();
            Laya.SoundManager.playSound("loading/youyong.mp3");
        } 
        else if (GameContext.roleInGround == true) {
            GameContext.roleInGround = false;
            this.triggerRoleGroundJump();
            Laya.SoundManager.playSound("loading/jump.mp3");
        }
    }

    triggerRoleInWaterJump() {
        if (GameContext.roleInWaterJump == true) {
            return;
        }
        GameContext.roleInWaterJump = true;
        this.shuiguanTime = 0;
        GameContext.roleShuiGuanState = 0;
        GameContext.setRoleSpeedY(-4);
        Laya.timer.once(300, this, function() {
            GameContext.roleInWaterJump = false;
        });
    }


    triggerRoleGroundJump() {
        this.shuiguanTime = 0;
        GameContext.playRoleAni("jump");
        GameContext.roleShuiGuanState = 0;
        let xSpeed = 0;
        if (GameContext.walkDirect && GameContext.commandWalk) {
            xSpeed = GameContext.walkDirect.x * 9;
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
        if (!this.owner) {
            return;
        }
        if (GameContext.isDie) {
            return;
        }
        if (data == "down") {
            if ((true || GameContext.curFlyPower > 0) && GameContext.roleFlyState == true) {
                if (GameContext.keSpr.visible) {
                    this.shootKe();
                }
                GameContext.roleCommandFly = true;
                GameContext.roleInGround = false;
            } else {
                GameContext.roleCommandFly = false;
                GameContext.roleFlyDrop = true;
            }
        } else if (data == "up") {
            GameContext.upSpeed = 0;
            GameContext.roleCommandFly = false;
            GameContext.roleFlyDrop = true;
        }
    }

    onDisable() {
        EventMgr.getInstance().removeEvent(Events.Role_Move, this, this.onRoleWalk);
        EventMgr.getInstance().removeEvent(Events.Role_Move_Stop, this, this.onRoleStopWalk);
        EventMgr.getInstance().removeEvent(Events.Role_A_Button, this, this.onRoleAButton);
        EventMgr.getInstance().removeEvent(Events.Role_B_Button, this, this.onRoleBButton);
        EventMgr.getInstance().removeEvent(Events.Role_C_Button, this, this.onRoleCButton);
        EventMgr.getInstance().removeEvent(Events.Role_Has_Bullet, this, this.onRoleHasBullet);
        EventMgr.getInstance().removeEvent(Events.Role_Change_Big, this, this.onRoleChangeBig);
        GameContext.roleRigidBody = null;
        GameContext.role = null;
        this.owner.destroy();
        this.destroy();
        this.owner = null;
        GameContext.roleInGround = false;
    }
}