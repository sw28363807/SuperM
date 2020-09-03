import EventMgr from "./script/EventMgr";
import Events from "./script/Events";

export default class GameContext extends Laya.Script {

    constructor() { 
        super();
    }

    static setRoleSensorEnabled(enabled) {
        let colls =  GameContext.role.getComponents(Laya.ColliderBase);
        for (let index = 0; index < colls.length; index++) {
            let coll = colls[index];
            if (enabled == true) {
                coll.isSensor = true;
            } else {
                coll.isSensor = false;
            }
            
        }
    }

    static triggerGotoHole(hole, height, widthOff) {
        if (height == undefined || height == null) {
            height = 300;
        }
        if (widthOff == undefined || widthOff == null) {
            widthOff = -200;
        }
        GameContext.roleIsDrop = true;
        GameContext.setRoleSensorEnabled(true);
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
        Laya.timer.once(1000, null, function() {
            if (GameContext.role) {
                GameContext.roleIsDrop = false;
                GameContext.setRoleSensorEnabled(false);
                GameContext.setRoleSpeed(0, 0);
                GameContext.setRolePosition(hole.x + widthOff, height);
                EventMgr.getInstance().postEvent(Events.Role_GoTo_Hole_Or_Water_Dead);
            }
        });
    }

    static triggerInLiuSha(liusha) {
        if (!liusha) {
            return;
        }
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
        GameContext.setRoleSpeedX(0.01);
        GameContext.setRolePosition(liusha.x - 200, 300);
    }

    static triggerInHuoChi(huochi) {
        if (!huochi) {
            return;
        }
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
        GameContext.setRoleSpeedX(0.01);
        GameContext.setRolePosition(huochi.x - 200, 300);
    }

    static setRoleSpeed(x, y) {
        if (GameContext.roleRigidBody) {
            GameContext.roleRigidBody.setVelocity({x: x, y: y});
        }
    }

    static setRoleSpeedX(x) {
        let linearVelocity = GameContext.roleRigidBody.linearVelocity;
        GameContext.roleRigidBody.setVelocity({x: x, y: linearVelocity.y});
    }

    static setRoleSpeedY(y) {
        let linearVelocity = GameContext.roleRigidBody.linearVelocity;
        GameContext.roleRigidBody.setVelocity({x: linearVelocity.x, y: y});
    }

    static setRolePosition(x, y) {
        if (GameContext.roleRigidBody) {
            GameContext.roleRigidBody.getBody().SetPositionXY(x/50, y/50);
            GameContext.role.x = x;
            GameContext.role.y = y;
        }
    }

    static setRolePositionX(x) {
        if (GameContext.roleRigidBody) {
            let y = GameContext.roleRigidBody.getBody().GetPosition().y;
            GameContext.roleRigidBody.getBody().SetPositionXY(x/50, y);
            GameContext.role.x = x;
        }
    }

    static triggerRoleWin() {
        if (GameContext.role) {
            GameContext.initRolePoint = GameContext.initConstRolePoint;
            GameContext.isWin = true;
        }
    }

    static processFaceUp() {
        if (!GameContext.role) {
            return;
        }
        if (GameContext.isDie) {
            return;
        }
        if (GameContext.walkDirect) {
            let x = GameContext.walkDirect.x;
            if (x > 0) {
               let scaleX =  Math.abs(GameContext.roleSpr.scaleX);
               GameContext.roleSpr.scaleX = scaleX;
               scaleX =  Math.abs(GameContext.keSpr.scaleX);
               GameContext.keSpr.scaleX = scaleX;
            }
            else if (x < 0) {
                let scaleX =  -1 * Math.abs(GameContext.roleSpr.scaleX);
                GameContext.roleSpr.scaleX = scaleX;

                scaleX =  -1 * Math.abs(GameContext.keSpr.scaleX);
                GameContext.keSpr.scaleX = scaleX;
            }
        }
    }

    static setRoleMove(x, y) {
        if (!GameContext.role) {
            return;
        }
        if (GameContext.isDie) {
            return;
        }
        GameContext.setRoleSpeed(x, y);
    }

