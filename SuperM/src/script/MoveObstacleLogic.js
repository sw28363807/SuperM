export default class MoveObstacleLogic extends Laya.Script {

    constructor() { 
        super(); 
        /** @prop {name:moveType, tips:"运动类型", type:Int, default:0}*/
        let moveType = 0;

        this.moveType = moveType;  //0 无运动
    }
    
    onEnable() {
        this.rigidBody = this.owner.getComponent(Laya.RigidBody);
        //无运动
        if (this.moveType == 0) {
            
        }
    }

    onDisable() {
    }
}