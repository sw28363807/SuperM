import GameContext from "../GameContext";
import Events from "./Events";
import EventMgr from "./EventMgr";
import LoadingLogic from "./LoadingLogic";

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
                if (parent && prefabDef) {
                    let BrickGoldEffect = prefabDef.create();
                    if (BrickGoldEffect) {
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
                    }
                }

            }));
            if (removeThis) {
                Utils.removeThis(owner);
            }
        }
    }

    static createFootEffect(owner) {
        let deadMove = owner.deadMove;
        if (deadMove != "") {
            // EventMgr.getInstance().postEvent(Events.Monster_Stop_AI, {owner: owner});
            let x = owner.x;
            let y = owner.y;
            let parent = owner.parent;
            let faceUp = Utils.getFaceUp(owner);
            Laya.loader.create(deadMove, Laya.Handler.create(this, function (prefabDef) {
                let dead = prefabDef.create();
                dead.x = x;
                dead.y = y;
                dead.scaleX = faceUp * Math.abs(dead.scaleX);
                parent.addChild(dead);
                let rigid = dead.getComponent(Laya.RigidBody);
                rigid.enabled = false;
                Laya.Tween.to(dead, {scaleY: 0.2}, 100, null, Laya.Handler.create(this, function () {
                    Laya.timer.once(200, dead, function() {
                        Utils.removeThis(dead);
                    });
                }));
            }));
        }
        Utils.removeThis(owner);
    }
    
    static footMonster(other) {
        if (GameContext.roleShuiGuanState == 1) {
            GameContext.roleShuiGuanState = 0;
        }
        if (GameContext.curFootMonster) {
            return;
        }
        if (GameContext.curFootMonster == other.owner) {
            return;
        }
        if (other.owner.createdMonster && other.owner.createdMonster == true) {
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
            let offx = 60;
            let myX = GameContext.role.x + GameContext.role.width/2 * GameContext.role.scaleX;
            let myY = GameContext.role.y + GameContext.role.height * GameContext.role.scaleY;
            let monsterW = monster.width * monster.scaleX;
            let monsterH = monster.height * monster.scaleY;
            let c1 = myX > monster.x - monsterW/2 - offx - 20;
            let c2 = myX < monster.x + monsterW/2 + offx;
            let c3 = myY < monster.y - monsterH/2;
            if (c1 && c2 && c3) {
                return true;
            }
        }
        return false;
    }

    static roleInCeil2(monster) {
        if (GameContext.role) {
            let offx = 60;
            let myX = GameContext.role.x + GameContext.role.width/2 * GameContext.role.scaleX;
            let myY = GameContext.role.y + GameContext.role.height * GameContext.role.scaleY;
            let monsterW = monster.width * monster.scaleX;
            let monsterH = monster.height * monster.scaleY;
            let c1 = myX > monster.x - monsterW/2 - offx - 20;
            let c2 = myX < monster.x + monsterW/2 + offx;
            let c3 = myY < monster.y + 10;
            if (c1 && c2 && c3) {
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

    static roleInFloor2(brick) {
        if (GameContext.role) {
            let offx = 10;
            let myX = GameContext.role.x + GameContext.role.width/2 * GameContext.role.scaleX;
            let myY = GameContext.role.y;
            let c1 = myX > brick.x - offx;
            let c2 = myX < brick.x + brick.width * brick.scaleX + offx;
            let c3 = myY > brick.y + brick.height/2 * brick.scaleY;
            if (c3 && c1 && c2) {
                return true;
            }
        }
        return false;
    }


    static tryRemoveThis(owner) {
        if (owner && GameContext.role) {
            let distanceX = Math.abs(GameContext.role.x - owner.x);
            let distanceY = Math.abs(GameContext.role.y - owner.y);
            if (distanceX > GameContext.monsterArea || distanceY > GameContext.monsterAreaY) {
                Utils.removeThis(owner, true);
            }
        }
    }

    static createBulletEffect(bulletOwner, customOffX, customOffY) {
        if (!bulletOwner) {
            return;
        }
        let parent = bulletOwner.parent;
        let x = bulletOwner.x;
        let y = bulletOwner.y;
        if (customOffX == null || customOffX == undefined) {
            customOffX = 30;
        }

        if (customOffY == null || customOffY == undefined) {
            customOffY = 20;
        }
        Laya.loader.create("prefab/BulletEffect.prefab", Laya.Handler.create(null, function (prefabDef) {
            let effect = prefabDef.create();
            effect.x = x + customOffX;
            effect.y = y + customOffY;
            effect.zOrder = 65599;
            parent.addChild(effect);
            Laya.timer.once(300, null, function() {
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
        Laya.Resource.destroyUnusedResources();
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

    static triggerRoleWinGotoDoor() {
        if (GameContext.role) {
            if (GameContext.isWin) {
                GameContext.playRoleAni("run");
                let scaleX = Math.abs(GameContext.roleSpr.scaleX);
                GameContext.roleSpr.scaleX = scaleX;
                scaleX =  Math.abs(GameContext.keSpr.scaleX);
                GameContext.keSpr.scaleX = scaleX;
                GameContext.setRoleMove(GameContext.roleSpeed, 0);
            }
            Laya.timer.once(2000, null, function() {
                GameContext.isWin = false;
                GameContext.playRoleAni("stand");
                LoadingLogic.loadScene(GameContext.gameGotoScene);
            });
            GameContext.playRoleAni("run");
            GameContext.initRolePoint = null;
        }
    }

    static createMonsterDropDeadEffect(owner) {
        if (!owner) {
            return;
        }
        let deadMove = owner.deadMove;
        if (deadMove != "" && deadMove != undefined && deadMove != null) {
            // EventMgr.getInstance().postEvent(Events.Monster_Stop_AI, {owner: owner});
            let x = owner.x;
            let y = owner.y;
            let parent = owner.parent;
            Laya.loader.create(deadMove, Laya.Handler.create(null, function (prefabDef) {
                if (parent && prefabDef && owner) {
                    let dead = prefabDef.create();
                    if (dead) {
                        dead.x = x;
                        dead.y = y;
                        parent.addChild(dead);
                        let rigid = dead.getComponent(Laya.RigidBody);
                        if (rigid && owner.deadAngle) {
                            rigid.setAngle(owner.deadAngle);
                            rigid.setVelocity({x: 3, y: -15});
                            rigid.gravityScale = 5;
                            Laya.timer.once(3000, null, function() {
                                Utils.removeThis(dead);
                            });
                        }
                    }
                }
            }));
        }
        Utils.removeThis(owner);
    }

    static bossHurtRole(other) {
        if (!GameContext.role) {
            return;
        }
        if (GameContext.isDie) {
            return;
        }
        if (GameContext.roleHurting) {
            return;
        }
        GameContext.roleFlyState = false;
        GameContext.playRoleAni("");
        GameContext.playRoleAni("stand");
        let x = -1;
        if (other) {
            x = Utils.getSign(GameContext.role.x - other.x - other.width/2 );
        } else {
            x = GameContext.getRoleFaceup();
        }
        GameContext.showHurtEffect();
        if (GameContext.gameRoleState == 1) {
            GameContext.setRoleState(0);
            GameContext.setBodyState(1);
        } else if (GameContext.bodyState == 1) {
            GameContext.setRoleState(0);
            GameContext.setBodyState(0);
            GameContext.changeSmallEffect();
        }
        if (GameContext.roleShuiGuanState == 1) {
            GameContext.roleShuiGuanState = 0;
        }
        if (x > 0) {
            GameContext.roleRigidBody.getBody().SetPositionXY((other.x + other.width + 100)/50, other.y/50);
        } else {
            GameContext.roleRigidBody.getBody().SetPositionXY((other.x - 100)/50, other.y/50);
        }
        GameContext.setRoleSpeed( x * 10, -10);
        GameContext.roleHurting = true;
        Laya.timer.once(1000, null, function() {
            GameContext.roleHurting = false;
            GameContext.commandWalk = true;
        });
        GameContext.gameRoleNumber--;
        if (GameContext.gameRoleNumber == 0) {
            GameContext.playRoleAni("die", false);
            GameContext.isDie = true;
            Laya.loader.create("prefab/other/BlackBox.prefab", Laya.Handler.create(null, function (prefabDef) {
                let black = prefabDef.create();
                Laya.stage.addChild(black);
                black.x = 0;   
                black.y = 0;
                black.zOrder = 9999999;
                black.alpha = 0;
                Laya.Tween.to(black,{alpha: 1}, 3000, null, Laya.Handler.create(null, function(){
                    black.removeSelf();
                    black.destroy();
                    GameContext.gameRoleNumber = GameContext.gameRoleNumberInit;
                    EventMgr.getInstance().postEvent(Events.Refresh_Role_Number);
                    LoadingLogic.loadScene("scene/Level1_1.scene");
                }));
            }));
        }
        EventMgr.getInstance().postEvent(Events.Refresh_Role_Number);
    }

    static dieResetRole() {
        Laya.loader.create("prefab/other/BlackBox.prefab", Laya.Handler.create(null, function (prefabDef) {
            let black = prefabDef.create();
            Laya.stage.addChild(black);
            black.x = 0;
            black.y = 0;
            black.zOrder = 9999999;
            black.alpha = 0;
            Laya.Tween.to(black,{alpha: 1}, 100, null, Laya.Handler.create(null, function(){
                if (GameContext.resetRolePoint) {
                    GameContext.setRolePosition(GameContext.resetRolePoint.x, GameContext.resetRolePoint.y);
                    GameContext.setRoleSpeed(0.01, 0.01);
                    GameContext.gameRoleYaBian = false;
                    GameContext.curCiBrick = null;
                }
                Laya.Tween.to(black,{alpha: 0}, 100, null, Laya.Handler.create(null, function(){
                    black.removeSelf();
                    black.destroy();
                    GameContext.roleHurting = false;
                }));
            }));
        }));
    }

    static hurtRole(other) {
        if (!GameContext.role) {
            return;
        }
        if (GameContext.isDie) {
            return;
        }
        if (GameContext.roleHurting) {
            return;
        }
        if (other && other.name == "BrickMonster") {
            if (other.footAni.visible == false) {
                return;
            }
        }
        GameContext.roleFlyState = false;
        GameContext.playRoleAni("");
        GameContext.playRoleAni("stand");
        let x = -1;
        if (other) {
            x = Utils.getSign(GameContext.role.x - other.x);
        } else {
            x = GameContext.getRoleFaceup();
        }
        GameContext.showHurtEffect();
        if (GameContext.roleInWater) {
            GameContext.setRoleSpeed( x * 5, 0);
        } else {
            GameContext.setRoleSpeed( x * GameContext.roleHurtSpeed.x, GameContext.roleHurtSpeed.y);
        }
        let lastBodyState = GameContext.bodyState;
        if (GameContext.gameRoleState == 1) {
            GameContext.setRoleState(0);
            GameContext.setBodyState(1);
        } else if (GameContext.bodyState == 1) {
            GameContext.setRoleState(0);
            GameContext.setBodyState(0);
            GameContext.changeSmallEffect();
        }
        if (GameContext.roleShuiGuanState == 1) {
            GameContext.roleShuiGuanState = 0;
        }
        if (!GameContext.roleInWater) {
            GameContext.playRoleAni("stand");
            GameContext.roleInGround = false;
            GameContext.commandWalk = false;
        }
        GameContext.roleHurting = true;
        Laya.timer.once(500, null, function() {
            if (lastBodyState != 0) {
                GameContext.roleHurting = false;
            }
            GameContext.commandWalk = true;
        });
        GameContext.gameRoleNumber--;
        if (GameContext.gameRoleNumber == 0) {
            GameContext.playRoleAni("die", false);
            GameContext.isDie = true;
            Laya.loader.create("prefab/other/BlackBox.prefab", Laya.Handler.create(null, function (prefabDef) {
                let black = prefabDef.create();
                Laya.stage.addChild(black);
                black.x = 0;   
                black.y = 0;
                black.zOrder = 9999999;
                black.alpha = 0;
                Laya.Tween.to(black,{alpha: 1}, 3000, null, Laya.Handler.create(null, function(){
                    black.removeSelf();
                    black.destroy();
                    GameContext.gameRoleNumber = GameContext.gameRoleNumberInit;
                    EventMgr.getInstance().postEvent(Events.Refresh_Role_Number);
                    if (LoadingLogic.curSceneExt != "") {
                        if (LoadingLogic.curScene == "scene/LevelBoss.scene") {
                            LoadingLogic.loadScene("scene/Level1_1.scene");
                        } else {
                            LoadingLogic.loadScene(LoadingLogic.curSceneExt);
                        }
                    }
                    
                }));
            }));
        } else {
            if (other && other.name == "BrickMonster") {
                if (other.footAni.visible == true) {
                    Laya.timer.once(500, this, function() {
                        if (other) {
                            other.state = 0;
                            other.idlePoint.x = other.startPoint.x;
                            other.idlePoint.y = other.startPoint.y;
                            let body = other.rigidBody.getBody();
                            body.SetPositionXY(other.idlePoint.x/50, other.idlePoint.y/50);
                        }
                    });
                    Utils.yabianRole();
                }
            }
            else if (other && (other.name == "CiQiu" || other.name == "BigRedFish")) {
                Utils.dieResetRole();
            }
            else if (lastBodyState == 0) {
                Utils.dieResetRole();
            }
        }
        EventMgr.getInstance().postEvent(Events.Refresh_Role_Number);
    }

    static triggerToRandomDoor(owner, destScene, loadingIndex, gotoPoint) {
        if (GameContext.doorCount >= 9) {
            GameContext.doorCount = 0;
            if (loadingIndex == null || loadingIndex == undefined) {
                loadingIndex = 1;
            }
            LoadingLogic.loadScene(destScene);
            return;
        }
        GameContext.roleRigidBody.getBody().SetActive(false);
        Laya.loader.create("prefab/other/BlackBox.prefab", Laya.Handler.create(null, function (prefabDef) {
            let black = prefabDef.create();
            Laya.stage.addChild(black);
            black.x = 0;   
            black.y = 0;
            black.zOrder = 9999999;
            black.alpha = 0;
            Laya.Tween.to(black,{alpha: 1}, 500, null, Laya.Handler.create(null, function(){
                GameContext.doorCount++;
                GameContext.doorInitPoint = gotoPoint;
                LoadingLogic.loadScene(destScene, Laya.Handler.create(this, function() {
                    black.removeSelf();
                    black.destroy();
                }));
            }));
        }));
    }

    static yabianRole() {
        GameContext.playRoleAni("yabian", false);
        GameContext.gameRoleYaBian = true;
        Laya.timer.once(500, null, function() {
            Utils.dieResetRole();
        });
    }

    static createBrickBrokenEffect(owner) {
        if (!owner) {
            return;
        }
        let x = owner.x;
        let y = owner.y;
        let parent = owner.parent;
        for (let index = 0; index < 4; index++) {
            Laya.loader.create("prefab/bb/b"+ String(index + 1)+".prefab", Laya.Handler.create(this, function (prefabDef) {
                if (parent && prefabDef) {
                    let brokenBrick = prefabDef.create();
                    parent.addChild(brokenBrick);
                    brokenBrick.x = x;   
                    brokenBrick.y = y;
                }
            }));
        }
    }
}