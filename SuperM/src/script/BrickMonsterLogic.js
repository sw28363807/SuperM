import Utils from "./Utils";
import GameContext from "../GameContext";

export default class BrickMonsterLogic extends Laya.Script {

    constructor() { 
        super();

        /** @prop {name:lookArea, tips:"巡逻范围", type:Number, default:200}*/
        let lookArea = 200;
    }
    
    onEnable() {
        let script =  this.owner.getComponent(BrickMonsterLogic);
        if (script.lookArea) {
            this.owner.lookArea = script.lookArea;
        } else {
            this.owner.lookArea = 400;
        }

        this.owner.rigidBody = this.owner.getComponent(Laya.RigidBody);
        this.owner.startPoint = {x: this.owner.x, y: this.owner.y};
        this.owner.attackRole = false;
    }

    onStart() {
        Laya.timer.loop(2000, this, this.searchRole);
    }

    onDisable() {
        Laya.timer.clear(this, this.searchRole);
    }

    searchRole() {
        if (!this.owner) {
            return;
        }
        if (!GameContext.role) {
            return;
        }
        if (Math.abs(GameContext.role.x - this.owner.startPoint.x) < this.owner.lookArea) {
            this.owner.attackRole = true;
            let dx = Utils.getSign(GameContext.role.x - this.owner.x);
            this.owner.rigidBody.setVelocity({x: dx * 5, y: -35});
        } else {
            this.owner.rigidBody.setVelocity({x: 0, y: 0});
        }
        this.owner.attackRole = false;
    }

    onUpdate() {
        Utils.tryRemoveThis(this.owner);
    }

    onTriggerEnter(other, self, contact) {
        if (other.label == "Hole") {
            let colls = self.owner.getComponents(Laya.ColliderBase);
            for (let index = 0; index < colls.length; index++) {
                let coll = colls[index];
                coll.isSensor = true;
            }
        } else {
            if (self.label == "MonsterFoot") {
                if (other.label == "MonsterFoot" || other.label == "MonsterBody") {
                    this.searchRole();
                } else {
                    this.owner.rigidBody.setVelocity({x: 0, y: 0});
                }
            }
        }
    }
}