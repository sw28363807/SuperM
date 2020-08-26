export default class LoadingBgLogic extends Laya.Scene {

    constructor() { 
        super();
    }
    
    onEnable() {
    }

    onDisable() {
    }

    onOpened(data) {
        let spr =  this.getChildByName(String(data));
        spr.visible = true;
    }
}