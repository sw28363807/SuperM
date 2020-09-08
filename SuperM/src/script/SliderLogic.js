import GameContext from "../GameContext";

export default class SliderLogic extends Laya.Script {

    constructor() { 
        super();
    }

    onStart() {
        this.owner.slider = this.owner.getChildByName("slider");
        this.owner.slider.width = 0;
        this.owner.sliderSpeed = 1;
        GameContext.flySliderState = 1;
    }

    refreshSlider() {
        let cur = GameContext.curFlyPower;
        let max = GameContext.curFlyPowerMax;
        let p = cur/max;
        let w = this.owner.width * p;
        this.owner.slider.width = w;
    }

    onUpdate() {
        this.refreshSlider();
        if (GameContext.flySliderState == 1) {
            GameContext.curFlyPower = GameContext.curFlyPower + this.owner.sliderSpeed;
            if (GameContext.curFlyPower > GameContext.curFlyPowerMax) {
                GameContext.curFlyPower = GameContext.curFlyPowerMax;
            }
        } else if (GameContext.flySliderState == 2) {
            GameContext.curFlyPower = GameContext.curFlyPower - 0.5;
            if (GameContext.curFlyPower <= 0) {
                GameContext.curFlyPower = 0;
                GameContext.flySliderState = 1;
                GameContext.roleCommandFly = false;
            }
        }

    }
    
    onEnable() {
    }

    onDisable() {
    }
}