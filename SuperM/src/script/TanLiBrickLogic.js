import Events from "./Events";
import EventMgr from "./EventMgr";

export default class TanLiBrickLogic extends Laya.Script {

    constructor() { 
        super(); 
    }

    onTriggerEnter(other, self, contact) {
        if (other && other.label == "RoleFoot" ) {
            let tanli = null;
            if (contact.m_fixtureA.collider.label == "TanLiBrick") {
                tanli = contact.m_nodeA;
            } else if (contact.m_fixtureB.collider.label == "TanLiBrick") {
                tanli = contact.m_nodeB;
            }
            if (tanli && tanli.contact.m_manifold.localNormal.y < 0) {
                EventMgr.getInstance().postEvent(Events.Role_Give_Speed, {x: 0, y: -800});
            }
        }
    }
    
    onEnable() {
    }

    onDisable() {
    }
}