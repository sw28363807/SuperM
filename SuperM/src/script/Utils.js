import GameContext from "../GameContext";

export default class Utils extends Laya.Script {

    constructor() { 
        super();
    }
    
    onEnable() {
    }

    onDisable() {
    }

    static roleInFloor(brick) {
        if (GameContext.role) {
            let offx = 20;
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
}