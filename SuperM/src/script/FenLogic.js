export default class FenLogic extends Laya.Script {

    constructor() { 
        super(); 
        /** @prop {name:fen, tips:"分数", type:Int, default:0}*/
        let fen = 0;
    }
    
    onEnable() {
        let script = this.owner.getComponent(FenLogic);
        if (script && script.fen) {
            this.owner.fen = script.fen;
        } else {
            this.owner.fen = 0;
        }
    }

    onDisable() {
    }
}