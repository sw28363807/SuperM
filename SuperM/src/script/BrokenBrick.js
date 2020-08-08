import Utils from "./Utils";

export default class BrokenBrick extends Laya.Script {

    constructor() { 
        super();
    }
    
    onEnable() {
        Laya.timer.once(1000, this, function() {
            Utils.removeThis(this.owner);
        })
    }

    onDisable() {
        Laya.timer.clearAll(this);
    }
}