    static playRoleAni(ani, loop) {
        if (!GameContext.role) {
            return;
        }
        if (GameContext.isDie) {
            return;
        }
        if (GameContext.roleCurAni == ani) {
            return;
        }
        if (loop == null || loop == undefined) {
            loop = true;
        }
        GameContext.roleCurAni = ani;
        let pref = "";
        if (GameContext.roleFlyState &&
            ani != "fly" &&
             ani != "youyong") {
            pref = "fly";
        }
        if (GameContext.keSpr.visible) {
            if (GameContext.roleCurAni =="stand") {
                GameContext.roleSpr.play(0, loop, pref+"zhuastand");
            } else if (GameContext.roleCurAni =="run") {
                GameContext.roleSpr.play(0, loop, pref+"zhuarun");
            } else if (GameContext.roleCurAni =="jump") {
                GameContext.roleSpr.play(0, loop, pref+"zhuajump");
            }
        } else {
            GameContext.roleSpr.play(0, loop, pref+ani);
        }

        // Laya.timer.once(1000, null, function() {
        //     if (GameContext.roleCurAni == "stand" && GameContext.roleInGround == true && GameContext.commandWalk == false && GameContext.keSpr.visible == false) {
        //         GameContext.playRoleAni("kong1", true);
        //     }
        // });

    }

    static getLineSpeed() {
        if (!GameContext.role) {
            return;
        }
        if (GameContext.roleRigidBody) {
            let linearVelocity = GameContext.roleRigidBody.linearVelocity;
            return linearVelocity;
        }   
        return {x: 0, y: 0};
    }

    static getRoleFaceup() {
        if (GameContext.roleSpr.scaleX > 0) {
            return 1
        }
        return -1;
    }

    static alphaEffect(alpha, handler) {
        if (!GameContext.role) {
            return;
        }
        Laya.Tween.to(GameContext.roleSpr, {alpha: alpha}, 100, Laya.Ease.elasticOut, handler, 0);
    }

    static showHurtEffect() {
        if (!GameContext.role) {
            return;
        }
        GameContext.roleNormal.alpha = 1;
        GameContext.roleLight.alpha = 1;
        GameContext.alphaEffect(0, Laya.Handler.create(null, function() {
            GameContext.alphaEffect(1, Laya.Handler.create(null, function() {
                GameContext.alphaEffect(1, Laya.Handler.create(null, function() {
                    GameContext.alphaEffect(0, Laya.Handler.create(null, function() {
                        GameContext.alphaEffect(1, Laya.Handler.create(null, function() {
                        }) );
                    }) );
                }) );
            }) );
        }) );
    }
    
    static changeSmallEffect() {
        if (GameContext.isDie) {
            return;
        }
        Laya.Tween.to(GameContext.role, {scaleX: GameContext.bodySmallScale, scaleY: GameContext.bodySmallScale}, 1500, Laya.Ease.elasticOut, Laya.Handler.create(null, function() {
        })); 
    }

    // 0 小孩 1长大
    static setBodyState(bodyState) {
        if (!GameContext.role) {
            return;
        }
        if (GameContext.isDie) {
            return;
        }
        GameContext.roleNormal.alpha = 1;
        GameContext.roleLight.alpha = 1;
        GameContext.bodyState = bodyState;
        GameContext.gameRoleBodyState = GameContext.bodyState;
        if (GameContext.bodyState == 0) {
            GameContext.curScaleFactor = GameContext.bodySmallScale;
            GameContext.keSpr.scaleX = 1/GameContext.bodySmallScale;
            GameContext.keSpr.scaleY = 1/GameContext.bodySmallScale;
        } else {
            GameContext.curScaleFactor = GameContext.bodyBigScale;
            GameContext.keSpr.scaleX = 1;
            GameContext.keSpr.scaleY = 1;
        }
        GameContext.role.scaleX = GameContext.curScaleFactor;
        GameContext.role.scaleY = GameContext.curScaleFactor;
    }

