import Utils from "./Utils";

export default class LittleGameScene1Logic extends Laya.Script {

    constructor() { 
        super();
    }
    
    onEnable() {
        this.points = [];
        this.beizis = [];
        for (let index = 0; index < 3; index++) {
            let point =  this.owner.getChildByName("point"+String(index));
            this.points.push({x: point.x, y: point.y});
        }

        for (let index = 0; index < 3; index++) {
            let beizi =  this.owner.getChildByName("beizi"+String(index));
            this.beizis.push(beizi);
            let p = this.points[index];
            beizi.x = p.x;
            beizi.y = p.y;
            beizi.pointIndex = index;

            beizi.on(Laya.Event.CLICK, this, function() {
                if (this.running == false) {
                    let spr1 = beizi.getChildByName("spr1");
                    let y = spr1.y;
                    let offY = 100;
                    Laya.Tween.to(spr1, {y:y - offY }, 500, null, Laya.Handler.create(this, function() {
    
                    }));
                }
            });
        }

        this.count = 0;
        this.running = true;
    }


    moveBeizi() {
        let srcIndex = 0;
        let a = Math.random();
        if (a < 0.3) {
            srcIndex = 0;
        } else if (a > 0.6) {
            srcIndex = 1;
        } else {
            srcIndex = 2;
        }

        let destIndex = 0;
        let collects = [];
        for (let index = 0; index < 3; index++) {
            if (index != srcIndex) {
                collects.push(index);
            }
        }
        
        let b = Math.random();
        if (b > 0.5) {
            destIndex = collects[0];
        } else {
            destIndex = collects[1];
        }

        let srcBeizi = null;
        let destBeizi = null;
        for (let index = 0; index < 3; index++) {
            let cell =  this.beizis[index]
            if (cell.pointIndex == srcIndex) {
                srcBeizi = cell;
            } else if (cell.pointIndex == destIndex) {
                destBeizi = cell;
            }
        }

        let time = 300;
        let srcX = srcBeizi.x;
        let destX = destBeizi.x;
        Laya.Tween.to(srcBeizi, {x: destX}, time, null, Laya.Handler.create(this, function() {
            srcBeizi.pointIndex = destIndex;
        }));

        Laya.Tween.to(destBeizi, {x: srcX}, time, null, Laya.Handler.create(this, function() {
            destBeizi.pointIndex = srcIndex;
            if (this.count < 5) {
                this.moveBeizi();
                this.count++;
            } else {
                this.running = false;
            }
        }));
    }


    onStart() {
        for (let index = 0; index < this.beizis.length; index++) {
            let beizi = this.beizis[index];
            let spr1 = beizi.getChildByName("spr1");
            let y = spr1.y;
            let offY = 100;
            Laya.Tween.to(spr1, {y:y - offY }, 500, null, Laya.Handler.create(this, function() {
                Laya.Tween.to(spr1, {y:y }, 500, null, Laya.Handler.create(this, function() {
                    if (index == 1) {
                        this.moveBeizi();
                    }
                }));
            }));
        }
    }

    onDisable() {
    }
}