export default class AdjustScene extends Laya.Script {

    constructor() { 
        super();
    }

    onAwake() {
        let widthScale = Laya.Browser.width/1336;
        let realH = 750*widthScale;
        this.owner.y = (Laya.Browser.height/2 - realH/2)/widthScale;
    }
    
    onEnable() {
        
    }

    onDisable() {
    }
}