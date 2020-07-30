export default class MoreTimeBrick extends Laya.Script {

    constructor() { 
        super(); 
        /** @prop {name:goldNum, tips:"金币个数", type:Int, default:10}*/
        let goldNum = 10;

        this.goldNum = goldNum;
        this.curGoldNum = 0;
    }

    onTriggerEnter(other, self, contact) {
        if (other && other.label == "RoleHead") {
            let moreTimesBrick = null;
            if (contact.m_fixtureA.collider.label == "MoreTimesBrick") {
                moreTimesBrick = contact.m_nodeA;
            } else if (contact.m_fixtureB.collider.label == "MoreTimesBrick") {
                moreTimesBrick = contact.m_nodeB;
            }
            if (moreTimesBrick) {
                if (this.curGoldNum < this.goldNum) {
                    this.curGoldNum++;
                    let x = this.render.x;
                    let y = this.render.y;
                    
                    Laya.Tween.to(this.render, {x: x, y: y - 25}, 100, Laya.Ease.linearIn, Laya.Handler.create(this, function(){
                        Laya.Tween.to(this.render, {x: x, y: y}, 100, Laya.Ease.linearIn, Laya.Handler.create(this, function(){
                            this.refreshGold();
                        }), 0);
                    }), 0);
                } else {
                    this.normal.visible = true;
                    this.render.visible = false;
                    this.gold.visible = false;
                }
            }
        }
    }
    
    onEnable() {
        this.render = this.owner.getChildByName("render");
        this.gold = this.owner.getChildByName("gold");
        this.gold.visible = false;
        this.gold.play(0, true, "ani1");
        this.normal = this.owner.getChildByName("normal");
        this.normal.visible = false;
    }

    refreshGold() {
        let x = 7;
        let y = -10;
        this.gold.x = x;
        this.gold.y = y;
        this.gold.visible = true;
        this.gold.alpha = 0;
        Laya.Tween.to(this.gold, {alpha: 1}, 200, Laya.Ease.linearIn, Laya.Handler.create(this, function(){
            
        }), 0);
        Laya.Tween.to(this.gold, {y: -100}, 200, Laya.Ease.linearIn, Laya.Handler.create(this, function() {
            this.gold.visible = false;
        }), 0);
    }

    onDisable() {
    }
}