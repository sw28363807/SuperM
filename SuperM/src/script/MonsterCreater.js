import MonsterIdLogic from "./MonsterIdLogic";
import GameContext from "../GameContext";
import Utils from "./Utils";

export default class MonsterCreater extends Laya.Script {

    constructor() { 
        super();
    }

    onEnable() {
        
    }

    onStart() {
        Laya.timer.loop(1000, this, this.monsterTick);
        this.initMonsters();
    }

    onDisable() {
        GameContext.monsters = [];
        Laya.timer.clear(this, this.monsterTick);
    }

    monsterTick() {
        let owner = this.owner;
        let area = GameContext.monsterArea;
        let areaY = GameContext.monsterAreaY;
        if (GameContext.role) {
            for (let index = 0; index < GameContext.monsters.length; index++) {
                let cell = GameContext.monsters[index];
                let distance = Math.abs(GameContext.role.x - cell.x);
                let distanceY = Math.abs(GameContext.role.y - cell.y);
                if (distance <= area && distanceY <= areaY && cell.monster == null && cell.monster != "loading" && cell.canAdd == true) {
                    cell.monster = "loading";
                    Laya.loader.create(cell.prefabFile, Laya.Handler.create(null, function (prefabDef) {
                        if (cell.monster == "loading") {
                            let monster = prefabDef.create();
                            owner.addChild(monster);
                            monster.x = cell.x;
                            monster.y = cell.y;
                            cell.monster = monster;
                        }
                    }));
                }
            }
            
            for (let index = 0; index < GameContext.monsters.length; index++) {
                let cell = GameContext.monsters[index];
                let distanceX = Math.abs(GameContext.role.x - cell.x);
                let distanceY = Math.abs(GameContext.role.y - cell.y);
                if (distanceX > GameContext.monsterArea || distanceY > GameContext.monsterAreaY)  {
                    cell.canAdd = true;
                }
            }

            Laya.Resource.destroyUnusedResources();
        }
    }

    initMonsters() {
        let monstersToMove = [];
        GameContext.monsters = [];
        for (let i = 0; i < this.owner.numChildren; i++) {
            let monster = this.owner.getChildAt(i);
            let script = monster.getComponent(MonsterIdLogic);
            if (script != null && script != undefined) {
                let cell =  {
                    prefabFile: monster.prefabFile,
                    x: monster.x,
                    y: monster.y,
                    monster: null, 
                    canAdd: true
                }
                GameContext.monsters.push(cell);
                monstersToMove.push(monster);
            }
        }

        for (let index = 0; index < monstersToMove.length; index++) {
            let owner = monstersToMove[index];
            Utils.removeThis(owner);
        }
    }
}