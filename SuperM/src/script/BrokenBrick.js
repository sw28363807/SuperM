export default class BrokenBrick extends Laya.Script {

    constructor() { 
        super();
    }
    
    onEnable() {
        Laya.timer.once(1000, this, function() {
            this.owner.removeSelf();
        })
    }

    onDisable() {
        Laya.timer.clearAll(this);
    }
}