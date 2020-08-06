import EventMgr from "./EventMgr";
import Events from "./Events";
import GameContext from "../GameContext";
import Utils from "./Utils";

export default class Role extends Laya.Script {

    constructor() { 
        super();
        this.walkDirect = null;
        this.commandWalk = false;
        this.speed = 9;
        this.jumpSpeed = 35;
        this.isInGround = false;
        this.isHurting = false;
        this.shuiguanState = 0; // 0 不在水管 1 进水管 2 出水管
        this.faceup = 1;
        this.setRoleState(0);

        this.footMonsterPower = {x: 10, y: -10};
        this.roleHurtPower = {x: 10, y: -10};
        this.roleJumpPower = -25;
        this.bodyBigScale = 1;
        this.bodySmallScale = 0.6;

        this.curScaleFactor = this.bodySmallScale;
        this.isDie = false;

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
        
        this.curAni = "";
        this.rigidBody = this.owner.getComponent(Laya.RigidBody);
        this.roleSpr = this.owner.getChildByName("roleSpr");
        this.keSpr = this.owner.getChildByName("ke");
        this.keSpr.visible = false;
        this.setBodyState(GameContext.gameRoleBodyState);
        this.protectedRole = false;
        this.notHurtRole = false;
    }

    playAni(ani, loop) {
        if (this.isDie) {
            return;
        }
        if (this.curAni == ani) {
            return;
        }
        if (loop == null || loop == undefined) {
            loop = true;
        }
        this.curAni = ani;
        // console.debug(this.curAni);
        if (this.keSpr.visible) {
            if (this.curAni =="stand") {
                this.roleSpr.play(0, loop, "zhuastand");
            } else if (this.curAni =="run") {
                this.roleSpr.play(0, loop, "zhuarun");
            } else if (this.curAni =="jump") {
                this.roleSpr.play(0, loop, "zhuajump");
            }
        } else {
            this.roleSpr.play(0, loop, ani);
        }
        Laya.timer.once(500, this, function() {
            if (this.curAni == "stand" && this.isInGround == true && this.commandWalk == false && this.keSpr.visible == false) {
                this.playAni("kong1", true);
            }
        });
    }

    // 0 正常 1子弹
    setRoleState(state) {
        if (this.isDie) {
            return;
        }
        GameContext.gameRoleState = state;
    }

    // 0 小孩 1长大
    setBodyState(bodyState) {
        if (this.isDie) {
            return;
        }
        GameContext.bodyState = bodyState;
        GameContext.gameRoleBodyState = GameContext.bodyState;
        if (GameContext.bodyState == 0) {
            this.curScaleFactor = this.bodySmallScale;
        } else {
            this.curScaleFactor = this.bodyBigScale;
        }
        this.owner.scaleX = this.curScaleFactor;
        this.owner.scaleY = this.curScaleFactor;
    }

    changeBigEffect() {
        if (this.isDie) {
            return;
        }
        if (GameContext.bodyState == 1) {
            return;
        }
        GameContext.bodyState = 1;
        Laya.Tween.to(this.owner, {scaleX: this.bodyBigScale * 0.7, scaleY: this.bodyBigScale * 0.7}, 100, null, Laya.Handler.create(this, function() {
            Laya.Tween.to(this.owner, {scaleX: this.bodyBigScale * 0.5, scaleY: this.bodyBigScale * 0.5}, 100, null, Laya.Handler.create(this, function() {
                Laya.Tween.to(this.owner, {scaleX: this.bodyBigScale * 0.9, scaleY: this.bodyBigScale * 0.9}, 100,null, Laya.Handler.create(this, function() {
                    Laya.Tween.to(this.owner, {scaleX: this.bodyBigScale * 0.7, scaleY: this.bodyBigScale * 0.7}, 100,null, Laya.Handler.create(this, function() {
                        Laya.Tween.to(this.owner, {scaleX: this.bodyBigScale, scaleY: this.bodyBigScale}, 100,null, Laya.Handler.create(this, function() {
                            this.setBodyState(1);
                        }));
                    }));
                }));
            }));
        }));
    }

    changeSmallEffect() {
        if (this.isDie) {
            return;
        }
        if (GameContext.bodyState == 0) {
            return;
        }
        GameContext.bodyState = 0;
        Laya.Tween.to(this.owner, {scaleX: this.bodySmallScale, scaleY: this.bodySmallScale}, 1500, Laya.Ease.elasticOut, Laya.Handler.create(this, function() {
            this.setBodyState(0);
        }));        
    }

    setMove(px, py) {
        if (this.isDie) {
            return;
        }
        if (this.isHurting) {
            return;
        }
        this.rigidBody.setVelocity({x: px, y: py});        
    }

