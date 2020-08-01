import EventMgr from "./EventMgr";
import Events from "./Events";
import GameContext from "../GameContext";

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
    }
    
    onEnable() {
        GameContext.role = this.owner;
        EventMgr.getInstance().registEvent(Events.Role_Move, this, this.onRoleWalk);
        EventMgr.getInstance().registEvent(Events.Role_Move_Stop, this, this.onRoleStopWalk);
        EventMgr.getInstance().registEvent(Events.Role_A_Button, this, this.onRoleAButton);
        EventMgr.getInstance().registEvent(Events.Role_B_Button, this, this.onRoleBButton);
        EventMgr.getInstance().registEvent(Events.Role_C_Button, this, this.onRoleCButton);
        EventMgr.getInstance().registEvent(Events.Role_Give_Speed, this, this.onRoleGiveSpeed);
        EventMgr.getInstance().registEvent(Events.Role_Has_Bullet, this, this.onRoleHasBullet);
        // let a = new Laya.RigidBody();
        // a.linearVelocity
        this.curAni = "";
        this.rigidBody = this.owner.getComponent(Laya.RigidBody);
        this.roleSpr = this.owner.getChildByName("roleSpr");
        this.keSpr = this.roleSpr.getChildByName("ke");
        this.keSpr.visible = false;
    }

    playAni(ani) {
        if (this.curAni == ani) {
            return;
        }
        this.curAni = ani;
        this.roleSpr.play(0, true, ani);
    }

    // 0 正常 1子弹 2待定
    setRoleState(state) {
        this.state = state;
        if (this.state == 0) {
            // this.colorCom.hue = 0;
        } else if (this.state == 1) {
            // this.colorCom.hue = 180;
        }
    }

    setMove(px, py) {
        if (this.isHurting) {
            return;
        }
        this.rigidBody.setVelocity({x: px, y: py});        
    }

    onRoleWalk(data) {
        if (this.isHurting) {
            return;
        }
        this.commandWalk = true;
        this.walkDirect = data;
        this.processRoleWalk();
    }

    onRoleStopWalk() {
        this.commandWalk = false;
        if (this.isInGround == true) {
            this.walkDirect = {x: 0, y: 0};
            let linearVelocity = this.rigidBody.linearVelocity;
            this.setMove(0, linearVelocity.y);
            this.playAni("stand");
        }
    }

    onUpdate() {
        this.processFaceUp();
    }

    processRoleWalk() {
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
        if (this.walkDirect) {
            let x = this.walkDirect.x;
            if (x > 0) {
               let scaleX =  Math.abs(this.roleSpr.scaleX);
               this.roleSpr.scaleX = scaleX;
            }
            else if (x < 0) {
                let scaleX =  -1 * Math.abs(this.roleSpr.scaleX);
                this.roleSpr.scaleX = scaleX;
            }
        }
    }

    onTriggerEnter(other, self, contact) {
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
        } else if (foot && collider.label == "RoleFoot" &&
            (other.label == "MonsterHead")) {
            this.onRoleGiveSpeed({x: this.getFaceup() * 400, y: -500});
            EventMgr.getInstance().postEvent(Events.Monster_Foot_Dead, {owner: other.owner});
        } else if (body && collider.label == "RoleBody" && (other.label == "MonsterBody")) {
            this.setMove(0, 0);
            this.onRoleGiveSpeed({x: -this.getFaceup() * 400, y: -500});
            this.showHurtEffect();
            this.isHurting = true;
            this.playAni("stand");
            this.isInGround = false;
            this.walkDirect = null;
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
        if (self.label == "RoleFoot") {
            this.playAni("jump");
            this.shuiguanState = 0;
        }
    }

    onRoleAButton() {
        if (this.isInGround == true) {
            this.isInGround = false;
            this.playAni("jump");
            this.shuiguanState = 0;
            this.rigidBody.applyLinearImpulseToCenter({x: 0, y: -800});
        }
    }

    onRoleGiveSpeed(speedData) {
        if (this.isHurting) {
            return;
        }
        this.isInGround = false;
        this.shuiguanState = 0;
        this.rigidBody.applyLinearImpulseToCenter(speedData);
    }

    onRoleHasBullet() {
        if (this.isHurting) {
            return;
        }
        this.setRoleState(1);
    }

    onRoleBButton() {
        if (this.isHurting) {
            return;
        }
        let x =  this.owner.x;
        let y =  this.owner.y;
        let parent = this.owner.parent;
        let bulletType = 1;
        let path = "prefab/Bullet.prefab";
        if (this.keSpr.visible) {
            path = "prefab/KeBullet.prefab";
            this.keSpr.visible = false;
            bulletType = 2;
        }
        Laya.loader.create(path, Laya.Handler.create(this, function (prefabDef) {
            let bullet = prefabDef.create();
            let faceup = this.getFaceup();
            parent.addChild(bullet);
            if (faceup > 0) {
                bullet.x = x + 110;
            } else if (faceup < 0) {
                bullet.x = x - 40;
            }
            bullet.y = y + 30;
            EventMgr.getInstance().postEvent(Events.Bullet_Shoot, {x: this.getFaceup(), y: 0, bulletType: bulletType, owner: bullet});
        }));
    }

    onRoleCButton() {
        if (this.isHurting) {
            return;
        }
        if (this.shuiguanState == 1) {
            this.shuiguanState = 0;
            Laya.Scene.open("scene/LevelX.scene");
        } else if (this.shuiguanState == 2) {
            this.shuiguanState = 0;
            Laya.Scene.open("scene/Level1_1.scene");
        }
    }

    getFaceup() {
        if (this.roleSpr.scaleX > 0) {
            return 1
        }
        return -1;
    }

    onDisable() {
        GameContext.role = null;
    }
}