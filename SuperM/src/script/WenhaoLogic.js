import Utils from "./Utils";
import GameContext from "../GameContext";

export default class WenhaoLogic extends Laya.Script {

    constructor() { 
        super();
        // 1 蘑菇 2 金币 3蓝瓶子
        /** @prop {name:wenhaoType, tips:"问号类型1 蘑菇 2 金币 3 蓝瓶子 4 绿瓶子", type:Number, default:1}*/
        let wenhaoType = 1;
    }

    onTriggerEnter(other, self, contact) {
        if (other) {
            if (other.label == "RoleHead") {
                if (!self.owner) {
                    return;
                }
                if (!Utils.roleInFloor(self.owner)) {
                    return;
                }
                if (this.owner.state == 0) {
                    if (Laya.Browser.onMiniGame) {
                        if (this.owner.wenhaoType != 2) {
                            Laya.SoundManager.playSound("other1/dingchu.mp3");
                        }
                    } else {
                        if (this.owner.wenhaoType != 2) {
                            Laya.loader.load("other1/dingchu.mp3", Laya.Handler.create(this, function (data) {
                                Laya.SoundManager.playSound("other1/dingchu.mp3");
                            }), null, Laya.Loader.SOUND);
                        }
                    }   
                }
                if (this.owner.wenhaoType == 1) {
                    this.triggerMoGu();
                } else if (this.owner.wenhaoType == 2) {
                    if (this.owner.state == 0) {
                        this.owner.state = 1;
                        let owner = this.owner;
                        let render = this.owner.getChildByName("render");
                        Laya.SoundManager.playSound("other1/gold.mp3");
                        if (render) {
                            render.play(0, true, "ani3");
                            Laya.timer.once(100, this, function() {
                                if (render && owner) {
                                    render.play(0, true, "ani2");
                                    Utils.createGoldEffect(owner, false);
                                }
                            });
                        }
                    }
                } else if (this.owner.wenhaoType == 3 || this.owner.wenhaoType == 4) {
                    if (this.owner.state == 0) {
                        this.triggerMoGu();
                    }
                }
                Utils.createHeadBullet(this.owner);
            } else if (other.label == "KeBullet") {
                this.triggerMoGu();
            }
        }

    }


    triggerMoGu() {
        if (GameContext.brokenBrickTick != 0) {
            return;
        }
        if (!this.owner) {
            return;
        }
        let owner = this.owner;
        let render = owner.getChildByName("render");
        let x = owner.x;
        let y = owner.y;
        let parent = owner.parent;
        let zOrder = this.owner.zOrder;
        let wenhaoType = owner.wenhaoType;
        if (wenhaoType == null || wenhaoType == undefined) {
            wenhaoType = 1;
        }
        if (this.owner.state == 0 && render) {
            this.owner.state = 1;
            render.play(0, false, "ani3");
            Laya.timer.once(100, this, function() {
                if (render) {
                    render.play(0, true, "ani2");
                }
                Laya.loader.create("prefab/Reward.prefab", Laya.Handler.create(null, function (prefabDef) {
                    if (parent && owner) {
                        let wenhao = prefabDef.create();
                        if (wenhaoType == 3) {
                            if (GameContext.gameRoleBodyState == 0) {
                                wenhaoType = 1;
                            }
                        }
                        wenhao.wenhaoType = wenhaoType;
                        parent.addChild(wenhao);
                        wenhao.x = x + 5;
                        wenhao.y = y - wenhao.height * wenhao.scaleX - 10;
                        wenhao.zOrder = zOrder - 1;
                    }
                }));
            });
        }
        GameContext.brokenBrickTick = 10;
    }
    
    onEnable() {
        this.owner.state = 0; //0 未出货 1 已经出货
        let script = this.owner.getComponent(WenhaoLogic);
        if (script && script.wenhaoType) {
            this.owner.wenhaoType = script.wenhaoType;
        } else {
            this.owner.wenhaoType = 1;
        }
    }

    onDisable() {
        Laya.timer.clearAll(this);
    }
}
