import EventMgr from "./EventMgr";
import Events from "./Events";
import GameContext from "../GameContext";
import Utils from "./Utils";
import LoadingLogic from "./LoadingLogic";

export default class HanbaoLogic extends Laya.Script {

    constructor() { 
        super();
        /** @prop {name:finalWenhaoType, tips:"1 蘑菇 2 金币 3蓝瓶子 4绿瓶子 5强制汉堡", type:Int, default:-1}*/
        let finalWenhaoType = -1;
    }
    
    onEnable() {
        this.owner.rigidBody = this.owner.getComponent(Laya.RigidBody);
        this.owner.rigidBody.getBody().SetActive(false);
    }

    onStart() {
        let script = this.owner.getComponent(HanbaoLogic);
        if (script.finalWenhaoType) {
            this.owner.finalWenhaoType = script.finalWenhaoType;
            this.owner.rigidBody.gravityScale = 0;
        } else {
            this.owner.finalWenhaoType = -1;
        }

        if (this.owner.finalWenhaoType != -1) {
            this.owner.wenhaoType = this.owner.finalWenhaoType;
        }
        this.speed = 5;
        if (LoadingLogic.curSceneExt == "scene/Level4_1.scene" || LoadingLogic.curSceneExt == "scene/Level7_1.scene" ||
         LoadingLogic.curSceneExt == "scene/Level7_2.scene" || LoadingLogic.curSceneExt == "scene/Level7_3.scene" || 
         LoadingLogic.curSceneExt == "scene/Level8_1.scene" || LoadingLogic.curSceneExt == "scene/Level6_1.scene") {
            this.speed = 0;
        }
        
        if (GameContext.gameRoleBodyState == 0) {
            this.owner.direct = {x: 1, y: 0};
        } else {
            this.owner.direct = {x: 0, y: 0};
        }
        this.owner.directTime = 0;
        this.owner.isMove = true;
        let aniA = "";
        let aniB = "";
        if (this.owner.wenhaoType == 1) {
            // 1 蘑菇 2 金币 3蓝瓶子
            aniA = "ani1";
            aniB = "ani2";
            this.owner.rewardType = 1;
            if (this.owner.finalWenhaoType != 5) {
                if (GameContext.gameRoleBodyState == 0) {
                } else {
                    aniA = "ani11";
                    aniB = "ani22";
                    this.owner.rewardType = 2;
                    this.owner.isMove = false;
                }
            }
        } else if (this.owner.wenhaoType == 3) {
            aniA = "ani111";
            aniB = "ani222";
            this.owner.rewardType = 3;
            this.owner.isMove = false;
        } else if (this.owner.wenhaoType == 4) {
            aniA = "ani1111";
            aniB = "ani2222";
            this.owner.rewardType = 4;
            this.owner.isMove = false;
        }

        this.owner.play(0, false, aniA);
        this.owner.coll = this.owner.getComponent(Laya.ColliderBase);
        Laya.timer.once(400, this, function() {
            this.owner.rigidBody.getBody().SetActive(true);
            this.owner.play(0, true, aniB);
        });
    }

    onTriggerEnter(other, self, contact) {
        if (other.label == "AITop" || other.label == "AIBottom" || other.label == "AILeft" || other.label == "AIRight") {
            return;
        }
        if (other.label == "obsDown" || other.label == "obsUp") {
            return;
        }
        
        if (other && other.label == "Hole") {
            this.owner.coll.isSensor = true;
            let owner = this.owner;
            this.owner.isMove = false;
            Laya.timer.once(2000, null, function() {
                Utils.removeThis(owner);
            });
            return;
        } else if (other && other.label == "RoleHead" || 
        other.label == "RoleFoot" ||
         other.label == "RoleBody") {
             Laya.SoundManager.playSound("loading/yaoping.mp3");
             if (this.owner.rewardType == 4) {
                GameContext.gameRoleNumber++;
                EventMgr.getInstance().postEvent(Events.Refresh_Role_Number);
             } else if (this.owner.rewardType == 3) {
                 if (GameContext.roleFlyState == true) {
                    this.owner.fen = 100;
                    Utils.createFen(this.owner);
                 } else {
                    GameContext.roleFlyState = true;
                    GameContext.playRoleAni("");
                    GameContext.playRoleAni("stand");
                 }
             } else if (GameContext.gameRoleBodyState == 0) {
                GameContext.setBodyState(1);
                EventMgr.getInstance().postEvent(Events.Role_Change_Big);
            } else if (GameContext.gameRoleBodyState == 1) {
                if (this.owner.rewardType == 2) {
                    EventMgr.getInstance().postEvent(Events.Role_Has_Bullet);
                }
            }
            Utils.removeThis(this.owner);
            return;
        }
        if (other.label != "Ground") {
            if (self.label == "RewardSensor") {
                this.owner.direct.x = -1 * Utils.getSign(this.owner.direct.x);
                this.owner.directTime = 0;
            }
        }
        if (this.owner && this.owner.isMove == true) {
            this.owner.rigidBody.setVelocity({x: this.owner.direct.x * this.speed, y: 0}); 
        }
    }

    onUpdate() {
        if (!this.owner) {
            return;
        }
        if (Math.abs(this.owner.x - GameContext.role.x) > 3000) {
            Utils.removeThis(this.owner);
            return;
        }
        if (this.owner.isMove == true) {
            this.owner.directTime++;
            this.owner.zOrder = 655351;
            let linearVelocity = this.owner.rigidBody.linearVelocity;
            this.owner.rigidBody.setVelocity({x: this.owner.direct.x * this.speed, y: linearVelocity.y});   
        }
    }


    onDisable() {
    
    }
}