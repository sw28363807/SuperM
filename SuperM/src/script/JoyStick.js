import GameContext from "../GameContext";

export default class JoyStick extends Laya.Script {

    constructor() { 
        super();
        this.direct = null;
        GameContext.joyStickDirect = null;
        this.directChangeHandler = null;
        this.stopHandler = null;
        this.canCommand = false;
        this.startPoint = null;
        this.dirMap = [
            {x: -1, y: -1},
            {x: 0, y: -1},
            {x: 1, y: -1},
            {x: 1, y: 0},
            {x: 1, y: 1},
            {x: 0, y: 1},
            {x: -1, y: 1},
            {x: -1, y: 0}
        ];

        if (!Laya.Browser.onMiniGame) {
            this.A = 65;
            this.S = 83;
            this.W = 87;
            this.D = 68;
    
            this.ADown = false;
            this.SDown = false;
            this.WDown = false;
            this.DDown = false;

            this.isStopWalk = false;
        }
    }

    onAwake() {
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
        this.center = this.owner.getChildByName("center");
        let temp = this.owner.getChildByName("centerPos");
        this.centerPos = {x: temp.x, y: temp.x};

        this.touch.on(Laya.Event.MOUSE_DOWN, this, function(e) {
            this.touchId = e.touchId;
            if(this.canCommand == false) {
                this.canCommand = true;
                this.startPoint = {x: e.stageX, y: e.stageY};
            }
            this.direct = null;
            GameContext.joyStickDirect = null;
        });

        this.touch.on(Laya.Event.MOUSE_MOVE, this, function(e) {
            if(this.canCommand && this.touchId == e.touchId) {
                let x = e.stageX;
                let y = e.stageY;
                let p = this.owner.globalToLocal(new Laya.Point(x, y));
                let curX = p.x;
                let curY = p.y;

                let minX = p.x - this.centerPos.x;
                let miny = p.y - this.centerPos.y;
                if(curX < 0) {
                    curX = 0;
                }
                if(curX > 200) {
                    curX = 200;
                }
                if(curY < 0) {
                    curY = 0;
                }
                if(curY > 200) {
                    curY = 200;
                }
                this.center.x = curX;
                this.center.y = curY;
                if (Math.sqrt(minX*minX + miny * miny) > 5) {
                    let direct = this.processDirect(this.center.x, this.center.y);
                    if(direct != this.direct) {
                        this.direct = direct;
                        GameContext.joyStickDirect = direct;
                        if(this.directChangeHandler) {
                            let name =  this.direct.name;
                            let dir = this.dirMap[Number(name)];
                            this.directChangeHandler.runWith(this.dirMap[Number(name) - 1]);
                        }
                    }
                } else {
                    if(this.touchId == e.touchId) {
                        if(this.stopHandler) {
                            this.stopHandler.run();
                        }
                        this.direct = null;
                        GameContext.joyStickDirect = null;
                    }
                }
            }
        });
        
        this.touch.on(Laya.Event.MOUSE_UP, this, function(e) {
            if(this.canCommand && this.touchId == e.touchId) {                
                this.center.x = this.centerPos.x;
                this.center.y = this.centerPos.y;
                this.canCommand = false;
                if(this.stopHandler) {
                    this.stopHandler.run();
                }
                this.direct = null;
                GameContext.joyStickDirect = null;
            }
        });

        this.touch.on(Laya.Event.MOUSE_OUT, this, function(e) {
            if(this.canCommand && this.touchId == e.touchId) {                
                this.center.x = this.centerPos.x;
                this.center.y = this.centerPos.y;
                this.canCommand = false;
                this.startPoint = null;
                if(this.stopHandler) {
                    this.stopHandler.run();
                }
                this.direct = null;
                GameContext.joyStickDirect = null;
            }
        });
    }
    
    onEnable() {
        if (!Laya.Browser.onMiniGame) {
            Laya.stage.on(Laya.Event.KEY_DOWN, this, this.onKeyDown);
            Laya.stage.on(Laya.Event.KEY_UP, this, this.onKeyUp);
        }
    }

