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
        Laya.timer.loop(500, this, this.monsterTick);
        this.initMonsters();
    }

    onDisable() {
        GameContext.monsters = [];
        Laya.timer.clear(this, this.monsterTick);
    }

    monsterTick() {
        let toMoveArray = [];
        let owner = this.owner;
        let area = 1500;
        if (GameContext.role) {
            for (let index = 0; index < GameContext.monsters.length; index++) {
                let cell = GameContext.monsters[index];
                let distance = Math.abs(GameContext.role.x - cell.x);
                if (distance > area) {
                    cell.canCreate = true;
                }
                if (distance <= area && cell.monster == null && (cell.canCreate == true || cell.canCreate == null)) {
                    cell.monster = "loading";
                    cell.canCreate = false;
                    Laya.loader.create(cell.prefabFile, Laya.Handler.create(null, function (prefabDef) {
                        let monster = prefabDef.create();
                        owner.addChild(monster);
                        monster.x = cell.x;
                        monster.y = cell.y;
                        if (cell.monster == "loading") {
                            cell.monster = monster;
                        }
                    }));
                }

                if (cell.monster != "loading" &&
                cell.monster != null && cell.monster!= undefined) {
                    let distance2 = Math.abs(GameContext.role.x - cell.monster.x);
                    if (distance2 > area) {
                        toMoveArray.push(cell.monster);
                        cell.monster = null;
                   }
                }
            }
            for (let index = 0; index < toMoveArray.length; index++) {
                let monster = toMoveArray[index];
                Utils.removeThis(monster);
            }
        }
    }

    initMonsters() {
        let monstersToMove = [];
        for (let i = 0; i < this.owner.numChildren; i++) {
            let monster = this.owner.getChildAt(i);
            let script = monster.getComponent(MonsterIdLogic);
            if (script != null && script != undefined) {
                let cell =  {
                    prefabFile: monster.prefabFile,
                    x: monster.x,
                    y: monster.y,
                    monster: null,
                    canCreate: null
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