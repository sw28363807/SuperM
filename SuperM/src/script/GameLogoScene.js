import LoadingLogic from "./LoadingLogic";


export default class GameLogoScene extends Laya.Script {

    constructor() { 
        super();
    }
     
    onEnable() {
        // LoadingLogic.loadScene("scene/LevelBoss.scene");
        // LoadingLogic.loadScene("scene/Level3_1.scene");
        // LoadingLogic.loadScene("scene/Level6_1.scene", 1);
        // Laya.Scene.open("scene/Level4_1.scene");
        LoadingLogic.loadScene("scene/LittleGameScene1.scene");
        // Laya.Scene.open("scene/LittleGameScene1.scene");
    }

    onDisable() {
    }
}