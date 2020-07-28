export default class WenhaoLogic extends Laya.Script {

    constructor() { 
        super();
        this.state = 0; //0 未出蘑菇 1 出蘑菇
    }

    onTriggerEnter(other, self, contact) {
        if (other && other.label == "RoleHead") {
            let wenhao = null;
            if (contact.m_fixtureA.collider.label == "Wenhao") {
                wenhao = contact.m_nodeA;
            } else if (contact.m_fixtureB.collider.label == "Wenhao") {
                wenhao = contact.m_nodeB;
            }
            if (wenhao) {
                if (this.state == 0) {
                    this.owner.play(0, true, "ani2");
                    this.state = 1;
                    let x = this.owner.x;
                    let y = this.owner.y;
                    let parent = this.owner.parent;
                    Laya.loader.create("prefab/Reward.prefab", Laya.Handler.create(this, function (prefabDef) {
                        let wenhao = prefabDef.create();
                        parent.addChild(wenhao);
                        wenhao.x = x;
                        wenhao.y = y - wenhao.height;
                        wenhao.zOrder = this.owner.zOrder - 1;
                    }));
                }
            }
        }
    }
    
    onEnable() {
    }

    onDisable() {
    }
}