export default class Camera extends Laya.Script {

    constructor() { 
        super();
        
    }

    lookAt(x, y) {
        // let width = Laya.Browser.width;
        // let widthScale = width/1336;
        // console.debug(widthScale);
        this.owner.x = 1136/2 - x;
    }

    onUpdate() {
        let role =  this.owner.getChildByName("Role");
        if (role) {
            this.lookAt(role.x, role.y);
        }
    }
    
    onEnable() {
    }

    onDisable() {
    }
}