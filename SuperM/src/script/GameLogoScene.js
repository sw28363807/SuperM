export default class GameLogoScene extends Laya.Script {

    constructor() { 
        super();
    }
    
    onEnable() {
        // Laya.Scene.open("scene/Level4_1.scene");
        Laya.Scene.open("scene/LittleGameScene1.scene");
    }

    onDisable() {
    }
}