    onRoleWalk(data) {
        if (this.isDie) {
            return;
        }
        if (this.isHurting) {
            return;
        }
        this.commandWalk = true;
        this.walkDirect = data;
        this.processRoleWalk();
    }

    onRoleStopWalk() {
        if (this.isDie) {
            return;
        }
        this.commandWalk = false;
        if (this.isInGround == true) {
            this.walkDirect = {x: 0, y: 0};
            let linearVelocity = this.rigidBody.linearVelocity;
            this.setMove(0, linearVelocity.y);
            this.playAni("stand");
        }
    }

    onUpdate() {
        if (this.isDie) {
            this.processRoleDie();
            return;
        }
        this.processGotoShuiguan();
        this.processFaceUp();
    }

    processGotoShuiguan() {
        if (this.isDie) {
            this.shuiguanTime = 0;
            return;
        }
        if (this.isHurting) {
            this.shuiguanTime = 0;
            return;
        }
        if (this.shuiguanState == 1 || this.shuiguanState == 2) {
            this.shuiguanTime++;
            if (this.shuiguanTime >= 100 && this.walkDirect.y > 0 && this.commandWalk) {
                if (this.shuiguanState == 1) {
                    this.shuiguanState = 0;
                    GameContext.gameScene.removeChildren();
                    GameContext.gameScene.close();
                    Laya.Scene.open("scene/LevelX.scene");
                } else if (this.shuiguanState == 2) {
                    GameContext.gameScene.removeChildren();
                    GameContext.gameScene.close();
                    this.shuiguanState = 0;
                    Laya.Scene.open("scene/Level1_1.scene");
                }
            }
        } else {
            this.shuiguanTime = 0;
        }
    }

    processRoleDie() {
        let linearVelocity = this.rigidBody.linearVelocity;
        this.rigidBody.setVelocity({x: 0, y: linearVelocity.y}); 
    }

    processRoleWalk() {
        if (this.isDie) {
            return;
        }
        if (this.isHurting) {
            return;
        }
        if (this.walkDirect) {
            if (this.walkDirect.x != 0) {
                let linearVelocity = this.rigidBody.linearVelocity;
                this.setMove(this.walkDirect.x * this.speed, linearVelocity.y);
            }
        }
        let linearVelocity = this.rigidBody.linearVelocity;
        if (this.isInGround && linearVelocity.x == 0) {
            this.playAni("stand");
        }
        if (this.isInGround) {
            this.playAni("run");
        }
    }
    

    processFaceUp() {
        if (this.isDie) {
            return;
        }
        if (this.walkDirect) {
            let x = this.walkDirect.x;
            if (x > 0) {
               let scaleX =  Math.abs(this.roleSpr.scaleX);
               this.roleSpr.scaleX = scaleX;
               scaleX =  Math.abs(this.keSpr.scaleX);
               this.keSpr.scaleX = scaleX;
            }
            else if (x < 0) {
                let scaleX =  -1 * Math.abs(this.roleSpr.scaleX);
                this.roleSpr.scaleX = scaleX;

                scaleX =  -1 * Math.abs(this.keSpr.scaleX);
                this.keSpr.scaleX = scaleX;
            }
        }
    }

    onTriggerEnter(other, self, contact) {
        if (this.isDie) {
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
            this.keSpr.visible = true;
            this.curAni = "";
            this.playAni(this.curAni);
        } else if (foot && collider.label == "RoleFoot" &&
            (other.label == "MonsterHead")) {
            this.onRoleGiveSpeed({x: this.getFaceup() * this.footMonsterPower.x, y: this.footMonsterPower.y});
            EventMgr.getInstance().postEvent(Events.Monster_Foot_Dead, {owner: other.owner});
        } else if (body && collider.label == "RoleBody" && (other.label == "MonsterBody")) {
            this.hurtRole();
        } else if (foot && other.label != "TanLiBrick") {
            if (other.label == "ShuiguanHead") {
                this.shuiguanState = 1;
                GameContext.initRolePoint = {x: this.owner.x, y: this.owner.y};
            } else if (other.label == "ShuiguanHeadExit") {
                this.shuiguanState = 2;
            }
            this.isInGround = true;
            if (this.commandWalk == false) {
                this.setMove(0, 0);
                this.playAni("stand");
            } else {
                this.playAni("run");
            }
            if (this.isHurting) {
                this.isHurting = false;
                this.walkDirect = GameContext.joyStickDirect;
                this.setMove(0, 0);
                this.playAni("stand");
            }
            
        }
    }

