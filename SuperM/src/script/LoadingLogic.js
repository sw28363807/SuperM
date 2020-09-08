export default class LoadingLogic extends Laya.Script {

    constructor() { 
        super();
    }
    
    onEnable() {
    }


    static loadScene(scene, forceLoading) {
        if (forceLoading == false) {
            if (LoadingLogic.curScene != "") {
                if (LoadingLogic.curScene == scene) {
                    return;
                }
            }
        } else {
            Laya.Scene.close(LoadingLogic.curScene);
        }
        LoadingLogic.curSceneExt = scene;
        if (scene == "scene/Level1_1.scene" || scene == "scene/Level2_1.scene") {
            Laya.Scene.open("loading/LoadingScene.scene", true, 2, Laya.Handler.create(this, function() {
                Laya.Scene.open(scene, true, null, Laya.Handler.create(this, function() {
                    LoadingLogic.curScene = "";
                }));
            })); 
        } else {
            Laya.Scene.open(scene, true, null, Laya.Handler.create(this, function() {
                console.debug(LoadingLogic.curScene);
                LoadingLogic.curScene = "";
            }));
        }
        LoadingLogic.curScene = scene;

        // Laya.Scene.open("loading/LoadingScene.scene", true, 1, Laya.Handler.create(this, function() {
        //     Laya.Scene.open(scene, true, null, Laya.Handler.create(this, function() {
        //     }));
        // })); 
    }

    onDisable() {
    }
    
}

LoadingLogic.curScene = "";
LoadingLogic.curSceneExt = "";