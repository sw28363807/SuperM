/**This class is automatically generated by LayaAirIDE, please do not make any modifications. */
import GameLogoScene from "./script/GameLogoScene"
import LoadingBgLogic from "./script/LoadingBgLogic"
import AdjustScene from "./script/AdjustScene"
import JoyStick from "./script/JoyStick"
import JoyStickButton from "./script/JoyStickButton"
import GameJoyStick from "./script/GameJoyStick"
import GameTopLogic from "./script/GameTopLogic"
import SliderLogic from "./script/SliderLogic"
import Camera from "./script/Camera"
import LevelLogic from "./script/LevelLogic"
import GroundImageLogic from "./script/GroundImageLogic"
import BrickGoldLogic from "./script/BrickGoldLogic"
import GoldLogic from "./script/GoldLogic"
import WenhaoLogic from "./script/WenhaoLogic"
import SingleObsLogic from "./script/SingleObsLogic"
import ShuiGuanLogic from "./script/ShuiGuanLogic"
import PassLevelBrickLogic from "./script/PassLevelBrickLogic"
import AILeftOrRight from "./script/AILeftOrRight"
import MonsterLogic from "./script/MonsterLogic"
import MonsterIdLogic from "./script/MonsterIdLogic"
import WoniuLogic from "./script/WoniuLogic"
import FlyMonsterLogic from "./script/FlyMonsterLogic"
import AITopOrBottom from "./script/AITopOrBottom"
import FlowerLogic from "./script/FlowerLogic"
import MonsterCreater from "./script/MonsterCreater"
import Role from "./script/Role"
import BeiKe from "./script/BeiKe"
import BrickMonsterLogic from "./script/BrickMonsterLogic"
import TanLiBrickLogic from "./script/TanLiBrickLogic"
import LiuShaLogic from "./script/LiuShaLogic"
import WaterLogic from "./script/WaterLogic"
import MoveBrickLogic from "./script/MoveBrickLogic"
import RenderTextureLogic from "./script/RenderTextureLogic"
import ShuiMuLogic from "./script/ShuiMuLogic"
import DisBrickLogic from "./script/DisBrickLogic"
import CiQiuLogic from "./script/CiQiuLogic"
import DeadWaterLogic from "./script/DeadWaterLogic"
import JumpMonsterLogic from "./script/JumpMonsterLogic"
import PenShuiMonsterLogic from "./script/PenShuiMonsterLogic"
import BigRedFishLogic from "./script/BigRedFishLogic"
import DropBrickLogic from "./script/DropBrickLogic"
import CiBrickLogic from "./script/CiBrickLogic"
import HuoYanChiLogic from "./script/HuoYanChiLogic"
import ShiTou from "./script/ShiTou"
import DoorLogic from "./script/DoorLogic"
import ShiWoNiuLogic from "./script/ShiWoNiuLogic"
import LaZhuLogic from "./script/LaZhuLogic"
import YouLingLogic from "./script/YouLingLogic"
import HuoQiuLogic from "./script/HuoQiuLogic"
import HanbaoLogic from "./script/HanbaoLogic"
import BossLogic from "./script/BossLogic"
import LittleGameScene1Logic from "./script/LittleGameScene1Logic"
import BrokenBrick from "./script/BrokenBrick"
import BrickLogic from "./script/BrickLogic"
import MoreTimeBrick from "./script/MoreTimeBrick"
import BulletLogic from "./script/BulletLogic"
import FlowerBulletLogic from "./script/FlowerBulletLogic"
import HeadBulletLogic from "./script/HeadBulletLogic"
import PenShuiEffectLogic from "./script/PenShuiEffectLogic"
import KeLogic from "./script/KeLogic"

