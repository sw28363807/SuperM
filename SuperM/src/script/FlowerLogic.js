import GameContext from "../GameContext";
import Utils from "./Utils";
import EventMgr from "./EventMgr";
import Events from "./Events";

export default class FlowerLogic extends Laya.Script {

    constructor() { 
        super();
        /** @prop {name:flowerType, tips:"花类型", type:Int, default:0}*/
        let flowerType = 0; //1 绿色花 2 红色花
    }
    
    onEnable() {
    }


    startAI() {
        let script = this.owner.getComponent(FlowerLogic);
        if (script.flowerType) {
            this.owner.flowerType = script.flowerType;
        } else {
            this.owner.flowerType = 1;
        }
        
        this.owner.flowerState = 2; //1 上方 2 下方
        this.owner.rigidBody = this.owner.getComponent(Laya.RigidBody);
        this.owner.greenFlower = this.owner.getChildByName("green");
        this.owner.redFlower = this.owner.getChildByName("red");

        this.owner.greenFlower.visible = this.owner.flowerType == 1;
        this.owner.redFlower.visible = this.owner.flowerType == 2;

        this.owner.downPos = {x: this.owner.x, y: this.owner.y};
        this.owner.upPos = {x: this.owner.x, y: this.owner.y - 110};
        this.owner.canShootBullet = true;
        
        this.owner.rigidBody.getBody().SetPositionXY(this.owner.downPos.x/50, this.owner.downPos.y/50);
        Laya.timer.loop(4000, this, this.switchFlowerState);
        this.owner.shootTickCount = 0;
        this.owner.inGround = false;
        this.owner.outSpeed = -6;
    }

    onTriggerEnter(other, self, contact) {
        if (self.label == "FlowerNoOut" && this.owner.inGround == true &&
        other.label == "RoleHead" || other.label == "RoleBody" || other.label == "RoleFoot") {
            this.owner.outSpeed = 0;
        } else if ((other.label == "RoleHead" || other.label == "RoleBody" || other.label == "RoleFoot") && self.label != "FlowerNoOut") {
            GameContext.hurtRole();
        } else if (other.label == "Bullet" || other.label == "KeBullet") {
            if (this.owner) {
                Utils.removeThis(this.owner);   
            }
        }
    }

    onTriggerExit(other, self, contact) {
        if (self.label == "FlowerNoOut" && other.label == "RoleHead" || other.label == "RoleBody" || other.label == "RoleFoot") {
            this.owner.outSpeed = -6;
        } 
    }

    shootBullet() {
        let owner = this.owner;
        if (!owner) {
            return;
        }
        let parent = owner.parent;
        let width = owner.width;
        let x = owner.x;
        let y = owner.y;

        Laya.loader.create("prefab/FlowerBullet.prefab", Laya.Handler.create(this, function (prefabDef) {
            let bullet = prefabDef.create();
            parent.addChild(bullet);
            let roleGlobalPos = GameContext.role.localToGlobal(new Laya.Point(0, GameContext.role.height/2));
            let flowerGlobalPos = owner.redFlower.localToGlobal(new Laya.Point(0, 0));
            let direct = Utils.getDirect(roleGlobalPos.x, roleGlobalPos.y, flowerGlobalPos.x, flowerGlobalPos.y);
            bullet.x = x + Utils.getSign(direct.x) * 25;
            bullet.y = y + 60;
            EventMgr.getInstance().postEvent(Events.Monster_Shoot_Bullet, {owner: bullet, direct: direct});
        }));
    }

    getFaceUp(flower) {
        let roleGlobalPos = GameContext.role.localToGlobal(new Laya.Point(0, 0));
        let flowerGlobalPos = flower.localToGlobal(new Laya.Point(0, 0));
        return Utils.getSign(roleGlobalPos.x - flowerGlobalPos.x);
    }

