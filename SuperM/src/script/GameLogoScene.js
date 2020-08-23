export default class GameLogoScene extends Laya.Script {

    constructor() { 
        super();
    }
    
    onEnable() {
        Laya.Scene.open("scene/Level1_1.scene");
    }

    onDisable() {
    }
}