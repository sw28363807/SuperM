import EventMgr from "./EventMgr";
import Events from "./Events";
import GameContext from "../GameContext";

export default class KeLogic extends Laya.Script {

    constructor() { 
        super();
    }
    
    onEnable() {
        EventMgr.getInstance().registEvent(Events.Role_Get_Ke, this, this.onRoleGetKe);
    }

    onDisable() {
    }

    onRoleGetKe(data) {
        this.owner.removeSelf();
    }
}