    getFaceRoatation(flower) {
        let roleGlobalPos = GameContext.role.localToGlobal(new Laya.Point(0, 0));
        let flowerGlobalPos = flower.localToGlobal(new Laya.Point(0, 0));
        let y = roleGlobalPos.y - flowerGlobalPos.y;
        if (y < -200) {
            let a = -1;
            if (flower.scaleX < 0) {
                a = 1;
            }
            return a * 30;
        } else if (y > 100) {
            let a = 1;
            if (flower.scaleX < 0) {
                a = -1;
            }
            return a * 30;
        } else {
            return 0;
        }
    }

    getBulletDirect() {
        let roleGlobalPos = GameContext.role.localToGlobal(new Laya.Point(0, 0));
        let flowerGlobalPos = this.owner.redFlower.localToGlobal(new Laya.Point(0, 0));
        Utils.getSign(roleGlobalPos.x - flowerGlobalPos.x);
    }

    onDisable() {
        Laya.timer.clear(this, this.switchFlowerState);
        Laya.timer.clear(this, this.shootBullet);
    }

    onStart() {
        this.startAI();
    }

    onUpdate() {
        let y = this.owner.rigidBody.getBody().GetPosition().y;
        if (y * 50 <= this.owner.upPos.y) {
            this.owner.rigidBody.getBody().SetPositionXY(this.owner.upPos.x/50, this.owner.upPos.y/50);
            this.owner.flowerState = 1;
            if (this.owner.flowerType == 2 || this.owner.flowerType == 1) {
                this.owner.shootTickCount++;
                if (this.owner.shootTickCount > 60) {
                    let roleGlobalPos = GameContext.role.localToGlobal(new Laya.Point(0, 0));
                    let flowerGlobalPos = this.owner.redFlower.localToGlobal(new Laya.Point(0, 0));
                    if (Math.abs(roleGlobalPos.x - flowerGlobalPos.x) < 400) {
                        if (this.owner.canShootBullet == true) {
                            this.owner.canShootBullet = false;
                            this.shootBullet();
                            this.owner.shootTickCount == 0;
                        }
                    }
                }
            }
            if (this.owner.flowerType == 1) {
                this.owner.greenFlower.scaleX = Math.abs(this.owner.greenFlower.scaleX) * this.getFaceUp(this.owner.greenFlower);
                this.owner.greenFlower.rotation = this.getFaceRoatation(this.owner.greenFlower);
            } else {
                this.owner.redFlower.scaleX = Math.abs(this.owner.redFlower.scaleX) * this.getFaceUp(this.owner.redFlower);
                this.owner.redFlower.rotation = this.getFaceRoatation(this.owner.redFlower);
            }
        } else if (y * 50 >= this.owner.downPos.y) {
            this.owner.rigidBody.getBody().SetPositionXY(this.owner.downPos.x/50, this.owner.downPos.y/50);
            this.owner.flowerState = 2;
            this.owner.canShootBullet = true;
            this.owner.inGround = true;
        }
    }

    switchFlowerState() {
        if (this.owner.flowerState == 2) {
            this.owner.rigidBody.getBody().SetPositionXY(this.owner.downPos.x/50, this.owner.downPos.y/50);
            this.owner.rigidBody.setVelocity({x: 0, y: this.owner.outSpeed});
            let rotation = -90;
            if (this.owner.greenFlower.scaleX < 0) {
                rotation = 90;
            }
            this.owner.redFlower.rotation = rotation;
            this.owner.greenFlower.rotation = rotation;
            this.owner.inGround = false;
        } else {
            this.owner.rigidBody.getBody().SetPositionXY(this.owner.upPos.x/50, this.owner.upPos.y/50);
            this.owner.rigidBody.setVelocity({x: 0, y: 6});
            let rotation = -90;
            if (this.owner.redFlower.scaleX < 0) {
                rotation = 90;
            }
            this.owner.redFlower.rotation = rotation;
            this.owner.greenFlower.rotation = rotation;
            this.owner.shootTickCount = 0;
        }
    }
}