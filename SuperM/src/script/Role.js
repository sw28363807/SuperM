import EventMgr from "./EventMgr";
import Events from "./Events";
import GameContext from "../GameContext";
import Utils from "./Utils";

export default class Role extends Laya.Script {

    constructor() { 
        super();
        GameContext.walkDirect = null;
        GameContext.commandWalk = false;
        GameContext.roleSpeed = 9;
        GameContext.roleIsDrop = false;
        GameContext.roleInGround = false;
        GameContext.roleHurting = false;
        GameContext.roleShuiGuanState = 0;
        GameContext.setRoleState(0);
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
        EventMgr.getInstance().registEvent(Events.Role_Give_Speed, this, this.onRoleGiveSpeed);
        EventMgr.getInstance().registEvent(Events.Role_Has_Bullet, this, this.onRoleHasBullet);
        EventMgr.getInstance().registEvent(Events.Role_Change_Big, this, this.onRoleChangeBig);
        
        GameContext.roleCurAni = "";
        GameContext.roleRigidBody = this.owner.getComponent(Laya.RigidBody);
        this.initRoleColl();
        
        GameContext.roleSpr = this.owner.getChildByName("roleSpr");
        GameContext.keSpr = this.owner.getChildByName("ke");
        GameContext.keSpr.visible = false;
        GameContext.setBodyState(GameContext.gameRoleBodyState);
        GameContext.protectedRole = false;
    }

    initRoleColl() {
        let colls =  this.owner.getComponents(Laya.ColliderBase);
        for (let index = 0; index < colls.length; index++) {
            let coll = colls[index];
            if (coll.label == "RoleFoot") {
                GameContext.roleFoot = coll;
            } else if(coll.label == "RoleBody")  {
                GameContext.roleBody = coll;
            } else if (coll.label == "RoleHead") {
                GameContext.roleHead = coll;
            }
        }
    }

