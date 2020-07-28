import EventMgr from "./EventMgr";
import Events from "./Events";

export default class HanbaoLogic extends Laya.Script {

    constructor() { 
        super();
    }
    
    onEnable() {
        this.owner.play(0, false, "ani1");
        let rigidBody = this.owner.getComponent(Laya.RigidBody);
        rigidBody.enabled = false;
        this.owner.on(Laya.Event.COMPLETE, this, function(){
            rigidBody.enabled = true;
            this.owner.play(0, false, "ani2");
        });
    }

    onTriggerEnter(other, self, contact) {
        if (other && other.label == "RoleHead" || other.label == "RoleFoot") {
            let reward = null;
            if (contact.m_fixtureA.collider.label == "Reward") {
                reward = contact.m_nodeA;
            } else if (contact.m_fixtureB.collider.label == "Reward") {
                reward = contact.m_nodeB;
            }
            if (reward) {
                EventMgr.getInstance().postEvent(Events.Role_Has_Bullet);
                this.owner.removeSelf();
            }
        }
    }



    onDisable() {
    }
}