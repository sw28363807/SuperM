import EventMgr from "./EventMgr";
import Events from "./Events";

export default class Role extends Laya.Script {

    constructor() { 
        super();
        this.walkDirect = null;
        this.commandWalk = false;
        this.speed = 9;
        this.jumpSpeed = 35;
        this.isInGround = false;
        this.hasBullet = false;
    }
    
    onEnable() {
        EventMgr.getInstance().registEvent(Events.Role_Move, this, this.onRoleWalk);
        EventMgr.getInstance().registEvent(Events.Role_Move_Stop, this, this.onRoleStopWalk);
        EventMgr.getInstance().registEvent(Events.Role_A_Button, this, this.onRoleAButton);
        EventMgr.getInstance().registEvent(Events.Role_B_Button, this, this.onRoleBButton);
        EventMgr.getInstance().registEvent(Events.Role_Give_Speed, this, this.onRoleGiveSpeed);
        EventMgr.getInstance().registEvent(Events.Role_Has_Bullet, this, this.onRoleHasBullet);
        // let a = new Laya.RigidBody();
        // a.linearVelocity
        this.rigidBody = this.owner.getComponent(Laya.RigidBody);
        this.roleSpr = this.owner.getChildByName("roleSpr");
    }

    setMove(px, py) {
        this.rigidBody.setVelocity({x: px, y: py});
    }

    onRoleWalk(data) {
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
        }
    }

    onUpdate() {
        this.processFaceUp();
    }

    processRoleWalk() {
        if (this.walkDirect && this.walkDirect.x != 0) {
            let linearVelocity = this.rigidBody.linearVelocity;
            this.setMove(this.walkDirect.x * this.speed, linearVelocity.y);
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
        if (contact.m_fixtureA.collider.label == "RoleFoot") {
            foot = contact.m_nodeA;
        } else if (contact.m_fixtureB.collider.label == "RoleFoot") {
            foot = contact.m_nodeB;
        }
        if (foot && foot.contact.m_manifold.localNormal.y < 0 && other.label != "TanLiBrick") {
            this.isInGround = true;
            if (this.commandWalk == false) {
                this.setMove(0, 0);
            }
        }
    }

    onRoleAButton() {
        if (this.isInGround == true) {
            this.isInGround = false;
            this.rigidBody.applyLinearImpulseToCenter({x: 0, y: -800});
        }
    }

    onRoleGiveSpeed(speedData) {
        this.isInGround = false;
        this.rigidBody.applyLinearImpulseToCenter(speedData);
    }

    onRoleHasBullet() {
        this.hasBullet = true;
    }

    onRoleBButton() {

    }

    onDisable() {

    }
}