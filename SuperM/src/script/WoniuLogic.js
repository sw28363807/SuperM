import EventMgr from "./EventMgr";
import Events from "./Events";

export default class WoniuLogic extends Laya.Script {

    constructor() { 
        super();
        /** @prop {name:time, tips:"巡逻时间", type:Number, default:3000}*/
        this.time = 3000;
        /** @prop {name:area, tips:"巡逻范围", type:Number, default:200}*/
        this.area = 200;
        /** @prop {name:speed, tips:"移动速度", type:Number, default:5}*/
        this.speed = 5;

        this.faceup = 0;
        this.currentVelocity = null;
        
        this.monsterCount = 2;
    }
    
    onEnable() {
        EventMgr.getInstance().registEvent(Events.Monster_Foot_Dead, this, this.onMonsterFootDead);
        EventMgr.getInstance().registEvent(Events.Monster_Bullet_Dead, this, this.onMonsterBulletDead);
        this.rigidBody = this.owner.getComponent(Laya.RigidBody);
        this.render = this.owner.getChildByName("render");
        Laya.timer.loop(this.time, this, this.onTimeCallback);
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
                parent.addChild(ke);
                ke.x = x;
                ke.y = y + height/2;
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