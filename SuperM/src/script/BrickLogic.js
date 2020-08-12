import Utils from "./Utils";

export default class BrickLogic extends Laya.Script {

    constructor() { 
        super();
    }

    onTriggerEnter(other, self, contact) {
        if (other.label == "RoleHead") {
            if (Utils.roleInFloor(this.owner)) {
                this.onCreateBrokenBrick();
            }
        } else if (other.label == "KeBullet") {
            this.onCreateBrokenBrick();
        }
    }

    onUpdate() {
        if (this.owner && GameContext.role) {
            if (this.owner.x < GameContext.role.x - 2000) {
                Utils.removeThis(this.owner);
                return;
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