import Utils from "./Utils";

export default class BrickLogic extends Laya.Script {

    constructor() { 
        super();
    }

    onTriggerEnter(other, self, contact) {
        if (other && (other.label == "RoleHead" || other.label == "KeBullet")) {
            let brick = null;
            if (contact.m_fixtureA.collider.label == "Brick") {
                brick = contact.m_nodeA;
            } else if (contact.m_fixtureB.collider.label == "Brick") {
                brick = contact.m_nodeB;
            }
            if (brick) {
                this.onCreateBrokenBrick();
            }
        }
    }

    createBrokenCell(path) {
        let x = this.owner.x;
        let y = this.owner.y;
        let parent = this.owner.parent;
        Laya.loader.create(path, Laya.Handler.create(this, function (prefabDef) {
            let brokenBrick = prefabDef.create();
            parent.addChild(brokenBrick);
            brokenBrick.x = x + 10;   
            brokenBrick.y = y;
        }));
    }

    onCreateBrokenBrick() {
        for (let index = 0; index < 4; index++) {
            this.createBrokenCell("prefab/bb/b"+ String(index + 1)+".prefab");
        }
        Utils.removeThis(this.owner);
    }
    
    onEnable() {
    }

    onDisable() {
    }
}