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
            if (Laya.LocalStorage.support) {
                let fen = Laya.LocalStorage.getItem("fen");
                console.log("当前的分数是: " + String(fen));
                if (fen == undefined || fen == null || fen == "") {
                    console.log("不存在最高分:" + String(GameContext.maxRoleFen));
                    openView.postMsg({fen: GameContext.maxRoleFen, key: GameContext.nickName});
                } else {
                    if (GameContext.maxRoleFen > Number(fen)) {
                        console.log("存在最高分, 且当前最高分比以前的高: " + String(GameContext.maxRoleFen));
                        openView.postMsg({fen: GameContext.maxRoleFen, key: GameContext.nickName});
                    } else {
                        console.log("没处理");
                        openView.postMsg({fen: Number(fen), key: GameContext.nickName});
                    }
                }
            }
            
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