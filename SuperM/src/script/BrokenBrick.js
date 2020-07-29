export default class BrokenBrick extends Laya.Script {

    constructor() { 
        super();
    }
    
    onEnable() {
        Laya.timer.once(700, this, function() {
            this.owner.removeSelf();
        })
    }

    onDisable() {
        Laya.timer.clearAll(this);
    }
}