export default class LoadingBgLogic extends Laya.Script {

    constructor() { 
        super();
    }
    
    onEnable() {
    }

    onStart() {
        this.owner.slider = this.owner.getChildByName("SliderBg");
        this.owner.sliderBar = this.owner.slider.getChildByName("slider");
        this.owner.cur = 0;
        this.owner.max = 100;
        this.owner.sliderBar.width = 0;
        this.owner.maxWidth = 327;
        Laya.timer.loop(10, this, this.onTick);
    }

    onTick() {
        this.owner.cur++;
        if (this.owner.cur > 90) {
            this.owner.cur = 90;
        }
        let p = (this.owner.cur/this.owner.max) * this.owner.maxWidth;
        this.owner.sliderBar.width = p;
    }

    onDisable() {
        Laya.timer.clear(this, this.onTick);
    }

    onOpened(data) {
        // let spr =  this.getChildByName(String(data));
        // spr.visible = true;
    }
}