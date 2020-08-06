export default class Utils extends Laya.Script {

    constructor() { 
        super();
    }
    
    onEnable() {
    }

    onDisable() {
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