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
            this.direct = {x: -1, y: 0};
        } else {
            this.direct = {x: 0, y: 0};
        }

        let aniA = "ani1";
        let aniB = "ani2";
        if (GameContext.gameRoleBodyState == 0) {
        } else {
            aniA = "ani11";
            aniB = "ani22";
        }
        this.owner.play(0, false, aniA);
        this.rigidBody = this.owner.getComponent(Laya.RigidBody);
        this.rigidBody.enabled = false;
        this.owner.on(Laya.Event.COMPLETE, this, function(){
            this.rigidBody.enabled = true;
            this.owner.play(0, false, aniB);
        });
    }

    onTriggerEnter(other, self, contact) {
        this.direct.x = -1 * Utils.getSign(this.direct.x);
        if (other && other.label == "RoleHead" || 
        other.label == "RoleFoot" ||
         other.label == "RoleBody") {
            let reward = null;
            if (contact.m_fixtureA.collider.label == "Reward") {
                reward = contact.m_nodeA;
            } else if (contact.m_fixtureB.collider.label == "Reward") {
                reward = contact.m_nodeB;
            }
            if (reward) {
                if (GameContext.gameRoleBodyState == 0) {
                    GameContext.setBodyState(1);
                    EventMgr.getInstance().postEvent(Events.Role_Change_Big);
                } else if (GameContext.gameRoleBodyState == 1) {
                    EventMgr.getInstance().postEvent(Events.Role_Has_Bullet);
                }
                console.debug("---------------------");
                console.debug(GameContext.gameRoleBodyState);
                console.debug(GameContext.gameRoleState);
                console.debug("----------------------");
                Utils.removeThis(this.owner);
                return;
            }
        }
        if (GameContext.gameRoleBodyState == 0) {
            this.rigidBody.setVelocity({x: this.direct.x * this.speed, y: 0}); 
        }
    }

    onUpdate() {
        if (GameContext.gameRoleBodyState == 0) {
            let linearVelocity = this.rigidBody.linearVelocity;
            this.rigidBody.setVelocity({x: this.direct.x * this.speed, y: linearVelocity.y});    
        }
    }


    onDisable() {
    
    }
}