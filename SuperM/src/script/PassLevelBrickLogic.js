import Utils from "./Utils";
import GameContext from "../GameContext";
import EventMgr from "./EventMgr";
import Events from "./Events";

export default class PassLevelBrickLogic extends Laya.Script {

    constructor() { 
        super();

        /** @prop {name:gotoScene, tips:"要跳到的场景", type:String, default:""}*/
        let gotoScene = "";
    }

    randomYanhua() {
        let a =  (Math.ceil(Math.random() * 10) )% 7;
        if (a == 0) {
            a = 1;
        }
        return a;
    }


    onTriggerEnter(other, self, contact) {
        if (other.label == "RoleHead") {
            Laya.SoundManager.stopMusic();
            Laya.SoundManager.playSound("loading/guoguan.mp3");
            GameContext.gameRoleNumber++;
            this.ani.play(0, false, "ani2");
            Laya.timer.once(500, this, function() {
                this.ani.play(0, true, "ani3");
            });
            EventMgr.getInstance().postEvent(Events.Refresh_Role_Number);
            Laya.SoundManager.playSound("other1/yanhua.mp3");
            for (let index = 0; index < 6; index++) {
                let anim =  this.owner.getChildByName("yanhua"+String(index + 1));
                anim.visible = true;
            }
        }
    }
    
    onEnable() {
        this.ani = this.owner.getChildByName("render");
    }

    onStart() {
        let script = this.owner.getComponent(PassLevelBrickLogic);
        if (script.gotoScene && script.gotoScene != "") {
            GameContext.gameGotoScene = script.gotoScene;
        } else {
            GameContext.gameGotoScene = "";
        }
        for (let index = 0; index < 6; index++) {
            let anim =  this.owner.getChildByName("yanhua"+String(index + 1));
            anim.visible = false;
        }
    }

    onDisable() {
    }
}