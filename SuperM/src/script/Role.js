import EventMgr from "./EventMgr";
import Events from "./Events";

export default class Role extends Laya.Script {

    constructor() { 
        super();
        this.walkDirect = null;
        this.speed = 12;
        this.jumpSpeed = 20;
    }
    
    onEnable() {
        EventMgr.getInstance().registEvent(Events.Role_Move, this, this.onRoleWalk);
        EventMgr.getInstance().registEvent(Events.Role_Move_Stop, this, this.onRoleStopWalk);
        EventMgr.getInstance().registEvent(Events.Role_A_Button, this, this.onRoleAButton);
        EventMgr.getInstance().registEvent(Events.Role_B_Button, this, this.onRoleBButton);
        // let a = new Laya.RigidBody();
        // a.linearVelocity
        this.rigidBody = this.owner.getComponent(Laya.RigidBody);
        this.roleSpr = this.owner.getChildByName("roleSpr");
    }

    setMove(px, py) {
        this.rigidBody.setVelocity({x: px, y: py});
    }

    onRoleWalk(data) {
        this.walkDirect = data;
        this.processRoleWalk();
    }

    onRoleStopWalk() {
        this.walkDirect = {x: 0, y: 0};
        this.setMove(0, 0);
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

    onRoleAButton() {
        let linearVelocity = this.rigidBody.linearVelocity;
        this.setMove(linearVelocity.x, -this.jumpSpeed);
    }

    onRoleBButton() {

    }

    onDisable() {

    }
}