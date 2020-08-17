export default class MonsterIdLogic extends Laya.Script {

    constructor() { 
        super();

        /** @prop {name:prefabFile, tips:"文件名", type:String, default:""}*/
        let prefabFile = 0;
    }
    
    onEnable() {
        let script = this.owner.getComponent(MonsterIdLogic);
        if (script && script.prefabFile) {
            this.owner.prefabFile = script.prefabFile;
        } else {
            this.owner.prefabFile = "";
        }
    }

    onDisable() {
    }
}