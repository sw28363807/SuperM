import GameContext from "../GameContext";

export default class SingleObsLogic extends Laya.Script {

    constructor() { 
        super();
    }
    
    onEnable() {
        this.rigidBody = this.owner.getComponent(Laya.RigidBody);
        this.colls = this.owner.getComponents(Laya.ColliderBase);
        for (let index = 0; index < this.colls.length; index++) {
            let coll = this.colls[index];
            if (coll.label == "obsGround") {
                this.ground = coll;
            }
        }
    }

    onDisable() {
    }

    onTriggerEnter(other, self, contact) {
        if (other.label == "RoleHead") {
            if (self.label == "obsDown") {
                this.ground.isSensor = true;
            }
        } else if (other.label == "RoleFoot") {
            if (self.label == "obsUp") {
                if (GameContext.role) {
                    if (GameContext.role.y < self.owner.y) {
                        this.ground.isSensor = false;
                    }   
                }
            }
        }
    }

    onTriggerStay(other, self, contact) {

    }

    onTriggerExit(other, self, contact) {

    }
}