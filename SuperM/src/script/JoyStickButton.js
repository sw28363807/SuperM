export default class JoyStickButton extends Laya.Script {

    constructor() { 
        super();
    }
    
    onEnable() {
        this.buttonA = this.owner.getChildByName("A");
        this.buttonB = this.owner.getChildByName("B");
        this.aHandler = null;
        this.bHandler = null;
        this.buttonA.on(Laya.Event.CLICK, this, function(){
            if(this.aHandler) {
                this.aHandler.run();
            }
        });

        this.buttonB.on(Laya.Event.CLICK, this, function(){
            if(this.bHandler) {
                this.bHandler.run();
            }
        });
    }

    setFunc(handlerA, handlerB) {
        this.aHandler = handlerA;
        this.bHandler = handlerB;
    }

    onDisable() {
    }
}