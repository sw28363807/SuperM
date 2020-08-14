import Utils from "./Utils";
import GameContext from "../GameContext";

export default class WenhaoLogic extends Laya.Script {

    constructor() { 
        super();
    }

    onTriggerEnter(other, self, contact) {
        if (!Utils.roleInFloor(self.owner)) {
            return;
        }
        if (GameContext.brokenBrickTick != 0) {
            return;
        }
        if (other && other.label == "RoleHead") {
            let owner = this.owner;
            let render = owner.getChildByName("render");
            let x = owner.x;
            let y = owner.y;
            let parent = owner.parent;
            let zOrder = this.owner.zOrder;
            if (this.owner.state == 0 && render) {
                this.owner.state = 1;
                render.play(0, false, "ani3");
                Laya.timer.once(100, null, function() {
                    if (render) {
                        render.play(0, true, "ani2");
                    }
                    Laya.loader.create("prefab/Reward.prefab", Laya.Handler.create(null, function (prefabDef) {
                        if (parent && owner) {
                            let wenhao = prefabDef.create();
                            parent.addChild(wenhao);
                            wenhao.x = x + 5;
                            wenhao.y = y - wenhao.height * wenhao.scaleX;
                            wenhao.zOrder = zOrder + 1;
                        }
                    }));
                });
            }
            GameContext.brokenBrickTick = 10;
        }
    }
    
    onEnable() {
        this.owner.state = 0; //0 未出蘑菇 1 出蘑菇
    }

    onDisable() {
    }
}
