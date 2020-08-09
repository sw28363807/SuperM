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
        }
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
GameContext.roleShuiGuanState = 0;
GameContext.roleRigidBody = null;
GameContext.commandWalk = false;
GameContext.isDie = false;
GameContext.walkDirect = null;

GameContext.joyStickScene = null;
GameContext.gameTopScene = null;
GameContext.joyStickDirect = null;
GameContext.initRolePoint = null;

GameContext.gameRoleNumber = 998;
GameContext.gameGoldNumber = 0;
GameContext.gameRoleBodyState = 0;
GameContext.gameRoleState = 0;


GameContext.gameScene = null;