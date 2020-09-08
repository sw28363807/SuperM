import Utils from "./Utils";
import GameContext from "../GameContext";

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
            if (Laya.Browser.onMiniGame) {
                Laya.SoundManager.playSound("other1/guoguan.mp3");
            } else {
                Laya.loader.load("other1/guoguan.mp3", Laya.Handler.create(this, function (data) {
                    Laya.SoundManager.playSound("other1/guoguan.mp3");
                }), null, Laya.Loader.SOUND);
            }

            let a = Math.random();
            let path = "";
            if (a < 0.3) {
                path = "other/rewardpingzi (1).png";
            } else if (a > 0.6) {
                path = "other/rewardpingzi (2).png";
            } else {
                path = "other/rewardpingzi (3).png";
            }

            let spr = new Laya.Sprite();
            spr.loadImage(path, Laya.Handler.create(this, function() {
                
            }));
            this.ani = this.owner.getChildByName("render");
            this.owner.parent.addChild(spr);
            spr.x = this.owner.x + 50;
            spr.y = this.owner.y + 50;
            spr.pivotX = 90;
            spr.pivotY = 125;
            let y = spr.y;
            Laya.Tween.to(spr, {y:y - 200, scaleX: 1.5, scaleY: 1.5 }, 500, null, Laya.Handler.create(this, function() {
                this.ani.removeSelf();
            }));
            this.ani.visible = false;
            
            for (let index = 0; index < 6; index++) {
                let anim =  this.owner.getChildByName("yanhua"+String(index + 1));
                anim.visible = true;
            }
        }
    }
    
    onEnable() {
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