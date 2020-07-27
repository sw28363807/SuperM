export default class JoyStickButton extends Laya.Script {

    constructor() { 
        super();
    }

    onAwake() {
        this.buttonA = this.owner.getChildByName("A");
        this.buttonB = this.owner.getChildByName("B");
    }
    
    onEnable() {
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

    setHandler(handlerA, handlerB) {
        this.aHandler = handlerA;
        this.bHandler = handlerB;
    }

    onDisable() {
    }
}