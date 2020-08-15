import GameContext from "../GameContext";
import Events from "./Events";
import EventMgr from "./EventMgr";

export default class Utils extends Laya.Script {

    constructor() { 
        super();
    }
    
    onEnable() {
    }

    onDisable() {
    }

    static roleInCeil(monster) {
        if (GameContext.role) {
            let offx = 30;
            let myX = GameContext.role.x + GameContext.role.width/2 * GameContext.role.scaleX;
            let myY = GameContext.role.y + GameContext.role.height * GameContext.role.scaleY;
            let monsterW = monster.width * monster.scaleX;
            let monsterH = monster.height * monster.scaleY;
            if (myX > monster.x - monsterW/2 - offx && myX < monster.x + monsterW/2 + offx && myY < monster.y) {
                return true;
            }
        }
        return false;
    }

    static roleInFloor(brick) {
        if (GameContext.role) {
            let offx = 10;
            let myX = GameContext.role.x + GameContext.role.width/2 * GameContext.role.scaleX;
            let myY = GameContext.role.y;
            if (myX > brick.x - offx && myX < brick.x + brick.width * brick.scaleX + offx && myY > brick.y) {
                return true;
            }
        }
        return false;
    }

    static removeThis(owner) {
        if (!owner) {
            return;
        }
        let colls = owner.getComponents(Laya.ColliderBase);
        if (colls) {
            for (let index = 0; index < colls.length; index++) {
                let cell = colls[index];
                cell.isSensor = true;
                cell.destroy();
            }
        }
        let rigidBody = owner.getComponent(Laya.RigidBody);
        if (rigidBody) {
            rigidBody.enabled = false;
            rigidBody.destroy();
        }
        owner.removeSelf();
        owner.destroy();
    }

    static getFaceUp(owner) {
        if (owner.scaleX > 0) {
            return 1;
        }
        return -1;
    }

    static getSign(x) {
        if (x > 0) {
            return 1;
        }
        return -1;
    }

    static randomSign() {
        let ret = Math.random();
        if (ret > 0.5) {
            return 1;
        }
        return -1
    }

    static randomDirect() {
        let x = Utils.randomSign();
        let y = Utils.randomSign();
        return {x: x, y: y};
    }

    static getDirect(dx, dy, sx, sy) {
        let x = dx - sx;
        let y = dy - sy;
        let p = new Laya.Point(x, y);
        p.normalize();
        let ret = {x: p.x, y: p.y};
        return ret;
    }

    static getDistance(dx, dy, sx, sy) {
        let p = new Laya.Point(dx, dy);
        let d =  p.distance(sx, sy);
        return d;
    }

    static createMonsterDropDeadEffect(owner) {
        if (!owner) {
            return;
        }
        let deadMove = owner.getChildByName("deadMove");
        if (deadMove) {
            EventMgr.getInstance().postEvent(Events.Monster_Stop_AI, {owner: owner});
            let x = owner.x;
            let y = owner.y;
            let parent = owner.parent;
            Laya.loader.create(deadMove.text, Laya.Handler.create(null, function (prefabDef) {
                let dead = prefabDef.create();
                dead.x = x;
                dead.y = y;
                parent.addChild(dead);
                let rigid = dead.getComponent(Laya.RigidBody);
                rigid.setAngle(180);
                rigid.setVelocity({x: 3, y: -15});
                rigid.gravityScale = 5;
                Laya.timer.once(3000, null, function() {
                    Utils.removeThis(dead);
                });
            }));
        }
        Utils.removeThis(owner);
    }
}