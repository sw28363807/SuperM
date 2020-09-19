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
        EventMgr.getInstance().registEvent(Events.Refresh_Fen_Number, this, this.onRefreshFen);

        this.goldLabel = this.owner.getChildByName("goldLabel");
        this.roleLabel = this.owner.getChildByName("roleLabel");
        this.fenLabel = this.owner.getChildByName("fenLabel");
        this.oRefreshGold();
        this.onRefreshRole();
        this.onRefreshFen();

        let rank = this.owner.getChildByName("rank");
        rank.on(Laya.Event.CLICK, this, function() {
            Laya.Scene.open("scene/RankScene.scene", false);
        });
    }

    oRefreshGold() {
        this.goldLabel.text = "x"+String( GameContext.gameGoldNumber);
    }

    onRefreshRole() {
        this.roleLabel.text = "x" + String(GameContext.gameRoleNumber);
    }

    onRefreshFen() {
        this.fenLabel.text = "x" + String(GameContext.roleFen);
    }

    onDisable() {
        EventMgr.getInstance().removeEvent(Events.Refresh_Gold_Number, this, this.oRefreshGold);
        EventMgr.getInstance().removeEvent(Events.Refresh_Role_Number, this, this.onRefreshRole);
        EventMgr.getInstance().removeEvent(Events.Refresh_Fen_Number, this, this.onRefreshFen);
    }
}