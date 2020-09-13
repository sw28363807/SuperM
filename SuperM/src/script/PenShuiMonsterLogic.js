import Utils from "./Utils";

export default class PenShuiMonsterLogic extends Laya.Script {

    constructor() { 
        super();
    }
    
    onEnable() {
    }

    onDisable() {
    }

    onStart() {
        this.owner.renderAni =  this.owner.getChildByName("render");
        this.owner.renderAni.play(0, true, "ani1");
        this.owner.penEffect = this.owner.getChildByName("penEffect");
        this.owner.penEffect.visible = false;
        this.owner.penEffect.stop();
        this.owner.state = 1; // 1 等待状态 2 准备状态 3 发射状态

        this.owner.maxIdleCount = 50;
        this.owner.maxPreCount = 50;
        this.owner.maxAttackCount = 80;

        this.resetCount();
    }

    resetCount() {
        this.owner.idleCount = 0;
        this.owner.preCount = 0;
        this.owner.attackCount = 0;
    }

    createBullet() {
        let x = this.owner.x;
        let y = this.owner.y;
        let parent = this.owner.parent;
        let owner = this.owner;
        Laya.loader.create("prefab/monster/PenShuiMonsterEffect.prefab", Laya.Handler.create(null, function (prefabDef) {
            let effect = prefabDef.create();
            parent.addChild(effect);
            effect.x = x - effect.width;
            effect.y = y - effect.height/2;
            owner.penEffect.visible = true;
            owner.penEffect.play(0, false, "ani1");
        }));

    }

    onUpdate() {
        if (this.owner.state == 1) {
            this.owner.idleCount++;
            if (this.owner.idleCount >= this.owner.maxIdleCount) {
                this.owner.state = 2;
                this.owner.idleCount = 0;
                this.owner.renderAni.play(0, true, "ani2");
            }
        } else if (this.owner.state == 2) {
            this.owner.preCount++;
            if (this.owner.preCount >= this.owner.maxPreCount) {
                this.owner.renderAni.play(0, true, "ani3");
                this.owner.state = 3;
                this.createBullet();
            }
        } else if (this.owner.state == 3) {
            this.owner.attackCount++;
            if (this.owner.attackCount >= this.owner.maxAttackCount) {
                this.owner.renderAni.play(0, true, "ani1");
                this.owner.state = 1;
                this.resetCount();
            }
        }

        Utils.tryRemoveThis(this.owner);
    }
}