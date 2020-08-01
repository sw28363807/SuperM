export default class Camera extends Laya.Script {

    constructor() { 
        super();
        this.zeroY = 0;
    }

    lookAt(x, y) {
        // let width = Laya.Browser.width;
        // let widthScale = width/1336;
        // console.debug(widthScale);
        this.owner.x = 1136/2 - x;
        // this.owner.y = this.owner.y
        this.owner.y =  750/1.5 - y + this.zeroY;
    }

    onUpdate() {
        let role =  this.owner.getChildByName("Role");
        if (role) {
            this.lookAt(role.x, role.y);
        }
    }
    
    onEnable() {
        let w =  Laya.Browser.width;
        let h =  Laya.Browser.height;
        Laya.Physics.I.positionIterations = 8;
        Laya.Physics.I.worldRoot = this.owner;
        this.zeroY = -100;
        if(w/h > 2.0) {
            this.zeroY = -250; 
        }
        Laya.Physics.I.worldRoot.y = this.zeroY;
    }

    onDisable() {
    }
}