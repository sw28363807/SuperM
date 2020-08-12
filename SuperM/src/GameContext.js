import EventMgr from "./script/EventMgr";
import Events from "./script/Events";

export default class GameContext extends Laya.Script {

    constructor() { 
        super();
    }

    static setRoleSensorEnabled(enabled) {
        if (enabled == true) {
            GameContext.roleHead.isSensor = true;
            GameContext.roleFoot.isSensor = true;
        } else {
            GameContext.roleHead.isSensor = false;
            GameContext.roleFoot.isSensor = false;
        }
        GameContext.roleBody.isSensor = true;
    }

    static triggerGotoHole(hole) {
        GameContext.roleIsDrop = true;
        GameContext.setRoleSensorEnabled(true);
        Laya.timer.once(1000, null, function() {
            if (GameContext.role) {
                GameContext.roleIsDrop = false;
                GameContext.setRoleSensorEnabled(false);
                GameContext.setRoleSpeed(0, 0);
                GameContext.setRolePosition(hole.x - 200, 300);
            }
        });
    }

    static setRoleSpeed(x, y) {
        if (GameContext.roleRigidBody) {
            GameContext.roleRigidBody.setVelocity({x: x, y: y});
        }        
    }

    static setRolePosition(x, y) {
        if (GameContext.roleRigidBody) {
            GameContext.roleRigidBody.getBody().SetPositionXY(x/50, y/50);
            GameContext.role.x = x;
            GameContext.role.y = y;
        }
    }

    static triggerRoleWin() {
        if (GameContext.role) {
            GameContext.initRolePoint = GameContext.initConstRolePoint;
            GameContext.isWin = true;
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
        if (GameContext.keSpr.visible) {
            if (GameContext.roleCurAni =="stand") {
                GameContext.roleSpr.play(0, loop, "zhuastand");
            } else if (GameContext.roleCurAni =="run") {
                GameContext.roleSpr.play(0, loop, "zhuarun");
            } else if (GameContext.roleCurAni =="jump") {
                GameContext.roleSpr.play(0, loop, "zhuajump");
            }
        } else {
            GameContext.roleSpr.play(0, loop, ani);
        }

        // Laya.timer.once(1000, null, function() {
        //     if (GameContext.roleCurAni == "stand" && GameContext.roleInGround == true && GameContext.commandWalk == false && GameContext.keSpr.visible == false) {
        //         GameContext.playRoleAni("kong1", true);
        //     }
        // });

    }

    static triggerRoleWinGotoDoor() {
        if (GameContext.role) {
            if (GameContext.isWin) {
                GameContext.setRoleMove(GameContext.roleSpeed, 0);
            }
            Laya.timer.once(2000, null, function() {
                GameContext.isWin = false;
                GameContext.playRoleAni("stand");
                Laya.Scene.close("scene/Level1_1.scene");
                Laya.Scene.open("scene/Level1_1.scene");
            });
            GameContext.playRoleAni("run");
        }
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

    static hurtRole() {
        if (!GameContext.role) {
            return;
        }
        if (GameContext.isDie) {
            return;
        }
        GameContext.setRoleMove(0, 0);
        GameContext.roleInGround = false;
        GameContext.roleShuiGuanState = 0;
        GameContext.setRoleSpeed(-GameContext.getRoleFaceup() * GameContext.roleHurtSpeed.x, GameContext.roleHurtSpeed.y);
        GameContext.showHurtEffect();
        GameContext.playRoleAni("stand");
        GameContext.roleInGround = false;
        GameContext.walkDirect = null;
        GameContext.roleHurting = true;

        GameContext.changeSmallEffect();
        GameContext.gameRoleNumber--;
        if (GameContext.gameRoleNumber == 0) {
            GameContext.playRoleAni("die", false);
            GameContext.isDie = true;
        }
        EventMgr.getInstance().postEvent(Events.Refresh_Role_Number);

    }

    static changeSmallEffect() {
        if (GameContext.isDie) {
            return;
        }
        if (GameContext.bodyState == 0) {
            return;
        }
        GameContext.bodyState = 0;
        Laya.Tween.to(GameContext.role, {scaleX: GameContext.bodySmallScale, scaleY: GameContext.bodySmallScale}, 1500, Laya.Ease.elasticOut, Laya.Handler.create(null, function() {
            GameContext.setBodyState(0);
        }));        
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

    static footMonster(other) {
        GameContext.roleInGround = false;
        GameContext.roleShuiGuanState = 0;
        GameContext.setRoleSpeed(GameContext.getRoleFaceup() * GameContext.footMonsterSpeed.x, GameContext.footMonsterSpeed.y);
        EventMgr.getInstance().postEvent(Events.Monster_Foot_Dead, {owner: other.owner});
    }

    static showHurtEffect() {
        if (!GameContext.role) {
            return;
        }
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
        if (GameContext.bodyState == 0) {
            return;
        }
        GameContext.bodyState = 0;
        Laya.Tween.to(GameContext.role, {scaleX: GameContext.bodySmallScale, scaleY: GameContext.bodySmallScale}, 1500, Laya.Ease.elasticOut, Laya.Handler.create(null, function() {
            GameContext.setBodyState(0);
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
        GameContext.bodyState = bodyState;
        GameContext.gameRoleBodyState = GameContext.bodyState;
        if (GameContext.bodyState == 0) {
            GameContext.curScaleFactor = GameContext.bodySmallScale;
        } else {
            GameContext.curScaleFactor = GameContext.bodyBigScale;
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
    }

    static upShuiGuan(owner) {
        
    }

    static downShuiGuan(owner) {

    }

    onEnable() {
    }

    onDisable() {
    }
}

GameContext.role = null;
GameContext.roleHead = null;
GameContext.roleBody = null;
GameContext.roleFoot = null;
GameContext.roleInGround = false;
GameContext.roleIsDrop = false;
GameContext.roleHurting = false;
GameContext.roleShuiGuanState = 0; // 0 不在水管 1 进水管 2 出水管 3正在播放过度动画
GameContext.ShuiguanIndex = 0;
GameContext.roleRigidBody = null;
GameContext.commandWalk = false;
GameContext.isDie = false;
GameContext.walkDirect = null;
GameContext.isWin = false;
GameContext.roleSpeed = 9;
GameContext.roleCurAni = "";
GameContext.roleSpr = null;
GameContext.keSpr = null;
GameContext.roleHurtSpeed = {x: 9, y: -10};
GameContext.footMonsterSpeed = {x: 9, y: -10};
GameContext.bodyBigScale = 1;
GameContext.bodySmallScale = 0.6;
GameContext.curScaleFactor = GameContext.bodySmallScale;
GameContext.roleJumpSpeed = -30;

GameContext.joyStickScene = null;
GameContext.gameTopScene = null;
GameContext.joyStickDirect = null;
GameContext.initRolePoint = null;
GameContext.initConstRolePoint = {x: 961, y: 638};
GameContext.initRoleByShuiGuan = false;

GameContext.gameRoleNumber = 998;
GameContext.gameGoldNumber = 0;
GameContext.gameRoleBodyState = 0;
GameContext.gameRoleState = 0;


GameContext.gameScene = null;