import GameContext from "../GameContext";
import LoadingLogic from "./LoadingLogic";


export default class GameLogoScene extends Laya.Script {

    constructor() { 
        super();
    }
     
    onEnable() {
    }

    onDisable() {
    }

    onStart() {
        if (Laya.Browser.onMiniGame) {
            let button = wx.createUserInfoButton({
                type: 'text',
                text: '获取用户信息',
                style: {
                  left: -3000,
                  top: -3000,
                  width: 10000,
                  height: 10000,
                  lineHeight: 40,
                  plain: true
                }
              })
              button.onTap((res) => {
                  if (res.errMsg == "getUserInfo:ok") {
                    console.log(res);
                    GameContext.nickName = res.userInfo.nickName;
                    GameContext.city = res.userInfo.city;
                    GameContext.province = res.userInfo.province;
                    GameContext.country = res.userInfo.country;
                    GameContext.avatarUrl = res.userInfo.avatarUrl;
                    button.destroy();
                    LoadingLogic.loadScene("scene/Level1_1.scene");
                  }
              });
        }

        let touch = this.owner.getChildByName("touch");
        touch.on(Laya.Event.CLICK, this, function() {
            // LoadingLogic.loadScene("scene/LevelBoss.scene");
            // LoadingLogic.loadScene("scene/Level8_1.scene");
            // LoadingLogic.loadScene("scene/Level6_1.scene");
            // LoadingLogic.loadScene("scene/Level7_1.scene");
            LoadingLogic.loadScene("scene/Level1_1.scene");
            // Laya.Scene.open("scene/Level4_1.scene");
            // LoadingLogic.loadScene("scene/LittleGameScene1.scene");
            // Laya.Scene.open("scene/LittleGameScene1.scene");
        });
    }
}