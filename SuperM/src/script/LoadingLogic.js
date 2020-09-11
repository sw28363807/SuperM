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
        
        LoadingLogic.curSceneExt = scene;
        if (scene == "scene/Level1_1.scene" || scene == "scene/Level2_1.scene") {
            Laya.Scene.open("loading/LoadingScene.scene", true, 2, Laya.Handler.create(this, function() {
                Laya.Scene.open(scene, true, null, Laya.Handler.create(this, function() {
                    LoadingLogic.curScene = "";
                    if (handler) {
                        handler.run();
                    }
                }));
            })); 
        } else {
            Laya.Scene.open(scene, true, null, Laya.Handler.create(this, function() {
                LoadingLogic.curScene = "";
                if (handler) {
                    handler.run();
                }
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