export default class GameConfig {
    static init() {
        //注册Script或者Runtime引用
        let reg = Laya.ClassUtils.regClass;
		reg("script/GameLogoScene.js",GameLogoScene);
		reg("script/LoadingBgLogic.js",LoadingBgLogic);
		reg("script/AdjustScene.js",AdjustScene);
		reg("script/JoyStick.js",JoyStick);
		reg("script/JoyStickButton.js",JoyStickButton);
		reg("script/GameJoyStick.js",GameJoyStick);
		reg("script/GameTopLogic.js",GameTopLogic);
		reg("script/SliderLogic.js",SliderLogic);
		reg("script/Camera.js",Camera);
		reg("script/LevelLogic.js",LevelLogic);
		reg("script/GroundImageLogic.js",GroundImageLogic);
		reg("script/BrickGoldLogic.js",BrickGoldLogic);
		reg("script/GoldLogic.js",GoldLogic);
		reg("script/WenhaoLogic.js",WenhaoLogic);
		reg("script/SingleObsLogic.js",SingleObsLogic);
		reg("script/ShuiGuanLogic.js",ShuiGuanLogic);
		reg("script/PassLevelBrickLogic.js",PassLevelBrickLogic);
		reg("script/AILeftOrRight.js",AILeftOrRight);
		reg("script/MonsterLogic.js",MonsterLogic);
		reg("script/MonsterIdLogic.js",MonsterIdLogic);
		reg("script/WoniuLogic.js",WoniuLogic);
		reg("script/FlyMonsterLogic.js",FlyMonsterLogic);
		reg("script/AITopOrBottom.js",AITopOrBottom);
		reg("script/FlowerLogic.js",FlowerLogic);
		reg("script/MonsterCreater.js",MonsterCreater);
		reg("script/Role.js",Role);
		reg("script/BeiKe.js",BeiKe);
		reg("script/BrickMonsterLogic.js",BrickMonsterLogic);
		reg("script/TanLiBrickLogic.js",TanLiBrickLogic);
		reg("script/LiuShaLogic.js",LiuShaLogic);
		reg("script/WaterLogic.js",WaterLogic);
		reg("script/MoveBrickLogic.js",MoveBrickLogic);
		reg("script/RenderTextureLogic.js",RenderTextureLogic);
		reg("script/ShuiMuLogic.js",ShuiMuLogic);
		reg("script/DisBrickLogic.js",DisBrickLogic);
		reg("script/CiQiuLogic.js",CiQiuLogic);
		reg("script/DeadWaterLogic.js",DeadWaterLogic);
		reg("script/JumpMonsterLogic.js",JumpMonsterLogic);
		reg("script/PenShuiMonsterLogic.js",PenShuiMonsterLogic);
		reg("script/BigRedFishLogic.js",BigRedFishLogic);
		reg("script/DropBrickLogic.js",DropBrickLogic);
		reg("script/CiBrickLogic.js",CiBrickLogic);
		reg("script/HuoYanChiLogic.js",HuoYanChiLogic);
		reg("script/ShiTou.js",ShiTou);
		reg("script/DoorLogic.js",DoorLogic);
		reg("script/ShiWoNiuLogic.js",ShiWoNiuLogic);
		reg("script/LaZhuLogic.js",LaZhuLogic);
		reg("script/YouLingLogic.js",YouLingLogic);
		reg("script/HuoQiuLogic.js",HuoQiuLogic);
		reg("script/HanbaoLogic.js",HanbaoLogic);
		reg("script/BossLogic.js",BossLogic);
		reg("script/LittleGameScene1Logic.js",LittleGameScene1Logic);
		reg("script/BrokenBrick.js",BrokenBrick);
		reg("script/BrickLogic.js",BrickLogic);
		reg("script/MoreTimeBrick.js",MoreTimeBrick);
		reg("script/BulletLogic.js",BulletLogic);
		reg("script/FlowerBulletLogic.js",FlowerBulletLogic);
		reg("script/HeadBulletLogic.js",HeadBulletLogic);
		reg("script/PenShuiEffectLogic.js",PenShuiEffectLogic);
		reg("script/KeLogic.js",KeLogic);
    }
}
GameConfig.width = 1336;
GameConfig.height = 750;
GameConfig.scaleMode ="fixedwidth";
GameConfig.screenMode = "none";
GameConfig.alignV = "top";
GameConfig.alignH = "left";
GameConfig.startScene = "loading/GameLogoScene.scene";
GameConfig.sceneRoot = "";
GameConfig.debug = false;
GameConfig.stat = false;
GameConfig.physicsDebug = false;
GameConfig.exportSceneToJson = true;

GameConfig.init();
