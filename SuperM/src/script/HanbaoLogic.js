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
        this.direct = {x: -1, y: 0};
        this.owner.play(0, false, "ani1");
        this.rigidBody = this.owner.getComponent(Laya.RigidBody);
        this.rigidBody.enabled = false;
        this.owner.on(Laya.Event.COMPLETE, this, function(){
            this.rigidBody.enabled = true;
            this.owner.play(0, false, "ani2");
        });
        console.debug(this.owner.getComponents(Laya.ColliderBase));
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
                    EventMgr.getInstance().postEvent(Events.Role_Change_Big);
                } else if (GameContext.gameRoleBodyState == 1) {
                    if (GameContext.gameRoleState == 0) {
                        EventMgr.getInstance().postEvent(Events.Role_Has_Bullet);
                    }
                }
                Utils.removeThis(this.owner);
                return;
            }
        }
        this.rigidBody.setVelocity({x: this.direct.x * this.speed, y: 0}); 
    }

    onUpdate() {
        let linearVelocity = this.rigidBody.linearVelocity;
        this.rigidBody.setVelocity({x: this.direct.x * this.speed, y: linearVelocity.y});
    }


    onDisable() {
    
    }
}