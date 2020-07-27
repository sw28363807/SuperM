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
        // let anim = this.owner.getChildByName("anim");
        // console.debug(anim);
        // Laya.Animation
        // anim.play();

        // this.roleAni = new Laya.Animation();
        // this.roleAni.loadAnimation("anim/Brick.ani");
        // this.owner.addChild(this.roleAni);
        // this.roleAni.x = 1372;
        // this.roleAni.y = 564;
        // this.roleAni.play(0,true,"ani1");
    }

    onDisable() {
    }
}