import EventMgr from "./EventMgr";
import Events from "./Events";
import GameContext from "../GameContext";
import Utils from "./Utils";

export default class HanbaoLogic extends Laya.Script {

    constructor() { 
        super();
        this.speed = 5;
    }
    
    onEnable() {
        if (GameContext.gameRoleBodyState == 0) {
            this.owner.direct = {x: -1, y: 0};
        } else {
            this.owner.direct = {x: 0, y: 0};
        }
        this.owner.directTime = 0;
        this.owner.isMove = true;
        let aniA = "ani1";
        let aniB = "ani2";
        if (GameContext.gameRoleBodyState == 0) {
        } else {
            aniA = "ani11";
            aniB = "ani22";
            this.owner.isMove = false;
        }
        this.owner.play(0, false, aniA);
        this.owner.rigidBody = this.owner.getComponent(Laya.RigidBody);
        this.owner.rigidBody.enabled = false;
        this.owner.coll = this.owner.getComponent(Laya.ColliderBase);;
        this.owner.on(Laya.Event.COMPLETE, this, function(){
            this.owner.rigidBody.enabled = true;
            this.owner.play(0, false, aniB);
        });
    }

    onTriggerEnter(other, self, contact) {
        if (other.label == "AITop" || other.label == "AIBottom" || other.label == "AILeft" || other.label == "AIRight") {
            return;
        }
        if (other && other.label == "Hole") {
            this.owner.coll.isSensor = true;
            let owner = this.owner;
            this.owner.isMove = false;
            Laya.timer.once(2000, null, function() {
                Utils.removeThis(owner);
            });
            return;
        } else if (other && other.label == "RoleHead" || 
        other.label == "RoleFoot" ||
         other.label == "RoleBody") {
            if (GameContext.gameRoleBodyState == 0) {
                GameContext.setBodyState(1);
                EventMgr.getInstance().postEvent(Events.Role_Change_Big);
            } else if (GameContext.gameRoleBodyState == 1) {
                // EventMgr.getInstance().postEvent(Events.Role_Has_Bullet);
            }
            Utils.removeThis(this.owner);
            Laya.Resource
            return;
        }
        if (other.label != "Ground") {
            if (this.owner.directTime > 50) {
                this.owner.direct.x = -1 * Utils.getSign(this.owner.direct.x);
                this.owner.directTime = 0;
            }
        }
        if (this.owner.isMove == true) {
            this.owner.rigidBody.setVelocity({x: this.owner.direct.x * this.speed, y: 0}); 
        }
    }

    onUpdate() {
        if (this.owner.isMove == true) {
            this.owner.directTime++;
            this.owner.zOrder = 655351;
            let linearVelocity = this.owner.rigidBody.linearVelocity;
            this.owner.rigidBody.setVelocity({x: this.owner.direct.x * this.speed, y: linearVelocity.y});   
        }
    }


    onDisable() {
    
    }
}