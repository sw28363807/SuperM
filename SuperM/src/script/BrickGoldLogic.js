import GameContext from "../GameContext";
import EventMgr from "./EventMgr";
import Events from "./Events";

export default class BrickGoldLogic extends Laya.Script {

    constructor() { 
        super();
    }

    onTriggerEnter(other, self, contact) {
        if (other && other.label == "RoleHead") {
            let brick = null;
            if (contact.m_fixtureA.collider.label == "Brick") {
                brick = contact.m_nodeA;
            } else if (contact.m_fixtureB.collider.label == "Brick") {
                brick = contact.m_nodeB;
            }
            if (brick && brick.contact.m_manifold.localNormal.y < 0) {
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
        for (let index = 0; index < 7; index++) {
            this.createBrokenCell("prefab/bb/b"+ String(index + 1)+".prefab");
        }
        this.owner.play(0, false, "ani2");
        this.owner.on(Laya.Event.COMPLETE, this, function() {
            this.owner.removeSelf();
            GameContext.gameGoldNumber++;
            EventMgr.getInstance().postEvent(Events.Refresh_Gold_Number);
        });
    }
    
    onEnable() {
    }

    onDisable() {
    }
}