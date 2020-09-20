import GameContext from "../GameContext";

export default class RankSceneLogic extends Laya.Script {

    constructor() { 
        super();
    }
    
    onEnable() {
    }

    onDisable() {
    }

    onStart() {
        if (Laya.Browser.onMiniGame) {
            let openView = this.owner.getChildByName("open");
            openView.postMsg({fen: GameContext.roleFen, key: GameContext.nickName});
        }
        let closeBtn1 =  this.owner.getChildByName("close1");
        closeBtn1.on(Laya.Event.CLICK, this, function() {
            this.owner.close();
        });

        let closeBtn2 =  this.owner.getChildByName("close2");
        closeBtn2.on(Laya.Event.CLICK, this, function() {
            this.owner.close();
        });
    }
}