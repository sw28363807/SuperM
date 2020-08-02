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

GameContext.gameRoleNumber = 3;
GameContext.gameGoldNumber = 0;
GameContext.gameRoleBodyState = 0;