import GameContext from "../GameContext";

export default class RenderTextureLogic extends Laya.Script {

    constructor() { 
        super();
        /** @prop {name:imagePath, tips:"图片名字", type:String, default:""}*/
        let imagePath = "";
        /** @prop {name:hang, tips:"渲染行数", type:Int, default:0}*/
        let hang = 0;
        /** @prop {name:lie, tips:"渲染列数", type:Int, default:0}*/
        let lie = 0;
        /** @prop {name:renderCellW, tips:"元素宽度", type:Int, default:0}*/
        let renderCellW = 0;
        /** @prop {name:renderCellH, tips:"元素高度", type:Int, default:0}*/
        let renderCellH = 0;
        /** @prop {name:renderStartX, tips:"起始坐标x", type:Int, default:0}*/
        let renderStartX = 0;
        /** @prop {name:renderStartY, tips:"起始坐标y", type:Int, default:0}*/
        let renderStartY = 0;

        this.hang = hang;
        this.lie = lie;
        this.renderCellW = renderCellW;
        this.renderCellH = renderCellH;
        this.renderStartX = renderStartX;
        this.renderStartY = renderStartY;
        this.imagePath = imagePath;
    }
    
    onEnable() {
        let spr = new Laya.Sprite();
        spr.x = this.renderStartX;
        spr.y = this.renderStartY;
        let tex = Laya.loader.getRes(this.imagePath);
        for (let j = 0; j < this.hang; j++) {
            for (let i = 0; i < this.lie; i++) {
                spr.graphics.drawImage(tex, spr.x + i * this.renderCellW, spr.y + j * this.renderCellH);
            }
        }
        this.owner.addChild(spr);
        spr.zOrder = 0;
    }

    onStart() {
        // let spr = new Laya.Sprite();
        // spr.loadImage(this.imagePath);
        // spr.x = GameContext.role.x;
        // spr.y = GameContext.role.y;
        // let tex = Laya.loader.getRes(this.imagePath);
        // for (let j = 0; j < this.hang; j++) {
        //     for (let i = 0; i < this.lie; i++) {
        //         spr.graphics.drawImage(tex, GameContext.role.x + i * this.renderCellW, GameContext.role.y + j * this.renderCellH);
        //     }
        // }
        // this.owner.addChild(spr);
    }

    onDisable() {
    }
}