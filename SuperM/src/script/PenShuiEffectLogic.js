import Utils from "./Utils";

export default class PenShuiEffectLogic extends Laya.Script {

    constructor() { 
        super();
    }
    
    onEnable() {
    }

    onDisable() {
    }

    onStart() {
        Laya.timer.once(500, this, function() {
            Utils.removeThis(this.owner);
        });
    }
}