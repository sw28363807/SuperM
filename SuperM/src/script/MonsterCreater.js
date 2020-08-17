import MonsterIdLogic from "./MonsterIdLogic";

export default class MonsterCreater extends Laya.Script {

    constructor() { 
        super();
    }

    onEnable() {
        Laya.timer.loop(1000, this, this.monsterTick);
        this.initMonsters();
    }

    onDisable() {
        Laya.timer.clear(this, this.monsterTick);
    }

    monsterTick() {
        
    }

    initMonsters() {
        for (let i = 0; i < this.owner.numChildren; i++) {
            let monster = this.owner.getChildAt(i);
            let script = monster.getComponent(MonsterIdLogic);
            let monsterX
        }
    }
}