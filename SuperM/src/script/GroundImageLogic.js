export default class GroundImageLogic extends Laya.Script {

    constructor() { 
        super();
        /** @prop {name:imagePath, tips:"字符串类型示例", type:String, default:""}*/
        let imagePath = "";
        /** @prop {name:renderWidth, tips:"渲染宽度", type:Number, default:0}*/
        let renderWidth = 0;
        /** @prop {name:renderHeight, tips:"渲染高度", type:Number, default:0}*/
        let renderHeight = 0;

        this.imagePath = imagePath;
        this.renderWidth = renderWidth;
        this.renderHeight = renderHeight;
    }
    
    onEnable() {
        let spr = new Laya.Sprite();
        spr.x = 0;
        spr.y = this.owner.height;
        let tex = Laya.loader.getRes(this.imagePath);
        let num = Math.ceil(this.owner.width/this.renderWidth);
        for (let index = 0; index < num; index++) {
            spr.graphics.drawImage(tex, index * this.renderWidth, 0);
        }
        this.owner.addChild(spr);
    }

    onDisable() {
    }
}