    alphaEffect(alpha, handler) {
        Laya.Tween.to(this.roleSpr, {alpha: alpha}, 100, Laya.Ease.elasticOut, handler, 0);
    }
    
    showHurtEffect() {
        this.alphaEffect(0, Laya.Handler.create(this, function() {
            this.alphaEffect(1, Laya.Handler.create(this, function() {
                this.alphaEffect(1, Laya.Handler.create(this, function() {
                    this.alphaEffect(0, Laya.Handler.create(this, function() {
                        this.alphaEffect(1, Laya.Handler.create(this, function() {
            
                        }) );
                    }) );
                }) );
            }) );
        }) );
    }

    onTriggerExit(other, self, contact) {
        if (this.isDie) {
            return;
        }
        if (self.label == "RoleFoot") {
            // this.playAni("jump");
            this.shuiguanState = 0;
        }
    }

    onRoleAButton() {
        if (this.isDie) {
            return;
        }
        if (this.isInGround == true) {
            this.isInGround = false;
            this.playAni("jump");
            this.shuiguanState = 0;
            let xSpeed = 0;
            if (this.walkDirect) {
                xSpeed = this.walkDirect.x * 10;
            }
            this.rigidBody.setVelocity({x: xSpeed, y: this.roleJumpPower});
        }
    }

    onRoleGiveSpeed(speedData) {
        if (this.isDie) {
            return;
        }
        if (this.isHurting) {
            return;
        }
        this.isInGround = false;
        this.shuiguanState = 0;
        this.rigidBody.setVelocity(speedData);
    }

    onRoleHasBullet() {
        if (this.isDie) {
            return;
        }
        if (this.isHurting) {
            return;
        }
        this.setRoleState(1);
    }

    onRoleChangeBig() {
        if (this.isDie) {
            return;
        }
        this.changeBigEffect();
        // this.setBodyState(1);
    }

    shootKe() {
        if (this.isDie) {
            return;
        }
        let x =  this.owner.x;
        let y =  this.owner.y;
        let parent = this.owner.parent;
        this.keSpr.visible = false;
        Laya.loader.create("prefab/KeBullet.prefab", Laya.Handler.create(this, function (prefabDef) {
            let bullet = prefabDef.create();
            let faceup = this.getFaceup();
            parent.addChild(bullet);
            if (faceup > 0) {
                bullet.x = x + 110;
            } else if (faceup < 0) {
                bullet.x = x - 40;
            }
            bullet.y = y + 30;
            EventMgr.getInstance().postEvent(Events.Bullet_Shoot, {x: this.getFaceup(), y: 0, bulletType: 2, owner: bullet});
        }));
        let ani = this.curAni;
        this.curAni = "";
        this.playAni(ani);
    }

    shootBullet() {
        if (this.isDie) {
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
            let faceup = this.getFaceup();
            parent.addChild(bullet);
            if (faceup > 0) {
                bullet.x = x + 110;
            } else if (faceup < 0) {
                bullet.x = x - 40;
            }
            bullet.y = y + 30;
            EventMgr.getInstance().postEvent(Events.Bullet_Shoot, {x: this.getFaceup(), y: 0, bulletType: 1, owner: bullet});
        }));
    }

    onRoleBButton() {
        if (this.isDie) {
            return;
        }
        if (this.isHurting) {
            return;
        }
        // if (GameContext.bodyState != 1) {
        //     return;
        // }
        if (this.keSpr.visible) {
            this.shootKe();
        } else {
            this.shootBullet();
        }
    }

    hurtRole() {
        if (this.isDie) {
            return;
        }
        if (this.notHurtRole) {
            return;
        }
        Laya.timer.once(500, this, function() {
            this.notHurtRole = false;
        });
        this.setMove(0, 0);
        this.onRoleGiveSpeed({x: -this.getFaceup() * this.roleHurtPower.x, y: this.roleHurtPower.y});
        this.showHurtEffect();
        this.isHurting = true;
        this.playAni("stand");
        this.isInGround = false;
        this.walkDirect = null;
        if (this.protectedRole == false) {
            this.changeSmallEffect();
            GameContext.gameRoleNumber--;
            if (GameContext.gameRoleNumber == 0) {
                this.playAni("die", false);
                this.isDie = true;
            }
            EventMgr.getInstance().postEvent(Events.Refresh_Role_Number);
            this.protectedRole = true;
            Laya.timer.once(1500, this, function() {
                this.protectedRole = false;
            });
        }
    }

    onRoleCButton() {
    }

    getFaceup() {
        if (this.isDie) {
            return;
        }
        if (this.roleSpr.scaleX > 0) {
            return 1
        }
        return -1;
    }

    onDisable() {
        GameContext.role = null;
    }
}