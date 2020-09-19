export default class RankSceneLogic extends Laya.Script {

    constructor() { 
        super();
    }
    
    onEnable() {
    }

    onDisable() {
    }

    onStart() {
        let closeBtn =  this.owner.getChildByName("close");
        closeBtn.on(Laya.Event.CLICK, this, function() {
            this.owner.close();
        });
    }
}