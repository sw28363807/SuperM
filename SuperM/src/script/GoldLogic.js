import EventMgr from "./EventMgr";
import Events from "./Events";
import GameContext from "../GameContext";
import Utils from "./Utils";

export default class GoldLogic extends Laya.Script {

    constructor() {
        super();
    }

    onTriggerEnter(other, self, contact) {
        if (other && other.label == "RoleHead" || other.label == "RoleFoot" || other.label == "RoleBody" ) {
            let gold = null;
            if (contact.m_fixtureA.collider.label == "Gold") {
                gold = contact.m_nodeA;
            } else if (contact.m_fixtureB.collider.label == "Gold") {
                gold = contact.m_nodeB;
            }
            if (gold) {
                if (Laya.Browser.onMiniGame) {
                    Laya.SoundManager.playSound("other1/gold.mp3");
                } else {
                    Laya.loader.load("other1/gold.mp3", Laya.Handler.create(this, function (data) {
                        Laya.SoundManager.playSound("other1/gold.mp3");
                    }), null, Laya.Loader.SOUND);
                }

                Utils.removeThis(this.owner);
                GameContext.gameGoldNumber++;
                EventMgr.getInstance().postEvent(Events.Refresh_Gold_Number);
            }
        }
    }

    onStart() {
        this.owner.isPlayingAni = false;
    }

    onUpdate() {
        if (this.owner && GameContext.role) {
            let distanceX = Math.abs(GameContext.role.x - this.owner.x);
            let distanceY = Math.abs(GameContext.role.y - this.owner.y);
            if (distanceX <= 1000 && distanceY <= 1000) {
                if (this.owner.isPlayingAni == false) {
                    this.owner.isPlayingAni = true;
                    this.owner.play(0, true, "ani1");
                    this.owner.visible = true;
                }
            } else {
                if (this.owner.isPlayingAni == true) {
                    this.owner.stop();
                    this.owner.visible = false;
                    this.owner.isPlayingAni = false;
                }
            }
        }
    }
    
    onEnable() {
    }

    onDisable() {
    }
}