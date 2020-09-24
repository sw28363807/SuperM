export default class DropBrickLogic extends Laya.Script {

    constructor() { 
        super();
    }
    
    onEnable() {
    }

    onDisable() {
        Laya.timer.clear(this, this.onResetDropBrick);
    }

    onStart() {
        this.owner.startPoint = {x: this.owner.x, y: this.owner.y};
        this.owner.state = 1;   // 1 等待状态 2掉落状态
        this.owner.rigidBody = this.owner.getComponent(Laya.RigidBody);
        this.owner.speed = 1;
        this.owner.a = 0.2;
    }

    onTriggerEnter(other, self, contact) {
        if (!this.owner) {
            return;
        }
        if (other.label == "RoleFoot") {
            Laya.timer.once(1000, this, function() {
                this.owner.state = 2;
                Laya.timer.once(2000, this, this.onResetDropBrick);
            });
        }
    }

    onUpdate() {
        if (this.owner.state == 1) {
            this.owner.rigidBody.getBody().SetPositionXY(this.owner.startPoint.x/50, this.owner.startPoint.y/50);
        } else if (this.owner.state == 2) {
            this.owner.rigidBody.setVelocity({x: 0, y: this.owner.speed});
            this.owner.speed += this.owner.a;
        }
    }

    onResetDropBrick() {
        if (!this.owner) {
            return;
        }
        this.owner.state = 1;
        this.owner.speed = 1;
        this.owner.a = 0.2;
        this.owner.rigidBody.setVelocity({x: 0, y: 0});
    }
}