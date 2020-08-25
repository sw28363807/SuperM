export default class JoyStickButton extends Laya.Script {

    constructor() { 
        super();
    }

    onAwake() {
        this.buttonA = this.owner.getChildByName("A");
        this.buttonB = this.owner.getChildByName("B");
        this.buttonC = this.owner.getChildByName("C");
    }
    
    onEnable() {
        this.buttonA.on(Laya.Event.MOUSE_DOWN, this, function(){
            if(this.aHandler) {
                this.aHandler.run();
            }
        });

        this.buttonB.on(Laya.Event.MOUSE_DOWN, this, function(){
            if(this.bHandler) {
                this.bHandler.run();
            }
        });

        this.buttonC.on(Laya.Event.MOUSE_DOWN, this, function(){
            if(this.cHandler) {
                this.cHandler.runWith("down");
            }
        });

        this.buttonC.on(Laya.Event.MOUSE_UP, this, function(){
            if(this.cHandler) {
                this.cHandler.runWith("up");
            }
        });

        this.buttonC.on(Laya.Event.MOUSE_OUT, this, function(){
            if(this.cHandler) {
                this.cHandler.runWith("up");
            }
        });
    }

    setHandler(handlerA, handlerB, handlerC) {
        this.aHandler = handlerA;
        this.bHandler = handlerB;
        this.cHandler = handlerC;
    }

    onDisable() {
    }
}