import GameConfig from "./GameConfig";
import BigRank from "./view/BigRank";
class Main {
	constructor() {
		Laya.isWXOpenDataContext = true;
		Laya.isWXPosMsg = true;
		//根据IDE设置初始化引擎		
		Laya.init(GameConfig.width, GameConfig.height,false);
		//根据IDE设置初始化引擎		
		Laya.stage.scaleMode = GameConfig.scaleMode;
		Laya.stage.screenMode = GameConfig.screenMode;
		Laya.stage.alignV = GameConfig.alignV;
		Laya.stage.alignH = GameConfig.alignH;
		// 关于透传接口，请参考: https://ldc2.layabox.com/doc/?nav=zh-ts-5-0-7
		if(Laya.Browser.onMiniGame)
				wx.onMessage(function(data){
					if(data.url == "res/atlas/test.atlas" ){
							Laya.loader.load("res/atlas/test.atlas",Laya.Handler.create(this,this.onComplete));
					}
				}.bind(this));
		else
			Laya.loader.load("res/atlas/test.atlas",Laya.Handler.create(this,this.onComplete));
	}

	onComplete() {
		//加载IDE指定的场景
		var big = new BigRank();
		big.init();
	}
}
//激活启动类
new Main();
