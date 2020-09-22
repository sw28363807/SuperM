export default class LoadingLogic extends Laya.Script {

    constructor() { 
        super();
    }
    
    onEnable() {
        this.owner.slider = this.owner.getChildByName("sliderBg");
        this.owner.sliderBar = this.owner.slider.getChildByName("slider");
        this.owner.cur = 0;
        this.owner.max = 100;
        this.owner.sliderBar.width = 0;
        this.owner.maxWidth = 327;
    }

    onStart() {
        
    }

    static loadScene(scene, handler) {
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
        Laya.SoundManager.stopAllSound();
        Laya.SoundManager.stopMusic();
        Laya.SoundManager.playSound("loading/little.mp3", 0);
        Laya.Scene.open("loading/LoadingScene.scene", true, 2, Laya.Handler.create(this, function(sceneObj) {
            Laya.Scene.open(scene, true, null, Laya.Handler.create(this, function() {
                Laya.SoundManager.stopAllSound();
                Laya.SoundManager.stopMusic();
                LoadingLogic.curScene = "";
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