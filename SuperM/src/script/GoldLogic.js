import EventMgr from "./EventMgr";
import Events from "./Events";
import GameContext from "../GameContext";
import Utils from "./Utils";

export default class GoldLogic extends Laya.Script {

    constructor() {
        super();
    }

    onTriggerEnter(other, self, contact) {
        if (other && other.label == "RoleHead" || other.label == "RoleFoot" || other.label == "RoleBody" ) {
            let gold = null;
            if (contact.m_fixtureA.collider.label == "Gold") {
                gold = contact.m_nodeA;
            } else if (contact.m_fixtureB.collider.label == "Gold") {
                gold = contact.m_nodeB;
            }
            if (gold) {
                Utils.removeThis(this.owner);
                GameContext.gameGoldNumber++;
                EventMgr.getInstance().postEvent(Events.Refresh_Gold_Number);
            }
        }
    }
    
    onEnable() {
    }

    onDisable() {
    }
}