import EventMgr from "./EventMgr";
import Events from "./Events";
import GameContext from "../GameContext";

export default class ShuiGuanLogic extends Laya.Script {

    constructor() { 
        super();

        /** @prop {name:sgIndex, tips:"索引", type:Number, default:0}*/
        let sgIndex = 0;
        /** @prop {name:sgType, tips:"类型", type:Number, default:0}*/
        let sgType = 0; // 0 正常 1 场景入口 2 金币场景入口 3场景出口
        /** @prop {name:sgOutIndex, tips:"出口", type:Number, default:0}*/
        let sgOutIndex = 0;
        /** @prop {name:sceneName, tips:"场景", type:String, default:""}*/
        let sceneName = "";
    }
    
    onEnable() {
        EventMgr.getInstance().registEvent(Events.Role_Enter_Shuiguan, this, this.onEnterShuiguan);
        EventMgr.getInstance().registEvent(Events.Role_Exit_Shuiguan, this, this.onExitShuiguan);
        
        let script = this.owner.getComponent(ShuiGuanLogic);
        if (script.sgIndex) {
            this.owner.sgIndex = script.sgIndex;
        } else {
            this.owner.sgIndex = 0;
        }

        if (script.sgType) {
            this.owner.sgType = script.sgType;
        } else {
            this.owner.sgType = 0;
        }

        if (script.sgOutIndex) {
            this.owner.sgOutIndex = script.sgOutIndex;
        } else {
            this.owner.sgOutIndex = 0;
        }

        if (script.sceneName) {
            this.owner.sceneName = script.sceneName;
        } else {
            this.owner.sceneName = "";
        }
        this.owner.roleImg = this.owner.getChildByName("roleImg");
    }

    onDisable() {
    }

    onEnterShuiguan() {
        if (!this.owner) {
            return;
        }
        if (this.owner.sgType == 1) {
            GameContext.sgOutIndex =  this.owner.sgOutIndex;
            this.inShuiguan();
        } else if (this.owner.sgType == 2) {
            this.inShuiguan();
        }
    }

    inShuiguan() {
        GameContext.role.visible = false;
        this.owner.roleImg.y = 0;
        let sceneName = this.owner.sceneName;
        this.owner.roleImg.scaleX = GameContext.curScaleFactor;
        this.owner.roleImg.scaleY = GameContext.curScaleFactor;
        Laya.Tween.to(this.owner.roleImg, {y: 115}, 500, null, Laya.Handler.create(null, function() {
            Laya.Scene.open(sceneName);
        }));
    }

    outShuiguan() {
        GameContext.sgOutIndex = 0;
        GameContext.role.visible = false;
        this.owner.roleImg.y = 115;
        this.owner.roleImg.scaleX = GameContext.curScaleFactor;
        this.owner.roleImg.scaleY = GameContext.curScaleFactor;
        let owner = this.owner;
        GameContext.setRolePosition(owner.x + owner.height/2 - 20, owner.y - owner.height - 3);
        Laya.Tween.to(this.owner.roleImg, {y: 0}, 500, null, Laya.Handler.create(null, function() {
            GameContext.role.visible = true;
            owner.roleImg.visible = false;
        }));
    }

    onExitShuiguan() {
        if (!this.owner) {
            return;
        }
        // console.debug(GameContext.gameSceneType);
        // this.owner.parent.numChildren
        if (GameContext.gameSceneType == 1) {
            if (this.owner.sgIndex == GameContext.sgOutIndex) {
                this.outShuiguan();
            }
        }
    }

    onTriggerEnter(other, self, contact) {
        if (self.label == "ShuiguanHeadEnter" && other.label == "RoleFoot" && GameContext.roleShuiGuanState == 0) {
            GameContext.roleShuiGuanState = 1;
        }
    }
}