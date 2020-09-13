export default class LoadingLogic extends Laya.Script {

    constructor() { 
        super();
    }
    
    onEnable() {

    }


    static loadScene(scene, handler) {
        if (LoadingLogic.curScene != "") {
            if (LoadingLogic.curScene == scene) {
                return;
            }
        }
        Laya.Resource.destroyUnusedResources();
        for (let key in Laya.Loader.textureMap) {
            Laya.Loader.clearTextureRes(key);
        }
        LoadingLogic.curSceneExt = scene;
        Laya.Scene.open("loading/LoadingScene.scene", true, 2, Laya.Handler.create(this, function() {
            Laya.Scene.open(scene, true, null, Laya.Handler.create(this, function() {
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