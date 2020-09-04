export default class DisBrickLogic extends Laya.Script {

    constructor() { 
        super(); 
    }
    
    onEnable() {
    }

    onStart() {
        this.owner.aniRender = this.owner.getChildByName("render");
        this.owner.aniRender.play(0, true , "ani1");
    }

    onDisable() {
        Laya.timer.clear(this, this.onDisBrick);
    }

    onTriggerEnter(other, self, contact) {
        if (!this.owner) {
            return;
        }
        if (other.label == "RoleFoot") {
            this.owner.aniRender.play(0, true , "ani2");
            Laya.timer.once(500,  this, this.onDisBrick);
        }
    }

    onDisBrick() {
        Laya.timer.clear(this, this.onDisBrick);
        let coll = this.owner.getComponent(Laya.ColliderBase);
        coll.isSensor = true;
        Laya.timer.once(1000,  this, function() {
            this.owner.aniRender.play(0, true , "ani1");
            coll.isSensor = false;
        });
    }
}