import GameContext from "../GameContext";

export default class LevelLogic extends Laya.Script {

    constructor() { 
        super();
        /** @prop {name:sceneType, tips:"场景类型", type:Number, default:0}*/
        let sceneType = 0;  //1 游戏场景 2 金币场景
        /** @prop {name:bgm, tips:"音乐", type:String, default:""}*/
        let bgm = "";
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
        if (script && script.bgm) {
            this.owner.bgm = script.bgm;
        } else {
            this.owner.bgm = "";
        }
        if (this.owner.bgm != "") {
            Laya.loader.load(this.owner.bgm, Laya.Handler.create(this, function (data) {
                Laya.SoundManager.playMusic(this.owner.bgm);
            }), null, Laya.Loader.SOUND);
        }
        GameContext.gameSceneType = script.sceneType;
        GameContext.gameScene = this.owner;
    }

    onDisable() {
        if (this.owner.bgm != "") {
            Laya.SoundManager.destroySound(this.owner.bgm);
        }
    }
}