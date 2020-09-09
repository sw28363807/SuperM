import GameConfig from "./GameConfig";
import GameContext from "./GameContext";
class Main {
	constructor() {
		//根据IDE设置初始化引擎		
		if (window["Laya3D"]) Laya3D.init(GameConfig.width, GameConfig.height);
		else Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
		Laya["Physics"] && Laya["Physics"].enable();
		Laya["DebugPanel"] && Laya["DebugPanel"].enable();
		Laya.stage.scaleMode = GameConfig.scaleMode;
		Laya.stage.screenMode = GameConfig.screenMode;
		Laya.stage.alignV = GameConfig.alignV;
		Laya.stage.alignH = GameConfig.alignH;
		//兼容微信不支持加载scene后缀场景
		Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;

		//打开调试面板（通过IDE设置调试模式，或者url地址增加debug=true参数，均可打开调试面板）
		if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true") Laya.enableDebugPanel();
		if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"]) Laya["PhysicsDebugDraw"].enable();
		if (GameConfig.stat) Laya.Stat.show();
		Laya.alertGlobalError(true);
		if (Laya.Browser.onMiniGame) {
			wx.onShow((res) => {
				console.debug("+++++++++++++++++++++:" + GameContext.curBgm);
				if (GameContext.curBgm != "") {
					Laya.SoundManager.stopAllSound();
					Laya.SoundManager.stopMusic();
					Laya.SoundManager.playMusic(GameContext.curBgm);
				}
			});
		} else {
			Laya.loader.load(GameContext.curBgm, Laya.Handler.create(this, function (data) {
				Laya.SoundManager.playMusic(GameContext.curBgm);
			}), null, Laya.Loader.SOUND);
		}
		if (Laya.Browser.onMiniGame) {
			Laya.URL.basePath = "https://7375-sunwen-5w22q-1302935665.tcb.qcloud.la/";
			Laya["MiniAdpter"].nativefiles = [
				"anim/",
				"prefab/",
				"res/",
				// "scene",
				"loading",
				"js/",
				"libs/",
				"fileconfig.json",
				"game.js",
				"game.json",
				"index.js",
				"project.config.json",
				"unpack.json",
				"version.json",
				"weapp-adapter.js"
			  ];
		}

		//激活资源版本控制，version.json由IDE发布功能自动生成，如果没有也不影响后续流程
		Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
	}

	onVersionLoaded() {
		//激活大小图映射，加载小图的时候，如果发现小图在大图合集里面，则优先加载大图合集，而不是小图
		Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
	}

	onConfigLoaded() {
		//加载IDE指定的场景
		GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
	}
}
//激活启动类
new Main();
