import GameContext from "../GameContext";
import EventMgr from "./EventMgr";
import Events from "./Events";

export default class GameTopLogic extends Laya.Script {

    constructor() { 
        super();
    }
    
    onEnable() {
        EventMgr.getInstance().registEvent(Events.Refresh_Gold_Number, this, this.oRefreshGold);
        EventMgr.getInstance().registEvent(Events.Refresh_Role_Number, this, this.onRefreshRole);

        this.goldLabel = this.owner.getChildByName("goldLabel");
        this.roleLabel = this.owner.getChildByName("roleLabel");
        this.oRefreshGold();
        this.onRefreshRole();
    }

    oRefreshGold() {
        this.goldLabel.text = "x"+String( GameContext.gameGoldNumber);
    }

    onRefreshRole() {
        this.roleLabel.text = "x" + String(GameContext.gameRoleNumber);
    }

    onDisable() {
    }
}