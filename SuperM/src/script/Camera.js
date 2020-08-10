import GameContext from "../GameContext";

export default class Camera extends Laya.Script {

    constructor() { 
        super();
        this.zeroY = 0;
    }

    lookAt(x, y) {
        // let width = Laya.Browser.width;
        // let widthScale = width/1336;
        // console.debug(widthScale);
        if (!GameContext.isDie && !GameContext.isWin ) {
            this.owner.x = 1136/2 - x;
        }
        // this.owner.y = this.owner.y
        this.owner.y =  750/2.3 - 660 + this.zeroY;
    }

    onUpdate() {
        if (this.role) {
            this.lookAt(this.role.x, this.role.y);
        }
    }
    
    onEnable() {
        this.role =  this.owner.getChildByName("Role");
        if (GameContext.initRolePoint && this.owner.name == "gameScene") {
            this.role.x = GameContext.initRolePoint.x;
            this.role.y = GameContext.initRolePoint.y;
        }
        GameContext.initRolePoint
        let w =  Laya.Browser.width;
        let h =  Laya.Browser.height;
        Laya.Physics.I.positionIterations = 3;
        Laya.Physics.I.worldRoot = this.owner;
        this.zeroY = 250;
        if(w/h > 2.0) {
            this.zeroY = 160; 
        }
        Laya.Physics.I.worldRoot.y = this.zeroY;
    }

    onDisable() {
    }
}