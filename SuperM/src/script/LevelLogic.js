import GameContext from "../GameContext";

export default class LevelLogic extends Laya.Script {

    constructor() { 
        super();
    }
    
    onEnable() {
        if (!GameContext.joyStickScene) {
            Laya.View.open("scene/GameJoyStick.scene", false, function(scene) {
                GameContext.joyStickScene = scene;
                scene.zOrder = 999;
            });
        }
    }

    onDisable() {
    }
}