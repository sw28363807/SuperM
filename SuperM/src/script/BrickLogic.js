export default class BrickLogic extends Laya.Script {

    constructor() { 
        super();
    }

    onTriggerEnter(other, self, contact) {
        if (other && other.label == "RoleHead") {
            let brick = null;
            if (contact.m_fixtureA.collider.label == "Brick") {
                brick = contact.m_nodeA;
            } else if (contact.m_fixtureB.collider.label == "Brick") {
                brick = contact.m_nodeB;
            }
            if (brick && brick.contact.m_manifold.localNormal.y > 0) {

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
            brokenBrick.x = x;   
            brokenBrick.y = y;
        }));
    }

    onCreateBrokenBrick() {
        for (let index = 0; index < 7; index++) {
            this.createBrokenCell("prefab/bb/b"+ String(index + 1)+".prefab");
        }
        this.owner.removeSelf();
    }
    
    onEnable() {
    }

    onDisable() {
    }
}