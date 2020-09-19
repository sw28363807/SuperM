import GameContext from "../GameContext";

export default class BlackBoxLogic extends Laya.Script {

    constructor() { 
        super();
    }
    
    onEnable() {
        this.owner.goldLabel = this.owner.getChildByName("goldLabel");
        this.owner.roleLabel = this.owner.getChildByName("roleLabel");
        this.owner.fenLabel = this.owner.getChildByName("fenLabel");
        this.owner.goldLabel.text = "x"+String( GameContext.gameGoldNumber);
        this.owner.roleLabel.text = "x"+String(GameContext.gameRoleNumber);
        this.owner.fenLabel.text = "x"+String(GameContext.roleFen);
    }

    onDisable() {
    }
}