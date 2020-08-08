import GameContext from "../GameContext";
import EventMgr from "./EventMgr";
import Events from "./Events";
import Utils from "./Utils";

export default class BrickGoldLogic extends Laya.Script {

    constructor() { 
        super();
    }

    onTriggerEnter(other, self, contact) {
        if (other && (other.label == "RoleHead" || other.label == "KeBullet")) {
            let brick = null;
            if (contact.m_fixtureA.collider.label == "Brick") {
                brick = contact.m_nodeA;
            } else if (contact.m_fixtureB.collider.label == "Brick") {
                brick = contact.m_nodeB;
            }
            if (brick) {
                this.onCreateBrokenBrick();
            }
        }
    }

    createBrokenCell(path) {
        let x = this.owner.x;
        let y = this.owner.y;
        let parent = this.owner.parent;
        Laya.loader.create(path, Laya.Handler.create(this, function (prefabDef) {
            let brokenBrick = prefabDef.create();
            parent.addChild(brokenBrick);
            brokenBrick.x = x;   
            brokenBrick.y = y;
        }));
    }

    onCreateBrokenBrick() {
        for (let index = 0; index < 4; index++) {
            this.createBrokenCell("prefab/bb/b"+ String(index + 1)+".prefab");
        }
        this.owner.play(0, false, "ani2");
        Laya.Animation
        this.owner.on(Laya.Event.COMPLETE, this, function() {

            let label = new Laya.Text();
            label.text = String(100);
            label.color = "#dbdb2b";
            label.fontSize = 24;
            this.owner.parent.addChild(label);
            label.x = this.owner.x + 20;
            label.y = this.owner.y - 50;

            Laya.Tween.to(label, {y: label.y - 60}, 1000, null, Laya.Handler.create(this, function() {
                Utils.removeThis(label);
            }));
            Utils.removeThis(this.owner);
            GameContext.gameGoldNumber++;
            EventMgr.getInstance().postEvent(Events.Refresh_Gold_Number);
        });
    }
    
    onEnable() {
    }

    onDisable() {
    }
}