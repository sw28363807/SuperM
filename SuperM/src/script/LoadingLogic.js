export default class LoadingLogic extends Laya.Script {

    constructor() { 
        super();
    }
    
    onEnable() {
        this.owner.slider = this.owner.getChildByName("sliderBg");
        this.owner.sliderBar = this.owner.slider.getChildByName("slider");
    }

    onStart() {
        
    }

    static loadScene(scene, handler) {
        Laya.SoundManager.stopAllSound();
        Laya.SoundManager.stopMusic();
        Laya.SoundManager.playSound("loading/little.mp3", 0);
        if (LoadingLogic.curScene != "") {
            if (LoadingLogic.curScene == scene) {
                Laya.SoundManager.stopSound("loading/little.mp3");
                if (handler) {
                    handler.run();
                }
                return;
            }
        }
        LoadingLogic.curSceneExt = scene;
        if (scene != "loading/GameLogoScene.scene" && scene != "scene/Level1_1.scene") {
            Laya.Resource.destroyUnusedResources();
            for (let key in Laya.Loader.textureMap) {
                Laya.Loader.clearTextureRes(key);
            }
        }
        Laya.Scene.open("loading/LoadingScene.scene", true, 2, Laya.Handler.create(this, function() {
            Laya.Scene.open(scene, true, null, Laya.Handler.create(this, function() {
                LoadingLogic.curScene = "";
                Laya.SoundManager.stopSound("loading/little.mp3");
                if (handler) {
                    handler.run();
                }
            }));
        })); 
        LoadingLogic.curScene = scene;
    }

    onDisable() {
    }
    
}

LoadingLogic.curScene = "";
LoadingLogic.curSceneExt = "";