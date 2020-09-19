import LoadingLogic from "./LoadingLogic";


export default class GameLogoScene extends Laya.Script {

    constructor() { 
        super();
    }
     
    onEnable() {
    }

    onDisable() {
    }

    onStart() {
        let touch = this.owner.getChildByName("touch");
        touch.on(Laya.Event.CLICK, this, function() {
            // LoadingLogic.loadScene("scene/LevelBoss.scene");
            // LoadingLogic.loadScene("scene/Level8_1.scene");
            // LoadingLogic.loadScene("scene/Level6_1.scene");
            // LoadingLogic.loadScene("scene/Level7_1.scene");
            LoadingLogic.loadScene("scene/Level1_1.scene");
            // Laya.Scene.open("scene/Level4_1.scene");
            // LoadingLogic.loadScene("scene/LittleGameScene1.scene");
            // Laya.Scene.open("scene/LittleGameScene1.scene");
        });
    }
}