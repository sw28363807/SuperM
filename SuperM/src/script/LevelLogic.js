import GameContext from "../GameContext";

export default class LevelLogic extends Laya.Script {

    constructor() { 
        super();

        /** @prop {name:sceneType, tips:"场景类型", type:Number, default:0}*/
        let sceneType = 0;  //1 游戏场景 2 金币场景
    }
    
    onEnable() {
        if (!GameContext.gameTopScene) {
            Laya.View.open("scene/GameTop.scene", false, function(scene) {
                GameContext.gameTopScene = scene;
                scene.zOrder = 999;
            });
        }
        if (!GameContext.joyStickScene) {
            Laya.View.open("scene/GameJoyStick.scene", false, function(scene) {
                GameContext.joyStickScene = scene;
                scene.zOrder = 999;
            });
        }
        let script = this.owner.getComponent(LevelLogic);
        GameContext.gameSceneType = script.sceneType;
        GameContext.gameScene = this.owner;
    }

    onDisable() {
    }
}