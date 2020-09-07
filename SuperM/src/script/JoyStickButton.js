export default class JoyStickButton extends Laya.Script {

    constructor() { 
        super();
    }

    onAwake() {
        this.buttonA = this.owner.getChildByName("A");
        this.buttonB = this.owner.getChildByName("B");
        this.buttonC = this.owner.getChildByName("C");

        if (!Laya.Browser.onMiniGame) {
            this.J = 74;
            this.K = 75;
            this.L = 76;
    
            this.JDown = false;
            this.KDown = false;
            this.LDown = false;
        }
    }

    onKeyDown(e) {
        let keyCode = e.keyCode;
        if (keyCode == this.J) {
            if (this.JDown == false) {
                if(this.aHandler) {
                    this.aHandler.run();
                }
            }
            this.JDown = true;
        } else if (keyCode == this.K) {
            if (this.KDown == false) {
                if(this.bHandler) {
                    this.bHandler.run();
                }
            }
            this.KDown = true;
        } else if (keyCode == this.L) {
            if (this.LDown == false) {
                if(this.cHandler) {
                    this.cHandler.run();
                }
            }
            this.LDown = true;
        }
    }

    onKeyUp(e) {
        let keyCode = e.keyCode;
        if (keyCode == this.J) {
            this.JDown = false;
        } else if (keyCode == this.K) {
            this.KDown = false;
        } else if (keyCode == this.L) {
            this.LDown = false;
        }
    }
    
    onEnable() {
        if (!Laya.Browser.onMiniGame) {
            Laya.stage.on(Laya.Event.KEY_DOWN, this, this.onKeyDown);
            Laya.stage.on(Laya.Event.KEY_UP, this, this.onKeyUp);
        }

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