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
        if (other && GameContext.curFootMonster == other.owner && 
            GameContext.curFootMonster != undefined &&
             GameContext.curFootMonster != null) {
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
        Utils.createFen(owner);
        EventMgr.getInstance().postEvent(Events.Monster_Foot_Dead, {owner: other.owner});
    }

    static createFen(owner) {
        if (!owner) {
            return;
        }
        let parent = owner.parent;
        if (!parent) {
            return;
        }
        if (owner.fen != 0 && owner.fen != undefined && owner.fen != null) {
            let label = new Laya.Text();
            label.text = String(owner.fen);
            label.color = "#e8efd9";
            label.fontSize = 30;
            parent.addChild(label);
            label.x = owner.x;
            label.y = owner.y - 80;
            GameContext.roleFen += Number(owner.fen);

            if (Laya.LocalStorage.support) {
                if (GameContext.roleFen > GameContext.maxRoleFen) {
                    GameContext.maxRoleFen = GameContext.roleFen;
                }
                Laya.LocalStorage.setItem("fen", String(GameContext.roleFen));
            }
            EventMgr.getInstance().postEvent(Events.Refresh_Fen_Number);
    
            Laya.Tween.to(label, {y: label.y - 60}, 500, null, Laya.Handler.create(null, function() {
                Utils.removeThis(label);
            }));
        }
    }

    static roleInCeil(monster) {
        if (GameContext.role) {
            let offx = 150;
            let myX = GameContext.role.x + GameContext.role.width/2 * GameContext.role.scaleX;
            let myY = GameContext.role.y + GameContext.role.height * GameContext.role.scaleY;
            let monsterW = monster.width * monster.scaleX;
            let monsterH = monster.height * monster.scaleY;
            let c1 = myX > monster.x - monsterW/2 - offx;
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
            let c1 = myX > monster.x - monsterW/2 - offx - 30;
            let c2 = myX < monster.x + monsterW/2 + offx + 30;
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
        Laya.timer.clearAll(owner);
        owner.offAll();
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
            Laya.timer.once(3000, null, function() {
                GameContext.isWin = false;
                GameContext.playRoleAni("stand");
                Laya.loader.create("prefab/other/BlackBox.prefab", Laya.Handler.create(null, function (prefabDef) {
                    let black = prefabDef.create();
                    Laya.stage.addChild(black);
                    black.x = 0;
                    black.y = 0;
                    black.zOrder = 9999999;
                    black.alpha = 0;
                    Laya.Tween.to(black,{alpha: 1}, 3000, null, Laya.Handler.create(null, function(){
                        Laya.timer.once(2000, this, function() {
                            LoadingLogic.loadScene(GameContext.gameGotoScene, Laya.Handler.create( this, function(){
                                Laya.Tween.to(black,{alpha: 0}, 300, null, Laya.Handler.create(null, function(){
                                    black.removeSelf();
                                    black.destroy();
                                }));
                            }));
                        });
                    }));
                }));
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
        GameContext.roleFlyState = false;
        if (GameContext.isDie) {
            return;
        }
        if (GameContext.protectedRole) {
            return;
        }
        if (GameContext.roleHurting) {
            return;
        }
        if (GameContext.curFootMonster) {
            return;
        }
        if (other && GameContext.curFootMonster == other.owner && 
            GameContext.curFootMonster != undefined &&
             GameContext.curFootMonster != null) {
            return;
        }
        GameContext.playRoleAni("");
        GameContext.playRoleAni("stand");
        let x = -1;
        if (other) {
            x = Utils.getSign(GameContext.role.x - other.x - other.width/2 );
        } else {
            x = GameContext.getRoleFaceup();
        }
        Utils.changeRoleState();
        if (x > 0) {
            GameContext.roleRigidBody.getBody().SetPositionXY((other.x + other.width + 100)/50, other.y/50);
        } else {
            GameContext.roleRigidBody.getBody().SetPositionXY((other.x - 100)/50, other.y/50);
        }
        GameContext.setRoleSpeed( x * 10, -10);
        GameContext.roleHurting = true;
        GameContext.keSpr.visible = false;
        Laya.timer.once(500, null, function() {
            GameContext.roleHurting = false;
            GameContext.commandWalk = true;
        });
        GameContext.protectedRole = true;
        GameContext.gameRoleWudi.visible = true;
        Laya.timer.once(2000, null, function() {
            GameContext.protectedRole = false;
            GameContext.gameRoleWudi.visible = false;
        });
        GameContext.gameRoleNumber--;
        Laya.SoundManager.playSound("loading/siwang.mp3");
        if (GameContext.gameRoleNumber == 0) {
            GameContext.playRoleAni("die", false);
            GameContext.gameRoleWudi.visible = false;
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
                    Utils.triggerGameOver();
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
                EventMgr.getInstance().postEvent(Events.Role_GoTo_Hole_Or_Water_Dead);
                let resetPos = GameContext.getLifePoint();
                GameContext.setRolePosition(resetPos.x, resetPos.y);
                GameContext.setRoleSpeed(0.01, 0.01);
                GameContext.gameRoleYaBian = false;
                GameContext.curCiBrick = null;
                Laya.Tween.to(black,{alpha: 0}, 100, null, Laya.Handler.create(null, function(){
                    black.removeSelf();
                    black.destroy();
                    GameContext.roleHurting = false;
                }));
            }));
        }));
    }

    static hurtRole(other) {
        GameContext.roleFlyState = false;
        if (!GameContext.role) {
            return;
        }
        if (GameContext.protectedRole) {
            return;
        }
        if (GameContext.isDie) {
            return;
        }
        if (other && other.name == "PenShuiMonsterEffect") {
            return;
        }
        if (GameContext.roleHurting) {
            return;
        }
        if (GameContext.roleIsDrop) {
            return;
        }
        if (other && other.owner && other.owner.isDie == true) {
            return;
        }
        if (GameContext.curFootMonster) {
            return;
        }
        if (other && GameContext.curFootMonster == other.owner && 
            GameContext.curFootMonster != undefined &&
             GameContext.curFootMonster != null) {
            return;
        }
        if (other && other.name == "BrickMonster") {
            if (other.footAni.visible == false) {
                return;
            }
        }
        GameContext.playRoleAni("");
        GameContext.playRoleAni("stand");
        let x = -1;
        if (other) {
            x = Utils.getSign(GameContext.role.x - other.x);
        } else {
            x = GameContext.getRoleFaceup();
        }
        if (GameContext.roleInWater) {
            GameContext.setRoleSpeed( x * 5, 0);
        } else {
            GameContext.setRoleSpeed( x * GameContext.roleHurtSpeed.x, GameContext.roleHurtSpeed.y);
        }
        let lastBodyState = GameContext.bodyState;
        Utils.changeRoleState()
        if (!GameContext.roleInWater) {
            GameContext.playRoleAni("stand");
            GameContext.roleInGround = false;
            GameContext.commandWalk = false;
        }
        GameContext.roleHurting = true;
        GameContext.protectedRole = true;
        GameContext.keSpr.visible = false;
        GameContext.gameRoleWudi.visible = true;
        Laya.timer.once(500, null, function() {
            if (lastBodyState != 0) {
                GameContext.roleHurting = false;
            }
            GameContext.commandWalk = true;
        });
        Laya.timer.once(2000, null, function() {
            GameContext.protectedRole = false;
            GameContext.gameRoleWudi.visible = false;
            if (GameContext.roleInGround) {
                GameContext.setRoleSpeed(0.01, 0.01);
            }
        });
        Laya.SoundManager.playSound("loading/siwang.mp3");
        if (lastBodyState == 0) {
            GameContext.gameRoleNumber--;
            if (GameContext.gameRoleNumber < 0) {
                GameContext.gameRoleNumber = 0;
            }
            EventMgr.getInstance().postEvent(Events.Refresh_Role_Number);
            GameContext.playRoleAni("die", false);
            GameContext.gameRoleWudi.visible = false;
            GameContext.isDie = true;
            let path = "prefab/other/BlackBox.prefab";
            if (GameContext.gameRoleNumber <= 0) {
                path = "prefab/other/BlackBox2.prefab"
            }
            Laya.loader.create(path, Laya.Handler.create(null, function (prefabDef) {
                let black = prefabDef.create();
                Laya.stage.addChild(black);
                black.x = 0;   
                black.y = 0;
                black.zOrder = 9999999;
                black.alpha = 0;
                Laya.Tween.to(black,{alpha: 1}, 1500, null, Laya.Handler.create(null, function(){
                    if (GameContext.gameRoleNumber > 0) {
                        EventMgr.getInstance().postEvent(Events.Role_GoTo_Hole_Or_Water_Dead);
                        let resetPos = GameContext.getLifePoint();
                        GameContext.setRolePosition(resetPos.x, resetPos.y);
                        GameContext.setRoleSpeed(0.01, 0.01);
                        GameContext.gameRoleYaBian = false;
                        GameContext.curCiBrick = null;
                        GameContext.roleHurting = false;
                        GameContext.isDie = false;
                        GameContext.playRoleAni("stand", true);
                        GameContext.walkDirect = null;
                        GameContext.roleIsDrop = false;
                        GameContext.roleInGround = true;
                        Laya.timer.once(1000, this, function() {
                            Laya.Tween.to(black,{alpha: 0}, 1000, null, Laya.Handler.create(null, function(){
                                black.removeSelf();
                                black.destroy();
                            }));
                        });
                    } else {
                        Laya.timer.once(1000, this, function() {
                            black.removeSelf();
                            black.destroy();
                            Utils.triggerGameOver();
                        });
                    }
                }));
            }));
            EventMgr.getInstance().postEvent(Events.Role_GoTo_Hole_Or_Water_Dead);
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
            EventMgr.getInstance().postEvent(Events.Refresh_Role_Number);
        }
    }

    static triggerInHuoChi(huochi, customX, customY) {
        if (!huochi) {
            return;
        }
        GameContext.roleIsDrop = true;
        Laya.SoundManager.playSound("loading/siwang.mp3");
        GameContext.gameRoleNumber--;
        if (GameContext.gameRoleNumber < 0) {
            GameContext.gameRoleNumber = 0;
        }
        EventMgr.getInstance().postEvent(Events.Refresh_Role_Number);
        GameContext.setRoleState(0);
        GameContext.setBodyState(0);
        GameContext.showHurtEffect();
        GameContext.roleIsDrop = true;
        GameContext.roleInGround = true;
        GameContext.setRoleSpeedX(0.01);
        let path = "prefab/other/BlackBox.prefab";
        if (GameContext.gameRoleNumber == 0) {
            path = "prefab/other/BlackBox2.prefab";
        }
        Laya.loader.create(path, Laya.Handler.create(null, function (prefabDef) {
            let black = prefabDef.create();
            Laya.stage.addChild(black);
            black.x = 0;
            black.y = 0;
            black.zOrder = 9999999;
            black.alpha = 0;
            Laya.Tween.to(black,{alpha: 1}, 1500, null, Laya.Handler.create(null, function(){
                if (GameContext.gameRoleNumber > 0) {
                    EventMgr.getInstance().postEvent(Events.Role_GoTo_Hole_Or_Water_Dead);
                    let resetPos = GameContext.getLifePoint();
                    GameContext.setRolePosition(resetPos.x, resetPos.y);
                    GameContext.setRoleSpeed(0.01, 0.01);
                    GameContext.gameRoleYaBian = false;
                    GameContext.curCiBrick = null;
                    GameContext.roleHurting = false;
                    GameContext.isDie = false;
                    GameContext.playRoleAni("stand", true);
                    GameContext.walkDirect = null;
                    GameContext.roleIsDrop = false;
                    EventMgr.getInstance().postEvent(Events.Refresh_Role_Number);
                    Laya.Tween.to(black,{alpha: 0}, 1000, null, Laya.Handler.create(null, function(){
                        black.removeSelf();
                        black.destroy();
                    }));
                } else {
                    Laya.timer.once(1000, this, function() {
                        Utils.triggerGameOver();
                        Laya.Tween.to(black,{alpha: 0}, 1000, null, Laya.Handler.create(null, function(){
                            black.removeSelf();
                            black.destroy();
                        }));
                    });
                }
            }));
        }));
    }


    static triggerGameOver() {
        if (GameContext.gameRoleNumber <= 0) {
            EventMgr.getInstance().postEvent(Events.Role_GoTo_Hole_Or_Water_Dead);
            GameContext.gameRoleNumber = GameContext.gameRoleNumberInit;
            GameContext.gameRoleBodyState = 0;
            GameContext.gameRoleState = 0;
            GameContext.gameGoldNumber = 0;
            GameContext.roleFen = 0;
            GameContext.roleFlyState = false;
            GameContext.roleFlyDrop = false;
            LoadingLogic.curScene = "";
            LoadingLogic.loadScene("scene/Level1_1.scene");
            return;
        }
    }

    static changeRoleState() {
        if (GameContext.gameRoleState == 1) {
            GameContext.setRoleState(0);
            GameContext.setBodyState(1);
        } else if (GameContext.bodyState == 1) {
            GameContext.setRoleState(0);
            GameContext.setBodyState(0);
            GameContext.changeSmallEffect();
        }
        GameContext.showHurtEffect();
        if (GameContext.roleShuiGuanState == 1) {
            GameContext.roleShuiGuanState = 0;
        }
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

    static triggerInLiuSha(liusha) {
        if (!liusha) {
            return;
        }

        let lastBodyState = GameContext.bodyState;
        GameContext.setRoleSensorEnabled(true);
        Utils.changeRoleState();
        Laya.SoundManager.playSound("loading/siwang.mp3");
        GameContext.gameRoleNumber--;
        if (GameContext.gameRoleNumber < 0) {
            GameContext.gameRoleNumber = 0;
        }
        let path = "prefab/other/BlackBox.prefab";
        if (GameContext.gameRoleNumber <= 0) {
            path = "prefab/other/BlackBox2.prefab";
        }
        EventMgr.getInstance().postEvent(Events.Refresh_Role_Number);
        GameContext.isDie = true;
        Laya.loader.create(path, Laya.Handler.create(null, function (prefabDef) {
            let black = prefabDef.create();
            Laya.stage.addChild(black);
            black.x = 0;   
            black.y = 0;
            black.zOrder = 9999999;
            black.alpha = 0;
            Laya.Tween.to(black,{alpha: 1}, 1000, null, Laya.Handler.create(null, function(){
                if (GameContext.gameRoleNumber > 0) {
                    EventMgr.getInstance().postEvent(Events.Role_GoTo_Hole_Or_Water_Dead);
                    let resetPos = GameContext.getLifePoint();
                    GameContext.setRoleSensorEnabled(false);
                    GameContext.setRolePosition(resetPos.x, resetPos.y);
                    GameContext.setRoleSpeed(0.01, 0.01);
                    GameContext.gameRoleYaBian = false;
                    GameContext.curCiBrick = null;
                    GameContext.roleHurting = false;
                    GameContext.isDie = false;
                    GameContext.playRoleAni("stand", true);
                    GameContext.walkDirect = null;
                    GameContext.roleIsDrop = false;
                    Laya.Tween.to(black,{alpha: 0}, 1000, null, Laya.Handler.create(null, function(){
                        black.removeSelf();
                        black.destroy();
                    }));
                } else {
                    Laya.timer.once(1000, this, function() {
                        Laya.Tween.to(black,{alpha: 0}, 1000, null, Laya.Handler.create(null, function(){
                            black.removeSelf();
                            black.destroy();
                        }));
                    });
                    Utils.triggerGameOver();
                }
            }));
        }));


        // if (GameContext.gameRoleState == 1) {
        //     GameContext.setRoleState(0);
        //     GameContext.setBodyState(1);
        // } else if (GameContext.bodyState == 1) {
        //     GameContext.setRoleState(0);
        //     GameContext.setBodyState(0);
        // }
        // GameContext.changeSmallEffect();
        // if (GameContext.roleShuiGuanState == 1) {
        //     GameContext.roleShuiGuanState = 0;
        // }
        // GameContext.setRoleSpeedX(0.01);
        // GameContext.setRolePosition(liusha.x - 200, 300);
    }

    static triggerGotoHole(hole, height, widthOff) {
        if (GameContext.isDie) {
            return;
        }
        if (height == undefined || height == null) {
            height = 300;
        }
        if (widthOff == undefined || widthOff == null) {
            widthOff = -200;
        }
        if (GameContext.roleIsDrop == true) {
            return;
        }
        GameContext.roleIsDrop = true;
        let lastBodyState = GameContext.bodyState;
        GameContext.setRoleSensorEnabled(true);
        Utils.changeRoleState();
        Laya.SoundManager.playSound("loading/siwang.mp3");
        if (lastBodyState == 0) {
            GameContext.gameRoleNumber--;
            if (GameContext.gameRoleNumber < 0) {
                GameContext.gameRoleNumber = 0;
            }
            let path = "prefab/other/BlackBox.prefab";
            if (GameContext.gameRoleNumber <= 0) {
                path = "prefab/other/BlackBox2.prefab";
            }
            EventMgr.getInstance().postEvent(Events.Refresh_Role_Number);
            GameContext.isDie = true;
            Laya.loader.create(path, Laya.Handler.create(null, function (prefabDef) {
                let black = prefabDef.create();
                Laya.stage.addChild(black);
                black.x = 0;   
                black.y = 0;
                black.zOrder = 9999999;
                black.alpha = 0;
                Laya.Tween.to(black,{alpha: 1}, 1000, null, Laya.Handler.create(null, function(){
                    if (GameContext.gameRoleNumber > 0) {
                        EventMgr.getInstance().postEvent(Events.Role_GoTo_Hole_Or_Water_Dead);
                        let resetPos = GameContext.getLifePoint();
                        GameContext.setRoleSensorEnabled(false);
                        GameContext.setRolePosition(resetPos.x, resetPos.y);
                        GameContext.setRoleSpeed(0.01, 0.01);
                        GameContext.gameRoleYaBian = false;
                        GameContext.curCiBrick = null;
                        GameContext.roleHurting = false;
                        GameContext.isDie = false;
                        GameContext.playRoleAni("stand", true);
                        GameContext.walkDirect = null;
                        GameContext.roleIsDrop = false;
                        Laya.Tween.to(black,{alpha: 0}, 1000, null, Laya.Handler.create(null, function(){
                            black.removeSelf();
                            black.destroy();
                        }));
                    } else {
                        Laya.timer.once(1000, this, function() {
                            Laya.Tween.to(black,{alpha: 0}, 1000, null, Laya.Handler.create(null, function(){
                                black.removeSelf();
                                black.destroy();
                            }));
                        });
                        Utils.triggerGameOver();
                    }
                }));
            }));
        } else {
            if (GameContext.role) {
                Laya.loader.create("prefab/other/BlackBox.prefab", Laya.Handler.create(null, function (prefabDef) {
                    let black = prefabDef.create();
                    Laya.stage.addChild(black);
                    black.x = 0;   
                    black.y = 0;
                    black.zOrder = 9999999;
                    black.alpha = 0;
                    GameContext.roleInGround = true;
                    Laya.Tween.to(black,{alpha: 1}, 300, null, Laya.Handler.create(null, function(){
                        GameContext.setRoleSensorEnabled(false);
                        GameContext.setRoleSpeed(0, 0);
                        GameContext.setRolePosition(hole.x + widthOff, height);
                        Laya.Tween.to(black,{alpha: 0}, 300, null, Laya.Handler.create(null, function(){
                            black.removeSelf();
                            black.destroy();
                            GameContext.roleIsDrop = false;
                        }));
                    }));
                }));
            }
        }
        EventMgr.getInstance().postEvent(Events.Refresh_Role_Number);
    }
}