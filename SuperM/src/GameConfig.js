/**This class is automatically generated by LayaAirIDE, please do not make any modifications. */
import JoyStick from "./script/JoyStick"
import JoyStickButton from "./script/JoyStickButton"
import AdjustScene from "./script/AdjustScene"
import GameJoyStick from "./script/GameJoyStick"
import GameLogoScene from "./script/GameLogoScene"
import GameTopLogic from "./script/GameTopLogic"
import Camera from "./script/Camera"
import LevelLogic from "./script/LevelLogic"
import GroundImageLogic from "./script/GroundImageLogic"
import Role from "./script/Role"
import PassLevelLogic from "./script/PassLevelLogic"
import WenhaoLogic from "./script/WenhaoLogic"
import BrickGoldLogic from "./script/BrickGoldLogic"
import GoldLogic from "./script/GoldLogic"
import BrokenBrick from "./script/BrokenBrick"
import BrickLogic from "./script/BrickLogic"
import MoreTimeBrick from "./script/MoreTimeBrick"
import TanLiBrickLogic from "./script/TanLiBrickLogic"
import BulletLogic from "./script/BulletLogic"
import AILeftOrRight from "./script/AILeftOrRight"
import MonsterLogic from "./script/MonsterLogic"
import AIFlyMonster from "./script/AIFlyMonster"
import FlyMonsterLogic from "./script/FlyMonsterLogic"
import WoniuLogic from "./script/WoniuLogic"
import KeLogic from "./script/KeLogic"
import HanbaoLogic from "./script/HanbaoLogic"

export default class GameConfig {
    static init() {
        //注册Script或者Runtime引用
        let reg = Laya.ClassUtils.regClass;
		reg("script/JoyStick.js",JoyStick);
		reg("script/JoyStickButton.js",JoyStickButton);
		reg("script/AdjustScene.js",AdjustScene);
		reg("script/GameJoyStick.js",GameJoyStick);
		reg("script/GameLogoScene.js",GameLogoScene);
		reg("script/GameTopLogic.js",GameTopLogic);
		reg("script/Camera.js",Camera);
		reg("script/LevelLogic.js",LevelLogic);
		reg("script/GroundImageLogic.js",GroundImageLogic);
		reg("script/Role.js",Role);
		reg("script/PassLevelLogic.js",PassLevelLogic);
		reg("script/WenhaoLogic.js",WenhaoLogic);
		reg("script/BrickGoldLogic.js",BrickGoldLogic);
		reg("script/GoldLogic.js",GoldLogic);
		reg("script/BrokenBrick.js",BrokenBrick);
		reg("script/BrickLogic.js",BrickLogic);
		reg("script/MoreTimeBrick.js",MoreTimeBrick);
		reg("script/TanLiBrickLogic.js",TanLiBrickLogic);
		reg("script/BulletLogic.js",BulletLogic);
		reg("script/AILeftOrRight.js",AILeftOrRight);
		reg("script/MonsterLogic.js",MonsterLogic);
		reg("script/AIFlyMonster.js",AIFlyMonster);
		reg("script/FlyMonsterLogic.js",FlyMonsterLogic);
		reg("script/WoniuLogic.js",WoniuLogic);
		reg("script/KeLogic.js",KeLogic);
		reg("script/HanbaoLogic.js",HanbaoLogic);
    }
}
GameConfig.width = 1336;
GameConfig.height = 750;
GameConfig.scaleMode ="fixedwidth";
GameConfig.screenMode = "none";
GameConfig.alignV = "top";
GameConfig.alignH = "left";
GameConfig.startScene = "scene/GameLogoScene.scene";
GameConfig.sceneRoot = "";
GameConfig.debug = false;
GameConfig.stat = false;
GameConfig.physicsDebug = false;
GameConfig.exportSceneToJson = true;

GameConfig.init();
