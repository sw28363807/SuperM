import JoyStick from "./JoyStick";
import EventMgr from "./EventMgr";
import Events from "./Events";
import JoyStickButton from "./JoyStickButton";
import GameContext from "../GameContext";

export default class GameJoyStick extends Laya.Script {

    constructor() { 
        super();
    }
    
    onEnable() {
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
        
        this.cButtonHandler = Laya.Handler.create(this, function(){
            if (GameContext.isDie) {
                return;
            }
            if (GameContext.isWin) {
                return;
            }
            EventMgr.getInstance().postEvent(Events.Role_C_Button);
        }, null, false);
        
        let joyStickCom = this.owner.joyStick.getComponent(JoyStick);
        joyStickCom.setHandler(this.changeDirectHandler, this.stopHandler);
        
        let joyStickButton = this.owner.joyStickButton.getComponent(JoyStickButton);
        joyStickButton.setHandler(this.aButtonHandler, this.bButtonHandler, this.cButtonHandler);

        let spr =  new Laya.Sprite();
        spr.loadImage("https://gitee.com/sun-wen-sky/sunwen/raw/master/other1/blueZ-fcf4dfb8f3.png");
        this.owner.addChild(spr);
    }

    onDisable() {
    }
}