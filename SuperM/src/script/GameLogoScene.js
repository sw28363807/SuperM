export default class GameLogoScene extends Laya.Script {

    constructor() { 
        super();
    }
    
    onEnable() {
        Laya.Scene.open("scene/Level2_1.scene");
    }

    onDisable() {
    }
}