export default class JoyStick extends Laya.Script {

    constructor() { 
        super();
    }
    
    onEnable() {
        
        this.d1 = this.owner.getChildByName("1");
        this.d2 = this.owner.getChildByName("2");
        this.d3 = this.owner.getChildByName("3");
        this.d4 = this.owner.getChildByName("4");
        this.d5 = this.owner.getChildByName("5");
        this.d6 = this.owner.getChildByName("6");
        this.d7 = this.owner.getChildByName("7");
        this.d8 = this.owner.getChildByName("8");

        this.p1 = {x: this.d1.x, y: this.d1.y};
        this.p2 = {x: this.d2.x, y: this.d2.y};
        this.p3 = {x: this.d3.x, y: this.d3.y};
        this.p4 = {x: this.d4.x, y: this.d4.y};
        this.p5 = {x: this.d5.x, y: this.d5.y};
        this.p6 = {x: this.d6.x, y: this.d6.y};
        this.p7 = {x: this.d7.x, y: this.d7.y};
        this.p8 = {x: this.d8.x, y: this.d8.y};

        this.touch = this.owner.getChildByName("touch");
        this.canCommand = false;
        this.startPoint = null;
        this.center = this.owner.getChildByName("center");
        let temp = this.owner.getChildByName("centerPos");
        this.centerPos = {x: temp.x, y: temp.x};

        this.touch.on(Laya.Event.MOUSE_DOWN, this, function(e) {
            if(this.canCommand == false) {
                this.canCommand = true;
                this.startPoint = {x: e.stageX, y: e.stageY};
                console.debug(e);
            }
        });

        this.touch.on(Laya.Event.MOUSE_MOVE, this, function(e) {
            if(this.canCommand) {
                let x = e.stageX;
                let y = e.stageY;
                let p = this.owner.globalToLocal(new Laya.Point(x, y));
                this.center.x = p.x;
                this.center.y = p.y;
            }
        });

        this.touch.on(Laya.Event.MOUSE_UP, this, function(e) {
            if(this.canCommand) {
                this.center.x = this.centerPos.x;
                this.center.y = this.centerPos.y;
                this.canCommand = false;
            }
        });

        this.touch.on(Laya.Event.MOUSE_OUT, this, function(e) {
        });
    }

    onDisable() {

    }
}