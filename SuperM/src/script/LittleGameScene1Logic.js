import Utils from "./Utils";
import GameContext from "../GameContext";
import LoadingLogic from "./LoadingLogic";

export default class LittleGameScene1Logic extends Laya.Script {

    constructor() { 
        super();
    }
    
    onEnable() {
        this.gameEnd = false;
        for (let index = 0; index < 10; index++) {
            let ani = this.owner.getChildByName("y"+String(index + 1));
            ani.visible = false;
        }

        this.owner.winSpr = this.owner.getChildByName("win");
        this.owner.winSpr.visible = false;

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
                    this.running = true;
                } else {
                    return;
                }
                this.owner.winSpr.visible = true;
                this.open(index, Laya.Handler.create(this, function() {
                    let beizi =  this.beizis[index];
                    let ani = beizi.getChildByName("qingzhu");
                    ani.visible = true;
                    if (Laya.Browser.onMiniGame) {
                        Laya.SoundManager.playSound("other1/yaoping.mp3");
                    } else {
                        Laya.loader.load("other1/yaoping.mp3", Laya.Handler.create(this, function (data) {
                            Laya.SoundManager.playSound("other1/yaoping.mp3");
                        }), null, Laya.Loader.SOUND);
                    }
                    Laya.timer.once(1000, this, function() {
                        if (index == 0) {
                            this.open(1);
                            this.open(2);
                            GameContext.gameRoleNumber = GameContext.gameRoleNumber + 1;
                        } else if (index == 1) {
                            this.open(0);
                            this.open(2);
                            GameContext.gameRoleNumber = GameContext.gameRoleNumber + 2;
                        } else if (index == 2) {
                            this.open(0);
                            this.open(1);
                            GameContext.gameRoleNumber = GameContext.gameRoleNumber + 3;
                        }
                        this.gameEnd = true;
                        for (let index = 0; index < 10; index++) {
                            let ani = this.owner.getChildByName("y"+String(index + 1));
                            ani.visible = true;
                            if (Laya.Browser.onMiniGame) {
                                Laya.SoundManager.playSound("other1/yanhua.mp3");
                            } else {
                                Laya.loader.load("other1/yanhua.mp3", Laya.Handler.create(this, function (data) {
                                    Laya.SoundManager.playSound("other1/yanhua.mp3");
                                }), null, Laya.Loader.SOUND);
                            }
                        }
                    });
                }));
            });
        }

        this.count = 0;
        this.running = true;
        this.time = 800;

        this.owner.on(Laya.Event.CLICK, this, function() {
            if (this.gameEnd == true) {
                LoadingLogic.loadScene("scene/Level2_1.scene");
                // Laya.Scene.open("scene/Level2_1.scene");
            }
        });
    }

    open(index, handler) {
        let beizi =  this.beizis[index];
        let spr1 = beizi.getChildByName("spr1");
        let y = spr1.y;
        let offY = 100;
        Laya.Tween.to(spr1, {y:y - offY }, 500, null, handler);
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

        this.time = this.time - 140;
        if (this.time <= 0) {
            this.time = 50;
        }
        let srcX = srcBeizi.x;
        let destX = destBeizi.x;
        Laya.Tween.to(srcBeizi, {x: destX}, this.time, null, Laya.Handler.create(this, function() {
        }));

        Laya.Tween.to(destBeizi, {x: srcX}, this.time, null, Laya.Handler.create(this, function() {
        }));

        Laya.timer.once(this.time + 20, this, function() {
            srcBeizi.pointIndex = destIndex;
            destBeizi.pointIndex = srcIndex;
            if (this.count < 30) {
                this.moveBeizi();
                this.count++;
            } else {
                this.running = false;
            }
        });
    }


    onStart() {
        for (let index = 0; index < this.beizis.length; index++) {
            let beizi = this.beizis[index];
            let spr1 = beizi.getChildByName("spr1");
            let ani =  beizi.getChildByName("qingzhu");
            ani.visible = false;
            let y = spr1.y;
            let offY = 300;
            Laya.Tween.to(spr1, {y:y - offY }, 1000, null, Laya.Handler.create(this, function() {
                Laya.Tween.to(spr1, {y:y }, 1000, null, Laya.Handler.create(this, function() {
                    if (index == 1) {
                        this.moveBeizi();
                    }
                }));
            }));
        }
    }

    onDisable() {
        Laya.SoundManager.stopAll();
    }
}