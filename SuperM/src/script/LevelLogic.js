export default class LevelLogic extends Laya.Script {

    constructor() { 
        super();
    }
    
    onEnable() {
        Laya.Physics.I.positionIterations = 3;
        Laya.Physics.I.worldRoot = this.owner;
        Laya.Physics.I.worldRoot.y = -100;
        Laya.View.open("scene/GameJoyStick.scene", false, function(view) {
        });
        Laya.loader.create("prefab/Role.prefab", Laya.Handler.create(this, function (prefabDef) {
            let role = prefabDef.create();
            this.owner.addChild(role);
            role.x = 600;   
            role.y = -900;     
        }));
    }

    onDisable() {
    }
}