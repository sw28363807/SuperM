import MonsterIdLogic from "./MonsterIdLogic";
import GameContext from "../GameContext";
import Utils from "./Utils";
import DoorLogic from "./DoorLogic";
import LoadingLogic from "./LoadingLogic";
import GoldLogic from "./GoldLogic";

export default class MonsterCreater extends Laya.Script {

    constructor() { 
        super();
    }

    onEnable() {
        GameContext.doors = [];
    }

    onStart() {
        Laya.timer.loop(100, this, this.monsterTick);
        this.initMonsters();
        this.initDoors();
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
        }
    }

    initDoors() {
        GameContext.doors = [];
        // GameContext.doorCount = 0;
        for (let i = 0; i < this.owner.numChildren; i++) {
            let control = this.owner.getChildAt(i);
            let script = control.getComponent(DoorLogic);
            if (script != null && script != undefined) {
                GameContext.doors.push(control);
            }
        }
    }

    initMonsters() {
        let monstersToMove = [];
        GameContext.monsters = [];
        let goldToMove = [];
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
            let script1 = monster.getComponent(GoldLogic);
            if (script1 != null && script1 != undefined) {
                let x = Math.round(monster.x);
                let y = Math.round(monster.y);
                let scene = LoadingLogic.curSceneExt;
                if (scene != "") {
                    let key = scene+String(x)+String(y);
                    if (GameContext.golds.has(key)) {
                        goldToMove.push(monster);
                    }
                }
            }
        }

        for (let index = 0; index < monstersToMove.length; index++) {
            let owner = monstersToMove[index];
            Utils.removeThis(owner);
        }

        for (let index = 0; index < goldToMove.length; index++) {
            let owner = goldToMove[index];
            Utils.removeThis(owner);
        }
    }
}