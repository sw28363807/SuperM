import EventMgr from "./EventMgr";
import Events from "./Events";

export default class WoniuLogic extends Laya.Script {

    constructor() { 
        super();
        this.speed = 3;
        this.faceup = 0;
        this.currentVelocity = null;
        this.monsterCount = 2;
    }
    
    onEnable() {
        EventMgr.getInstance().registEvent(Events.Monster_Foot_Dead, this, this.onMonsterFootDead);
        EventMgr.getInstance().registEvent(Events.Monster_Bullet_Dead, this, this.onMonsterBulletDead);
        let label = this.owner.getChildByName("prefab");
        if (label) {
            this.prefab = label.text;
        }
        console.debug(this.prefab);
        this.rigidBody = this.owner.getComponent(Laya.RigidBody);
        this.render = this.owner.getChildByName("render");
        Laya.timer.loop(3000, this, this.onTimeCallback);
    }

    onDisable() {
        Laya.timer.clear(this, this.onTimeCallback);
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
            Laya.timer.clear(this, this.onTimeCallback);
            this.owner.removeSelf();

            Laya.loader.create("prefab/oo/Ke.prefab", Laya.Handler.create(this, function (prefabDef) {
                let ke = prefabDef.create();
                ke.prefab = this.prefab;
                parent.addChild(ke);
                ke.x = x;
                ke.y = y - height/2;
            }));
        }
    }

    
    onTimeCallback() {
        if (this.faceup == 0 || this.faceup == 1) {
            this.faceup = 1;
            this.currentVelocity = {x: this.speed, y: 0};
            this.render.scaleX = Math.abs(this.render.scaleX);
        } else {
            this.currentVelocity = {x: -this.speed, y: 0};
            this.render.scaleX = -1 * Math.abs(this.render.scaleX);
        }
        this.faceup = -1 * this.faceup;
    }

    onUpdate() {
        if (this.currentVelocity) {
            let linearVelocity = this.rigidBody.linearVelocity;
            this.rigidBody.setVelocity({x: this.currentVelocity.x, y: linearVelocity.y});
        }
    }
}