    // 0 正常 1子弹
    static setRoleState(state) {
        if (GameContext.isDie) {
            return;
        }
        GameContext.gameRoleState = state;
        GameContext.roleNormal.visible = false;
        GameContext.roleLight.visible = false;
        GameContext.roleNormal.alpha = 1;
        GameContext.roleLight.alpha = 1;
        if (state == 0) {
            GameContext.roleSpr = GameContext.roleNormal;
        } else {
            GameContext.roleSpr = GameContext.roleLight;
        }
        GameContext.roleSpr.visible = true;
        let ani = GameContext.roleCurAni;
        GameContext.roleCurAni = "";
        GameContext.playRoleAni(ani);
    }

    static processRoleWalkSpeed() {
        if (GameContext.roleSpeed == GameContext.roleSpeedMax) {
            return GameContext.roleSpeedMax;
        }
        if (GameContext.roleSpeed > GameContext.roleSpeedMax) {
            GameContext.roleSpeed = GameContext.roleSpeedMax;
            return GameContext.roleSpeedMax;
        }
        GameContext.roleSpeed = GameContext.roleSpeed + GameContext.roleASpeed;
        return GameContext.roleSpeed;
    }

    static resetRoleWalkSpeed() {
        GameContext.roleSpeed = GameContext.roleSpeedBase;
    }

    static setRoleGravityScale(value) {
        GameContext.roleTempGravityScale = GameContext.roleGravityScale;
        GameContext.roleGravityScale = value;
        GameContext.roleRigidBody.gravityScale = value;
        GameContext.roleRigidBody.gravityScale = GameContext.roleGravityScale;
    }

    onEnable() {
    }

    onDisable() {
    }
}

GameContext.role = null;
GameContext.roleGravityScale = 1;
GameContext.roleTempGravityScale = 1;
GameContext.roleInGround = false;
GameContext.roleInWater = false;
GameContext.roleCommandFly = false;
GameContext.roleFlyState = false;
GameContext.roleInWaterObject = null;
GameContext.roleInMoveGround = false;
GameContext.roleInMoveGroundObject = null;
GameContext.roleIsDrop = false;
GameContext.roleHurting = false;
GameContext.roleShuiGuanState = 0; // 0 不在水管 1 进水管 2 正在播放过度动画
GameContext.roleCurrentShuiguan = null;
GameContext.roleInLiuSha = false;
GameContext.curRoleLiuSha = null;
GameContext.sgOutIndex = 0;
GameContext.ShuiguanIndex = 0;
GameContext.roleRigidBody = null;
GameContext.commandWalk = false;
GameContext.isDie = false;
GameContext.walkDirect = null;
GameContext.isWin = false;
GameContext.roleSpeedBase = 4;
GameContext.roleSpeed = 0;
GameContext.roleSpeedMax = 8;
GameContext.roleASpeed = 0.5;
GameContext.roleCurAni = "";
GameContext.roleRoot = null;
GameContext.roleSpr = null;
GameContext.roleNormal = null;
GameContext.roleLight = null;
GameContext.keSpr = null;
GameContext.roleHurtSpeed = {x: 5, y: -9};
GameContext.footMonsterSpeed = {x: 5, y: -10};
GameContext.bodyBigScale = 1;
GameContext.bodySmallScale = 0.6;
GameContext.curScaleFactor = GameContext.bodySmallScale;
GameContext.roleJumpSpeed = -26;
GameContext.roleSmallJumpSpeed = -26 * 0.96;

GameContext.joyStickScene = null;
GameContext.gameTopScene = null;
GameContext.joyStickDirect = null;
GameContext.initRolePoint = null;
GameContext.initConstRolePoint = {x: 961, y: 638};
GameContext.mapMaxX = 0;
GameContext.gameRoleNumber = 998;
GameContext.gameGoldNumber = 0;
GameContext.gameRoleBodyState = 0;
GameContext.gameRoleState = 0;

GameContext.gameGotoScene = "";
GameContext.gameScene = null;
GameContext.gameSceneType = 0;

GameContext.curFootMonster = null;
GameContext.brokenBrickTick = 0;

GameContext.monsters = [];
GameContext.monsterArea = 1000;
GameContext.monsterAreaY = 800;

GameContext.DeadWaterY = 0;