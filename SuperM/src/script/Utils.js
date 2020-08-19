import GameContext from "../GameContext";
import Events from "./Events";
import EventMgr from "./EventMgr";

export default class Utils extends Laya.Script {

    constructor() { 
        super();
    }
    
    onEnable() {
    }

    onDisable() {
    }

    static createHeadBullet(owner) {
        if (!owner) {
            return;
        }
        let x = owner.x;
        let y = owner.y - owner.height * owner.scaleY + 20;
        let parent = owner.parent;
        Laya.loader.create("prefab/HeadBullet.prefab", Laya.Handler.create(null, function (prefabDef) {
            let headBullet = prefabDef.create();
            parent.addChild(headBullet);
            headBullet.x = x;   
            headBullet.y = y;
        }));

    }

    static createGoldEffect(owner, removeThis) {
        if (removeThis == null || removeThis == undefined) {
            removeThis = true;
        }
        let x = owner.x;
        let y = owner.y;
        let parent = owner.parent;
        if (parent && owner) {
            Laya.loader.create("prefab/brick/BrickGoldEffect.prefab", Laya.Handler.create(null, function (prefabDef) {
                let BrickGoldEffect = prefabDef.create();
                parent.addChild(BrickGoldEffect);
                BrickGoldEffect.x = x;   
                BrickGoldEffect.y = y;
                BrickGoldEffect.play(0, false, "ani2");
                BrickGoldEffect.on(Laya.Event.COMPLETE, null, function() {
        
                    let label = new Laya.Text();
                    label.text = String(100);
                    label.color = "#dbdb2b";
                    label.fontSize = 24;
                    parent.addChild(label);
                    label.x = x + 20;
                    label.y = y - 50;
        
                    Laya.Tween.to(label, {y: label.y - 60}, 1000, null, Laya.Handler.create(null, function() {
                        Utils.removeThis(label);
                    }));
                    GameContext.gameGoldNumber++;
                    EventMgr.getInstance().postEvent(Events.Refresh_Gold_Number);
                    Utils.removeThis(BrickGoldEffect);
                });
            }));
            if (removeThis) {
                Utils.removeThis(owner);
            }
        }
    }

    static footMonster(other) {
        if (GameContext.roleShuiGuanState == 1) {
            GameContext.roleShuiGuanState = 0;
        }
        if (GameContext.curFootMonster == other.owner) {
            return;
        }
        GameContext.curFootMonster = other.owner;
        Laya.timer.once(50, null, function() {
            GameContext.curFootMonster = null;
        });
        GameContext.roleInGround = false;
        GameContext.setRoleSpeed(0, GameContext.footMonsterSpeed.y);

        let owner = other.owner;
        let parent = owner.parent;

        let label = new Laya.Text();
        label.text = String(100);
        label.color = "#dbdb2b";
        label.fontSize = 24;
        parent.addChild(label);
        label.x = owner.x;
        label.y = owner.y - 50;

        Laya.Tween.to(label, {y: label.y - 60}, 500, null, Laya.Handler.create(null, function() {
            Utils.removeThis(label);
        }));

        EventMgr.getInstance().postEvent(Events.Monster_Foot_Dead, {owner: other.owner});
    }

    static roleInCeil(monster) {
        if (GameContext.role) {
            let offx = 40;
            let myX = GameContext.role.x + GameContext.role.width/2 * GameContext.role.scaleX;
            let myY = GameContext.role.y + GameContext.role.height * GameContext.role.scaleY;
            let monsterW = monster.width * monster.scaleX;
            let monsterH = monster.height * monster.scaleY;
            if (myX > monster.x - monsterW/2 - offx - 20 && myX < monster.x + monsterW/2 + offx && myY < monster.y - monsterH/2) {
                return true;
            }
        }
        return false;
    }

    static roleInFloor(brick) {
        if (GameContext.role) {
            let offx = 10;
            let myX = GameContext.role.x + GameContext.role.width/2 * GameContext.role.scaleX;
            let myY = GameContext.role.y;
            if (myX > brick.x - offx && myX < brick.x + brick.width * brick.scaleX + offx && myY > brick.y) {
                return true;
            }
        }
        return false;
    }


    static tryRemoveThis(owner) {
        if (owner && GameContext.role) {
            let distance = Math.abs(GameContext.role.x - owner.x);
            if (distance > GameContext.monsterArea) {
                Utils.removeThis(owner, true);
            }
        }
    }

    static createBulletEffect(bulletOwner) {
        if (!bulletOwner) {
            return;
        }
        let parent = bulletOwner.parent;
        let x = parent.x;
        let y = parent.y;
        Laya.loader.create("prefab/BulletEffect.prefab", Laya.Handler.create(null, function (prefabDef) {
            let effect = prefabDef.create();
            effect.x = x;
            effect.y = y;
            effect.zOrder = 65599;
            parent.addChild(effect);
            Laya.timer.once(500, null, function() {
                Utils.removeThis(effect);
            });
        }));
    }

    static removeThis(owner, resetCanAdd) {
        if (!owner) {
            return;
        }
        if (resetCanAdd == null || resetCanAdd == undefined) {
            resetCanAdd = false;
        }
        for (let index = 0; index < GameContext.monsters.length; index++) {
            let cell = GameContext.monsters[index];
            if (cell.monster == owner) {
                cell.monster = null;
                cell.canAdd = resetCanAdd;
                break;
            }
        }
        let colls = owner.getComponents(Laya.ColliderBase);
        if (colls) {
            for (let index = 0; index < colls.length; index++) {
                let cell = colls[index];
                cell.isSensor = true;
                cell.destroy();
            }
        }
        let rigidBody = owner.getComponent(Laya.RigidBody);
        if (rigidBody) {
            rigidBody.enabled = false;
            rigidBody.destroy();
        }
        owner.removeSelf();
        owner.destroy();
    }

    static getFaceUp(owner) {
        if (owner.scaleX > 0) {
            return 1;
        }
        return -1;
    }

    static getSign(x) {
        if (x > 0) {
            return 1;
        }
        return -1;
    }

    static randomSign() {
        let ret = Math.random();
        if (ret > 0.5) {
            return 1;
        }
        return -1
    }

    static randomDirect() {
        let x = Utils.randomSign();
        let y = Utils.randomSign();
        return {x: x, y: y};
    }

    static getDirect(dx, dy, sx, sy) {
        let x = dx - sx;
        let y = dy - sy;
        let p = new Laya.Point(x, y);
        p.normalize();
        let ret = {x: p.x, y: p.y};
        return ret;
    }

    static getDistance(dx, dy, sx, sy) {
        let p = new Laya.Point(dx, dy);
        let d =  p.distance(sx, sy);
        return d;
    }

    static createMonsterDropDeadEffect(owner) {
        if (!owner) {
            return;
        }
        let deadMove = owner.deadMove;
        if (deadMove != "") {
            EventMgr.getInstance().postEvent(Events.Monster_Stop_AI, {owner: owner});
            let x = owner.x;
            let y = owner.y;
            let parent = owner.parent;
            Laya.loader.create(deadMove, Laya.Handler.create(null, function (prefabDef) {
                let dead = prefabDef.create();
                dead.x = x;
                dead.y = y;
                parent.addChild(dead);
                let rigid = dead.getComponent(Laya.RigidBody);
                rigid.setAngle(owner.deadAngle);
                rigid.setVelocity({x: 3, y: -15});
                rigid.gravityScale = 5;
                Laya.timer.once(3000, null, function() {
                    Utils.removeThis(dead);
                });
            }));
        }
        Utils.removeThis(owner);
    }
}