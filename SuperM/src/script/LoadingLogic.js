export default class LoadingLogic extends Laya.Script {

    constructor() { 
        super();
    }
    
    onEnable() {
    }


    static loadScene(scene, bgIndex) {
        if (LoadingLogic.curScene != "") {
            if (LoadingLogic.curScene == scene) {
                return;
            }
        }
        if (scene == "scene/Level1_1.scene") {
            Laya.Scene.open("loading/LoadingScene.scene", true, bgIndex, Laya.Handler.create(this, function() {
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