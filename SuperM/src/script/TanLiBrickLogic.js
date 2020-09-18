import GameContext from "../GameContext";

export default class TanLiBrickLogic extends Laya.Script {

    constructor() { 
        super(); 
    }

    onTriggerEnter(other, self, contact) {
        if (other && other.label == "RoleFoot" ) {
            GameContext.roleInGround = false;
            let lineSpeed =  GameContext.getLineSpeed();
            let finalSpeed = -30;
            // if (finalSpeed < -40) {
            //     finalSpeed = -40
            // }
            GameContext.setRoleSpeed(lineSpeed.x, finalSpeed);
            this.owner.play(0, false, "ani2");
            Laya.SoundManager.playSound("loading/tanli.mp3");
        }
    }
    
    onEnable() {
    }

    onDisable() {
    }
}