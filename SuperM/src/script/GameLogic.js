import JoyStick from "./JoyStick";
import EventMgr from "./EventMgr";
import Events from "./Events";
import JoyStickButton from "./JoyStickButton";

export default class GameLogic extends Laya.Script {

    constructor() { 
        super();
        this.changeDirectHandler = Laya.Handler.create(this, function(data){
            EventMgr.getInstance().postEvent(Events.Role_Move, data);
        }, null, false);

        this.stopHandler = Laya.Handler.create(this, function(){
            EventMgr.getInstance().postEvent(Events.Role_Move_Stop);
        }, null, false);

        this.aButtonHandler = Laya.Handler.create(this, function(){
            EventMgr.getInstance().postEvent(Events.Role_A_Button);
        }, null, false);

        this.bButtonHandler = Laya.Handler.create(this, function(){
            EventMgr.getInstance().postEvent(Events.Role_B_Button);
        }, null, false);
    }
    
    onEnable() {
        let joyStickCom = this.owner.joyStick.getComponent(JoyStick);
        joyStickCom.setHandler(this.changeDirectHandler, this.stopHandler);

        let joyStickButton = this.owner.joyStickButton.getComponent(JoyStickButton);
        joyStickButton.setHandler(this.aButtonHandler, this.bButtonHandler);
    }

    onStart() {
        this.createLevel();
    }

    createLevel() {
        Laya.loader.create("prefab/Level_1.prefab", Laya.Handler.create(this, function (prefabDef) {
            let level = prefabDef.create();
            this.level = level;
            this.owner.addChild(level);
            Laya.Physics.I.worldRoot = this.level;


            Laya.loader.create("prefab/Role.prefab", Laya.Handler.create(this, function (prefabDef) {
                let role = prefabDef.create();
                level.addChild(role);
                role.x = 1400;   
                role.y = -900;     
            }));

        }));
    }

    onUpdate() {
        if (this.level) {
            // let camera = this.owner.getComponent(Cameara);
            // EventMgr.getInstance().postEvent(Events.Camera_Move);
        }
    }

    onDisable() {
    }
}