    changeBigEffect() {
        if (!this.owner) {
            return;
        }
        if (GameContext.isDie) {
            return;
        }
        if (GameContext.bodyState == 1) {
            return;
        }
        GameContext.bodyState = 1;
        Laya.Tween.to(this.owner, {scaleX: GameContext.bodyBigScale * 0.7, scaleY: GameContext.bodyBigScale * 0.7}, 100, null, Laya.Handler.create(this, function() {
            Laya.Tween.to(this.owner, {scaleX: GameContext.bodyBigScale * 0.5, scaleY: GameContext.bodyBigScale * 0.5}, 100, null, Laya.Handler.create(this, function() {
                Laya.Tween.to(this.owner, {scaleX: GameContext.bodyBigScale * 0.9, scaleY: GameContext.bodyBigScale * 0.9}, 100,null, Laya.Handler.create(this, function() {
                    Laya.Tween.to(this.owner, {scaleX: GameContext.bodyBigScale * 0.7, scaleY: GameContext.bodyBigScale * 0.7}, 100,null, Laya.Handler.create(this, function() {
                        Laya.Tween.to(this.owner, {scaleX: GameContext.bodyBigScale, scaleY: GameContext.bodyBigScale}, 100,null, Laya.Handler.create(this, function() {
                            GameContext.setBodyState(1);
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
        if (GameContext.roleHurting) {
            return;
        }
        GameContext.commandWalk = true;
        GameContext.walkDirect = data;
        this.processRoleWalk();
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
        GameContext.commandWalk = false;
        if (GameContext.roleInGround == true) {
            GameContext.walkDirect = {x: 0, y: 0};
            let linearVelocity = GameContext.getLineSpeed();
            GameContext.setRoleMove(0, linearVelocity.y);
            GameContext.playRoleAni("stand");
        }
    }

    onUpdate() {
        if (!this.owner) {
            return;
        }
        if (GameContext.isDie) {
            this.processRoleDie();
            return;
        }
        this.processGotoShuiguan();
        this.processFaceUp();
    }

    processGotoShuiguan() {
        if (!this.owner) {
            return;
        }
        if (GameContext.isDie) {
            this.shuiguanTime = 0;
            return;
        }
        if (GameContext.roleHurting) {
            this.shuiguanTime = 0;
            return;
        }
        if (GameContext.roleShuiGuanState == 1 || GameContext.roleShuiGuanState == 2) {
            this.shuiguanTime++;
            if (this.shuiguanTime >= 100 && GameContext.walkDirect && GameContext.walkDirect.y > 0 && GameContext.commandWalk) {
                let state = GameContext.roleShuiGuanState;
                GameContext.roleShuiGuanState = 3;
                GameContext.roleRigidBody.enabled = false;
                GameContext.roleShuiGuan.owner.zOrder = GameContext.role.zOrder + 1;
                Laya.Tween.to(GameContext.role, {y: GameContext.role.y + 150} ,1000, null, Laya.Handler.create(null, function() {
                    if (state == 1) {
                        GameContext.roleShuiGuanState = 0;
                        Laya.Scene.open("scene/LevelX.scene");
                    } else if (state == 2) {
                        GameContext.roleShuiGuanState = 0;
                        Laya.Scene.open("scene/Level1_1.scene");
                    }
                }));
            }
        } else {
            this.shuiguanTime = 0;
        }
    }

    processRoleDie() {
        if (!this.owner) {
            return;
        }
        if (GameContext.roleRigidBody) {
            let linearVelocity = GameContext.getLineSpeed();
            GameContext.roleRigidBody.setVelocity({x: 0, y: linearVelocity.y}); 
        }
    }

    processRoleWalk() {
        if (!this.owner) {
            return;
        }
        if (GameContext.isDie) {
            return;
        }
        if (GameContext.roleHurting) {
            return;
        }
        if (GameContext.walkDirect) {
            if (GameContext.walkDirect.x != 0) {
                if (GameContext.roleRigidBody) {
                    let linearVelocity = GameContext.getLineSpeed();
                    GameContext.setRoleMove(GameContext.walkDirect.x * GameContext.roleSpeed, linearVelocity.y);
                }
            }
        }
        let linearVelocity = GameContext.getLineSpeed();
        if (GameContext.roleInGround && linearVelocity.x == 0) {
            GameContext.playRoleAni("stand");
        }
        if (GameContext.roleInGround) {
            GameContext.playRoleAni("run");
        }
    }

    processFaceUp() {
        if (!this.owner) {
            return;
        }
        if (GameContext.isDie) {
            return;
        }
        if (GameContext.walkDirect) {
            let x = GameContext.walkDirect.x;
            if (x > 0) {
               let scaleX =  Math.abs(GameContext.roleSpr.scaleX);
               GameContext.roleSpr.scaleX = scaleX;
               scaleX =  Math.abs(GameContext.keSpr.scaleX);
               GameContext.keSpr.scaleX = scaleX;
            }
            else if (x < 0) {
                let scaleX =  -1 * Math.abs(GameContext.roleSpr.scaleX);
                GameContext.roleSpr.scaleX = scaleX;

                scaleX =  -1 * Math.abs(GameContext.keSpr.scaleX);
                GameContext.keSpr.scaleX = scaleX;
            }
        }
    }

    onTriggerEnter(other, self, contact) {
        if (!this.owner) {
            return;
        }
        if (GameContext.isDie) {
            return;
        }
        if (other.label == "PassLevelBrick") {
            GameContext.triggerRoleWin();
            return;
        }
        if (other.label == "obsDown" || other.label == "obsUp") {
            return;
        }
        if (GameContext.roleIsDrop) {
            GameContext.setRoleSensorEnabled(true);
            return;
        }
        if (other.label == "Hole") {
            GameContext.triggerGotoHole(other.owner);
            GameContext.roleIsDrop = true;
            return;
        }
        let foot = null;
        let body = null;
        let collider = null;
        if (contact.m_fixtureA.collider.label == "RoleFoot") {
            foot = contact.m_nodeA;
            collider = contact.m_fixtureA.collider;
        } else if (contact.m_fixtureB.collider.label == "RoleFoot") {
            foot = contact.m_nodeB;
            collider = contact.m_fixtureB.collider;
        }
        if (!foot) {
            if (contact.m_fixtureA.collider.label == "RoleBody") {
                body = contact.m_nodeA;
                collider = contact.m_fixtureA.collider;
            } else if (contact.m_fixtureB.collider.label == "RoleBody") {
                body = contact.m_nodeB;
                collider = contact.m_fixtureB.collider;
            }   
        }
        if (other.label == "KeBody") {
            EventMgr.getInstance().postEvent(Events.Role_Get_Ke, {owner: other.owner});
            GameContext.keSpr.visible = true;
            GameContext.roleCurAni = "";
            GameContext.playRoleAni(GameContext.roleCurAni);
        } else if (foot && collider.label == "RoleFoot" &&
            (other.label == "MonsterHead")) {
                GameContext.footMonster(other);
        } else if (body && collider.label == "RoleBody" && (other.label == "MonsterBody")) {
            GameContext.hurtRole();
        } else if (foot && other.label != "TanLiBrick" || other.label != "Hole") {
            if (other.label == "obsGround" && other.isSensor == true) {
                return;
            }
            if (other.label == "ShuiguanHead") {
                GameContext.roleShuiGuanState = 1;
                GameContext.initRolePoint = {x: this.owner.x, y: this.owner.y};
                GameContext.roleShuiGuan = other;
            } else if (other.label == "ShuiguanHeadExit") {
                GameContext.roleShuiGuanState = 2;
                GameContext.roleShuiGuan = other;
            }
            GameContext.roleInGround = true;
            if (GameContext.commandWalk == false) {
                GameContext.setRoleMove(0, 0);
                GameContext.playRoleAni("stand");
            } else {
                GameContext.playRoleAni("run");
            }
            if (GameContext.roleHurting) {
                GameContext.roleHurting = false;
                GameContext.walkDirect = GameContext.joyStickDirect;
                GameContext.setRoleMove(0, 0);
                GameContext.playRoleAni("stand");
            }
            if (GameContext.isWin) {
                GameContext.triggerRoleWinGotoDoor();
            }
        }
    }

    onTriggerExit(other, self, contact) {
        if (!this.owner) {
            return;
        }
        if (self.label == "RoleFoot") {
            // GameContext.playRoleAni("jump");
            GameContext.roleShuiGuanState = 0;
        }
    }

    onRoleAButton() {
        if (!this.owner) {
            return;
        }
        if (GameContext.roleInGround == true) {
            GameContext.roleInGround = false;
            GameContext.playRoleAni("jump");
            GameContext.roleShuiGuanState = 0;
            let xSpeed = 0;
            if (GameContext.walkDirect && GameContext.commandWalk) {
                xSpeed = GameContext.walkDirect.x * 10;
            }
            if (GameContext.roleRigidBody) {
                GameContext.roleRigidBody.setVelocity({x: xSpeed, y: GameContext.roleJumpSpeed}); 
            }
        }
    }

    onRoleHasBullet() {
        if (!this.owner) {
            return;
        }
        if (GameContext.isDie) {
            return;
        }
        if (GameContext.roleHurting) {
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
                bullet.x = x + 80;
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
        if (GameContext.roleHurting) {
            return;
        }
        // if (GameContext.bodyState != 1) {
        //     return;
        // }
        if (GameContext.keSpr.visible) {
            this.shootKe();
        } else {
            this.shootBullet();
        }
    }

    onRoleCButton() {
        console.debug(Laya.Physics.I.getBodyCount());
        console.debug(Laya.Physics.I);
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
        GameContext.roleHead = null;
        GameContext.roleBody = null;
        GameContext.roleFoot = null;
        GameContext.roleInGround = false;
    }
}