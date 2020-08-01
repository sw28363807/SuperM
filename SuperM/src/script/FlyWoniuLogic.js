import EventMgr from "./EventMgr";
import Events from "./Events";
import Utils from "./Utils";
import GameContext from "../GameContext";

export default class FlyWoniuLogic extends Laya.Script {

    constructor() { 
        super();
        this.monsterCount = 2;
        this.state = 0; // 0 随机 1 追逐
        this.direct = null;
    }
    
    onEnable() {
        EventMgr.getInstance().registEvent(Events.Monster_Foot_Dead, this, this.onMonsterFootDead);
        EventMgr.getInstance().registEvent(Events.Monster_Bullet_Dead, this, this.onMonsterBulletDead);
        this.rigidBody = this.owner.getComponent(Laya.RigidBody);
        this.startPoint = new Laya.Point(this.owner.x, this.owner.y);
        this.render = this.owner.getChildByName("render");
        Laya.timer.loop(2000, this, this.onMakeIdea);
    }

    onDisable() {
        Laya.timer.clear(this, this.onMakeIdea);
    }

    onMonsterFootDead(data) {
        if (data.owner != this.owner) {
            return;
        }
        this.removeThisMonster();
    }

    onMonsterBulletDead(data) {
        if (data.owner != this.owner) {
            return;
        }
        this.removeThisMonster();
    }

    removeThisMonster() {
        if (this.monsterCount > 0) {
            this.monsterCount--;
        }
        if (this.monsterCount == 1) {
            let x = this.owner.x;
            let y = this.owner.y;
            let height = this.owner.height
            let parent = this.owner.parent;
            this.rigidBody.enabled = false;
            Laya.timer.clear(this, this.onMakeIdea);
            this.owner.removeSelf();

            Laya.loader.create("prefab/oo/Ke.prefab", Laya.Handler.create(this, function (prefabDef) {
                let ke = prefabDef.create();
                parent.addChild(ke);
                ke.x = x;
                ke.y = y + height/2;
            }));
        }
    }

    onMakeIdea() {
        if (this.startPoint.distance(this.owner.x, this.owner.y) > 300) {
            this.direct = Utils.getDirect(this.startPoint.x, this.startPoint.y,
                 this.owner.x, this.owner.y);
            this.state = 0;
            return;
        }
        if (this.state == 0) {
            this.state = 1;
            this.direct = Utils.randomDirect();
        } else if (this.state == 1) {
            this.state = 0;
            if (GameContext.role) {
                let d = Utils.getDistance(GameContext.role.x, GameContext.role.y, this.owner.x, this.owner.y);
                if (d < 500) {
                    this.direct = Utils.getDirect(GameContext.role.x, GameContext.role.y, this.owner.x, this.owner.y);
                }
            }
        }
        let faceup =  this.direct.x > 0 ? 1 : -1;
        this.render.scaleX = faceup* Math.abs(this.render.scaleX);
    }

    onUpdate() {
        let speed = 0;
        if (this.state == 0) {
            speed = 2;
        } else if (this.state == 1) {
            speed = 5;
        }
        if (this.direct) {
            let speed = 2;
            let v = {x: this.direct.x * speed, y: this.direct.y * speed};
            this.rigidBody.setVelocity(v);
        }
    }
}