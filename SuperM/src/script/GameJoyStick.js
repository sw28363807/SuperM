import JoyStick from "./JoyStick";
import EventMgr from "./EventMgr";
import Events from "./Events";
import JoyStickButton from "./JoyStickButton";
import GameContext from "../GameContext";
import LoadingLogic from "./LoadingLogic";

export default class GameJoyStick extends Laya.Script {

    constructor() { 
        super();
    }
    
    onEnable() {
        let btn = this.owner.getChildByName("btn");
        btn.on(Laya.Event.CLICK, this, function() {
            let input = this.owner.getChildByName("input");
            let scene = "";
            if (input.text == "11") {
                scene = "scene/Level1_1.scene";
            } else if (input.text == "21") {
                scene = "scene/Level2_1.scene";
            } else if (input.text == "31") {
                scene = "scene/Level3_1.scene";
            } else if (input.text == "32") {
                scene = "scene/Level3_2.scene";
            } else if (input.text == "33") {
                scene = "scene/Level3_3.scene";
            } else if (input.text == "41") {
                scene = "scene/Level4_1.scene";
            } else if (input.text == "51") {
                scene = "scene/Level5_1.scene";
            } else if (input.text == "61") {
                scene = "scene/Level6_1.scene";
            } else if (input.text == "71") {
                scene = "scene/Level7_1.scene";
            } else if (input.text == "72") {
                scene = "scene/Level7_2.scene";
            } else if (input.text == "73") {
                scene = "scene/Level7_3.scene";
            } else if (input.text == "81") {
                scene = "scene/Level8_1.scene";
            } else if (input.text == "91") {
                scene = "scene/LevelBoss.scene";
            } else if (input.text == "xx") {
                scene = "scene/LittleGameScene1.scene";
            }
            LoadingLogic.loadScene(scene);
        });
        let w =  Laya.Browser.width;
        let h =  Laya.Browser.height;
        if(w/h > 2.0) {
            this.owner.y = -100; 
        }
        this.changeDirectHandler = Laya.Handler.create(this, function(data){
            if (GameContext.isWin) {
                return;
            }
            EventMgr.getInstance().postEvent(Events.Role_Move, data);
        }, null, false);

        this.stopHandler = Laya.Handler.create(this, function(){
            if (GameContext.isDie) {
                return;
            }
            if (GameContext.isWin) {
                return;
            }
            EventMgr.getInstance().postEvent(Events.Role_Move_Stop);
        }, null, false);

        this.aButtonHandler = Laya.Handler.create(this, function(){
            if (GameContext.isDie) {
                return;
            }
            if (GameContext.isWin) {
                return;
            }
            EventMgr.getInstance().postEvent(Events.Role_A_Button);
        }, null, false);

        this.bButtonHandler = Laya.Handler.create(this, function(){
            if (GameContext.isDie) {
                return;
            }
            if (GameContext.isWin) {
                return;
            }
            EventMgr.getInstance().postEvent(Events.Role_B_Button);
        }, null, false);
        
        this.cButtonHandler = Laya.Handler.create(this, function(data){
            if (GameContext.isDie) {
                return;
            }
            if (GameContext.isWin) {
                return;
            }
            EventMgr.getInstance().postEvent(Events.Role_C_Button, data);
        }, null, false);
        
        let joyStickCom = this.owner.joyStick.getComponent(JoyStick);
        joyStickCom.setHandler(this.changeDirectHandler, this.stopHandler);
        
        let joyStickButton = this.owner.joyStickButton.getComponent(JoyStickButton);
        joyStickButton.setHandler(this.aButtonHandler, this.bButtonHandler, this.cButtonHandler);
    }

    onDisable() {
    }
}