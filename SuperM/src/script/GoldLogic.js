export default class GoldLogic extends Laya.Script {

    constructor() {
        super();
    }

    onTriggerEnter(other, self, contact) {
        if (other && other.label == "RoleHead" || other.label == "RoleFoot" ) {
            let gold = null;
            if (contact.m_fixtureA.collider.label == "Gold") {
                gold = contact.m_nodeA;
            } else if (contact.m_fixtureB.collider.label == "Gold") {
                gold = contact.m_nodeB;
            }
            if (gold) {
                this.owner.removeSelf();
            }
        }
    }
    
    onEnable() {
    }

    onDisable() {
    }
}