export default class GameContext extends Laya.Script {

    constructor() { 
        super();
    }
    
    onEnable() {
    }

    onDisable() {
    }
}

GameContext.role = null;
GameContext.joyStickScene = null;
GameContext.gameTopScene = null;
GameContext.joyStickDirect = null;
GameContext.initRolePoint = null;

GameContext.gameRoleNumber = 998;
GameContext.gameGoldNumber = 0;
GameContext.gameRoleBodyState = 0;
GameContext.gameRoleState = 0;
GameContext.gameDebugMonsterNotRun = false;


GameContext.gameScene = null;