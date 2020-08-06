import EventMgr from "./EventMgr";
import Events from "./Events";
import GameContext from "../GameContext";

export default class KeLogic extends Laya.Script {

    constructor() { 
        super();
    }
    
    onEnable() {
        EventMgr.getInstance().registEvent(Events.Role_Get_Ke, this, this.onRoleGetKe);
        Laya.timer.once(3000, this, this.onCreateWoNiu);
    }

    onCreateWoNiu() {
        if (this.owner) {
            if (this.owner.prefab != "") {
                let x = this.owner.x;
                let y = this.owner.y;
                let parent = this.owner.parent;
                Laya.loader.create(this.owner.prefab, Laya.Handler.create(this, function (prefabDef) {
                    let woniu = prefabDef.create();
                    parent.addChild(woniu);
                    woniu.x = x;
                    woniu.y = y + this.owner.height;
                    this.owner.removeSelf();
                }));
            }
        }
    }

    onDisable() {
        Laya.timer.clear(this, this.onCreateWoNiu);
    }

    onRoleGetKe(data) {
        if (data.owner != this.owner) {
            return;
        }
        this.owner.removeSelf();
    }
}