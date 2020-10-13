import EventMgr from "./EventMgr";
import Events from "./Events";
import GameContext from "../GameContext";
import Utils from "./Utils";

export default class KeLogic extends Laya.Script {

    constructor() { 
        super();
    }
    
    onEnable() {
        EventMgr.getInstance().registEvent(Events.Role_Get_Ke, this, this.onRoleGetKe);
        this.owner.coll = this.owner.getComponent(Laya.ColliderBase);
        this.owner.isDrop = false;
        Laya.timer.once(11000, this, this.onCreateWoNiu);
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
                    Utils.removeThis(this.owner);
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
        Utils.removeThis(this.owner);
    }

    onTriggerEnter(other, self, contact) {
        if (!this.owner) {
            return;
        }
        if (this.owner.isDrop == true) {
            return;
        }
        if (other && other.label == "Hole") {
            this.owner.coll.isSensor = true;
            this.owner.isDrop = true;
            Laya.timer.once(3000, this, function() {
                Utils.removeThis(this.owner);
            });
            return;
        }
    }
}