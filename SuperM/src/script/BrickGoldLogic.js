import GameContext from "../GameContext";
import EventMgr from "./EventMgr";
import Events from "./Events";
import Utils from "./Utils";

export default class BrickGoldLogic extends Laya.Script {

    constructor() { 
        super();
    }

    onTriggerEnter(other, self, contact) {
        if (!Utils.roleInFloor(self.owner)) {
            return;
        }
        if (other && (other.label == "RoleHead" || other.label == "KeBullet")) {
            if (self) {
                if (GameContext.gameRoleBodyState == 1 || true) {
                    this.onCreateBrokenBrick();
                } else {
                    let render = this.owner.getChildByName("render");
                    this.render.play(0, false, "ani3");
                }
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

        let x = this.owner.x;
        let y = this.owner.y;
        let parent = this.owner.parent;
        Laya.loader.create("prefab/brick/BrickGoldEffect.prefab", Laya.Handler.create(this, function (prefabDef) {
            let BrickGoldEffect = prefabDef.create();
            parent.addChild(BrickGoldEffect);
            BrickGoldEffect.x = x;   
            BrickGoldEffect.y = y;
            BrickGoldEffect.play(0, false, "ani2");
            BrickGoldEffect.on(Laya.Event.COMPLETE, this, function() {
    
                let label = new Laya.Text();
                label.text = String(100);
                label.color = "#dbdb2b";
                label.fontSize = 24;
                parent.addChild(label);
                label.x = x + 20;
                label.y = y - 50;
    
                Laya.Tween.to(label, {y: label.y - 60}, 1000, null, Laya.Handler.create(this, function() {
                    Utils.removeThis(label);
                }));
                GameContext.gameGoldNumber++;
                EventMgr.getInstance().postEvent(Events.Refresh_Gold_Number);
                Utils.removeThis(BrickGoldEffect);
            });
        }));
        Utils.removeThis(this.owner);
    }
    
    onEnable() {

    }

    onDisable() {
    }
}