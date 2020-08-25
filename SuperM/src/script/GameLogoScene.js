export default class GameLogoScene extends Laya.Script {

    constructor() { 
        super();
    }
    
    onEnable() {
        Laya.Scene.open("scene/Level4_1.scene");
    }

    onDisable() {
    }
}