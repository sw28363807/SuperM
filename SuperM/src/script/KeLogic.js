import EventMgr from "./EventMgr";
import Events from "./Events";

export default class KeLogic extends Laya.Script {

    constructor() { 
        super();
    }
    
    onEnable() {
        EventMgr.getInstance().registEvent(Events.Role_Shoot_Ke, this, this.onRoleShootKe);
    }

    onDisable() {
    }

    onRoleShootKe(data) {
        console.debug("+++++++++++++++++++");
    }
}