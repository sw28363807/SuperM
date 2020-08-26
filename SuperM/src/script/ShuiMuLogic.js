import GameContext from "../GameContext";

export default class ShuiMuLogic extends Laya.Script {

    constructor() { 
        super();
        this.area = 400;
        this.speed = 5;
    }
    
    onEnable() {
        this.owner.rigidBody = this.owner.getComponent(Laya.RigidBody);
    }

    onDisable() {
        Laya.timer.clear(this, this.onMakeIdea);
    }

    onStart() {
        this.owner.startPoint = {x: this.owner.x, y: this.owner.y};
        Laya.timer.loop(2000, this, this.onMakeIdea);
    }

    onMakeIdea() {
        let dx = 0;
        let dy = 0;
        let distanceX = 0;
        let distanceY = 0;
        distanceX = Math.abs(this.owner.x -  this.owner.startPoint.x);
        distanceY = Math.abs(this.owner.y -  this.owner.startPoint.y);
        if (distanceX > 100 || distanceY > 100) {
            dx = this.owner.startPoint.x - this.owner.x;
            dy = this.owner.startPoint.y - this.owner.y;
            let d = new Laya.Point(dx, dy);
            d.normalize();
            this.owner.rigidBody.setVelocity({x: d.x * this.speed, y: d.y * this.speed});
            let angle = Math.atan2(dy, dx);
            this.owner.rotation = Laya.Utils.toAngle(angle) + 90;
            Laya.timer.once(1500, this, function() {
                this.owner.rigidBody.setVelocity({x: 0, y: 0});
                this.owner.rotation = 0;
            });
        } else {
            dx = GameContext.role.x - this.owner.x;
            dy = GameContext.role.y - this.owner.y;
            distanceX = Math.abs(this.owner.x -  GameContext.role.x);
            distanceY = Math.abs(this.owner.y -  GameContext.role.y);
            if (distanceX < this.area || distanceY < this.area) {
                dx = GameContext.role.x - this.owner.x;
                dy = GameContext.role.y - this.owner.y;
                let d = new Laya.Point(dx, dy);
                d.normalize();
                this.owner.rigidBody.setVelocity({x: d.x * this.speed, y: d.y * this.speed});
                let angle = Math.atan2(dy, dx);
                this.owner.rotation = Laya.Utils.toAngle(angle) + 90;
                Laya.timer.once(1500, this, function() {
                    this.owner.rigidBody.setVelocity({x: 0, y: 0});
                    this.owner.rotation = 0;
                });
            }
        }
    }
    
}