    onKeyDown(e) {
        let keyCode = e.keyCode;
        if (keyCode == this.A) {
            this.ADown = true;
        } else if (keyCode == this.S) {
            this.SDown = true;
        } else if (keyCode == this.W) {
            this.WDown = true;
        } else if (keyCode == this.D) {
            this.DDown = true;
        }
    }

    onKeyUp(e) {
        let keyCode = e.keyCode;
        if (keyCode == this.A) {
            this.ADown = false;
        } else if (keyCode == this.S) {
            this.SDown = false;
        } else if (keyCode == this.W) {
            this.WDown = false;
        } else if (keyCode == this.D) {
            this.DDown = false;
        }
    }

    processDirect(curX, curY) {
        let d1 = this.getDistance(curX, curY, this.p1);
        let d2 = this.getDistance(curX, curY, this.p2);
        let d3 = this.getDistance(curX, curY, this.p3);
        let d4 = this.getDistance(curX, curY, this.p4);
        let d5 = this.getDistance(curX, curY, this.p5);
        let d6 = this.getDistance(curX, curY, this.p6);
        let d7 = this.getDistance(curX, curY, this.p7);
        let d8 = this.getDistance(curX, curY, this.p8);
        let d = 9999999;
        let r = null;
        if(d1 < d) {
            d = d1;
            r = this.d1;
        }
        if(d2 < d) {
            d = d2;
            r = this.d2;
        }
        if(d3 < d) {
            d = d3;
            r = this.d3;
        }
        if(d4 < d) {
            d = d4;
            r = this.d4;
        }
        if(d5 < d) {
            d = d5;
            r = this.d5;
        }
        if(d6 < d) {
            d = d6;
            r = this.d6;
        }
        if(d7 < d) {
            d = d7;
            r = this.d7;
        }
        if(d8 < d) {
            d = d8;
            r = this.d8;
        }
        return r
    }

    getDistance(x, y, p) {
        let dx = x - p.x;
        let dy = y - p.y;
        return Math.sqrt(dx*dx + dy*dy);
    }

    setHandler(directChangeHandler, stopHandler) {
        this.directChangeHandler = directChangeHandler;
        this.stopHandler = stopHandler;
    }

    onDisable() {

    }

    onUpdate() {
        if (!Laya.Browser.onMiniGame) {
            let direct = null;
            if (this.WDown == true && this.ADown == false && this.SDown == false && this.DDown == false) {
                //上
                direct = {x: 0, y: -1};
                this.isStopWalk = false;
            } else if (this.WDown == false && this.ADown == false && this.SDown == true && this.DDown == false) {
                //下
                direct = {x: 0, y: 1};
                this.isStopWalk = false;
            } else if (this.WDown == false && this.ADown == true && this.SDown == false && this.DDown == false) {
                //左
                direct = {x: -1, y: 0};
                this.isStopWalk = false;
            } else if (this.WDown == false && this.ADown == false && this.SDown == false && this.DDown == true) {
                //右
                direct = {x: 1, y: 0};
                this.isStopWalk = false;
            } else if (this.WDown == true && this.ADown == true && this.SDown == false && this.DDown == false) {
                //左上
                direct = {x: -1, y: -1};
                this.isStopWalk = false;
            } else if (this.WDown == true && this.ADown == false && this.SDown == false && this.DDown == true) {
                //右上
                direct = {x: 1, y: -1};
                this.isStopWalk = false;
            } else if (this.WDown == false && this.ADown == true && this.SDown == true && this.DDown == false) {
                //左下
                direct = {x: -1, y: 1};
                this.isStopWalk = false;
            } else if (this.WDown == false && this.ADown == false && this.SDown == true && this.DDown == true) {
                //右下
                direct = {x: 1, y: 1};
                this.isStopWalk = false;
            }
            if(this.directChangeHandler) {
                this.directChangeHandler.runWith(direct);
            }

            if (this.WDown == false && this.ADown == false && this.SDown == false && this.DDown == false) {
                if(this.stopHandler) {
                    this.stopHandler.run();
                }
                this.direct = null;
                GameContext.joyStickDirect = null;
            }
        }
    }
}