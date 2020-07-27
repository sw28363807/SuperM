/**This class is automatically generated by LayaAirIDE, please do not make any modifications. */
import JoyStick from "./script/JoyStick"
import JoyStickButton from "./script/JoyStickButton"
import AdjustScene from "./script/AdjustScene"
import GameJoyStick from "./script/GameJoyStick"
import Camera from "./script/Camera"
import LevelLogic from "./script/LevelLogic"
import GameUI from "./script/GameUI"
import GameControl from "./script/GameControl"
import Bullet from "./script/Bullet"
import DropBox from "./script/DropBox"
import Role from "./script/Role"

export default class GameConfig {
    static init() {
        //注册Script或者Runtime引用
        let reg = Laya.ClassUtils.regClass;
		reg("script/JoyStick.js",JoyStick);
		reg("script/JoyStickButton.js",JoyStickButton);
		reg("script/AdjustScene.js",AdjustScene);
		reg("script/GameJoyStick.js",GameJoyStick);
		reg("script/Camera.js",Camera);
		reg("script/LevelLogic.js",LevelLogic);
		reg("script/GameUI.js",GameUI);
		reg("script/GameControl.js",GameControl);
		reg("script/Bullet.js",Bullet);
		reg("script/DropBox.js",DropBox);
		reg("script/Role.js",Role);
    }
}
GameConfig.width = 1336;
GameConfig.height = 750;
GameConfig.scaleMode ="fixedwidth";
GameConfig.screenMode = "none";
GameConfig.alignV = "top";
GameConfig.alignH = "left";
GameConfig.startScene = "scene/Level1.scene";
GameConfig.sceneRoot = "";
GameConfig.debug = false;
GameConfig.stat = false;
GameConfig.physicsDebug = false;
GameConfig.exportSceneToJson = true;

GameConfig.init();
