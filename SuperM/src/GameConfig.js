/**This class is automatically generated by LayaAirIDE, please do not make any modifications. */
import JoyStick from "./script/JoyStick"
import JoyStickButton from "./script/JoyStickButton"
import AdjustScene from "./script/AdjustScene"
import GameJoyStick from "./script/GameJoyStick"
import Camera from "./script/Camera"
import LevelLogic from "./script/LevelLogic"
import GroundImageLogic from "./script/GroundImageLogic"
import BrickLogic from "./script/BrickLogic"
import GoldLogic from "./script/GoldLogic"
import MoreTimeBrick from "./script/MoreTimeBrick"
import Role from "./script/Role"
import AILeftOrRight from "./script/AILeftOrRight"
import MonsterLogic from "./script/MonsterLogic"
import FlyWoniuLogic from "./script/FlyWoniuLogic"
import BrokenBrick from "./script/BrokenBrick"
import BulletLogic from "./script/BulletLogic"
import AIFlyMonster from "./script/AIFlyMonster"
import WoniuLogic from "./script/WoniuLogic"
import KeLogic from "./script/KeLogic"
import HanbaoLogic from "./script/HanbaoLogic"
import TanLiBrickLogic from "./script/TanLiBrickLogic"
import WenhaoLogic from "./script/WenhaoLogic"

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
		reg("script/GroundImageLogic.js",GroundImageLogic);
		reg("script/BrickLogic.js",BrickLogic);
		reg("script/GoldLogic.js",GoldLogic);
		reg("script/MoreTimeBrick.js",MoreTimeBrick);
		reg("script/Role.js",Role);
		reg("script/AILeftOrRight.js",AILeftOrRight);
		reg("script/MonsterLogic.js",MonsterLogic);
		reg("script/FlyWoniuLogic.js",FlyWoniuLogic);
		reg("script/BrokenBrick.js",BrokenBrick);
		reg("script/BulletLogic.js",BulletLogic);
		reg("script/AIFlyMonster.js",AIFlyMonster);
		reg("script/WoniuLogic.js",WoniuLogic);
		reg("script/KeLogic.js",KeLogic);
		reg("script/HanbaoLogic.js",HanbaoLogic);
		reg("script/TanLiBrickLogic.js",TanLiBrickLogic);
		reg("script/WenhaoLogic.js",WenhaoLogic);
    }
}
GameConfig.width = 1336;
GameConfig.height = 750;
GameConfig.scaleMode ="fixedwidth";
GameConfig.screenMode = "none";
GameConfig.alignV = "top";
GameConfig.alignH = "left";
GameConfig.startScene = "scene/Level1_1.scene";
GameConfig.sceneRoot = "";
GameConfig.debug = false;
GameConfig.stat = false;
GameConfig.physicsDebug = false;
GameConfig.exportSceneToJson = true;

GameConfig.init();
