import GameContext from "../GameContext";

export default class Camera extends Laya.Script {

    constructor() { 
        super();
    }

    lookAt(x, y) {
        // let width = Laya.Browser.width;
        // let widthScale = width/1336;
        // console.debug(widthScale);
        // let OffX = 1000;
        // if (x >= GameContext.mapMaxX) {
        //     GameContext.mapMaxX = x;
        // }
        // if (x < GameContext.mapMaxX - OffX) {
        //     GameContext.setRolePositionX(GameContext.mapMaxX - OffX);
        // }
        let curX = 1136/2.3 - x;
        if (!GameContext.isDie && !GameContext.isWin ) {
            this.owner.x = curX;
        }
        // this.owner.y = this.owner.y
        // let rp = this.role.parent.localToGlobal(new Laya.Point(this.role.x, this.role.y));
        if (this.role.y < 300) {
            this.owner.y = this.standY - (this.role.y - 300);
        } else {
            this.owner.y =  this.standY;
        }
        
    }

    onUpdate() {
        if (this.role) {
            this.lookAt(this.role.x, this.role.y);
        }
    }
    
    onEnable() {
        this.zeroY = 0;
        this.role =  this.owner.getChildByName("Role");
        GameContext.mapMaxX = this.role.x;
        if (GameContext.initRolePoint && this.owner.name == "gameScene") {
            this.role.x = GameContext.initRolePoint.x;
            this.role.y = GameContext.initRolePoint.y;
        }
        let w =  Laya.Browser.width;
        let h =  Laya.Browser.height;
        Laya.Physics.I.positionIterations = 3;
        Laya.Physics.I.worldRoot = this.owner;
        this.zeroY = 250;
        if(w/h > 2.0) {
            this.zeroY = 160;
        }
        this.standY = 750/2.3 - 660 + this.zeroY;
    }

    onDisable() {
    }
}