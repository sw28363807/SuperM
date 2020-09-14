import GameContext from "../GameContext";
import Events from "./Events";
import EventMgr from "./EventMgr";

export default class BeiKe extends Laya.Script {

    constructor() { 
        super();
    }
    
    onEnable() {
    }

    onDisable() {
        Laya.timer.clear(this, this.onSootBullet);
    }

    onStart() {
        Laya.timer.loop(8000, this, this.onSootBullet);
        this.owner.renderAni = this.owner.getChildByName("render");
        this.owner.renderAni.play(0, true, "ani1");
    }

    onSootBullet() {
        if (Math.abs(GameContext.role.x - this.owner.x) < 350 || Math.abs(GameContext.role.y - this.owner.y) < 350) {
            this.owner.renderAni.play(0, true, "ani2");
            let x = this.owner.x;
            let y = this.owner.y;
            this.shootBullet(x + 100, y + 25, -1, 0);
            this.shootBullet(x + 100, y + 25, 1, 0);
            this.shootBullet(x + 100, y + 25, 0, -1);
            this.shootBullet(x + 100, y + 25, -0.7, -0.7);
            this.shootBullet(x + 100, y + 25, 0.7, -0.7);

            this.shootBullet(x + 100, y + 25, -1, -0.4);
            this.shootBullet(x + 100, y + 25, 1, -0.4);
            this.shootBullet(x + 100, y + 25, -0.5, -0.9);
            this.shootBullet(x + 100, y + 25, 0.5, -0.9);
        } else {
            this.owner.renderAni.play(0, true, "ani1");
        }
    }
    shootBullet(x, y, dx, dy) {
        let owner = this.owner;
        if (!owner) {
            return;
        }
        let parent = owner.parent;
        Laya.loader.create("prefab/FlowerBullet.prefab", Laya.Handler.create(this, function (prefabDef) {
            let bullet = prefabDef.create();
            parent.addChild(bullet);
            bullet.scaleX = 2;
            bullet.scaleY = 2;
            bullet.zOrder = 9999999;
            bullet.x = x;
            bullet.y = y;
            bullet.speed = 2;
            EventMgr.getInstance().postEvent(Events.Monster_Shoot_Bullet, {owner: bullet, direct: {x: dx, y: dy}});
            Laya.timer.once(3000, null, function() {
                if (owner && owner.renderAni) {
                    owner.renderAni.play(0, true, "ani1");
                }
            });
        }));
    }
}