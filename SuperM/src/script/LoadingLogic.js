export default class LoadingLogic extends Laya.Script {

    constructor() { 
        super();
    }
    
    onEnable() {
        
    }


    static loadScene(scene, bgIndex) {
        Laya.Scene.open("loading/LoadingScene.scene", true, bgIndex, Laya.Handler.create(this, function() {
            Laya.Scene.open(scene, true, null, Laya.Handler.create(this, function() {
                
            }));
        }));
    }

    onDisable() {
    }
}