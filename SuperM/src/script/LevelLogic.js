export default class LevelLogic extends Laya.Script {

    constructor() { 
        super();
    }
    
    onEnable() {
        Laya.View.open("scene/GameJoyStick.scene", false, function(view) {
        });
    }

    onDisable() {
    }
}