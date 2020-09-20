import { BigUI } from "../ui/layaMaxUI"
export default class BigRank extends BigUI {

    constructor() { 
        super(); 
        this._key = "test10086";
        this.isdownLoadRank = false;
        //默认数据
        this.arr = [
            // {index:1,avatarIP:'test/4.png',UserName:"测试用户1",RankValue:100},
            // {index:2,avatarIP:'test/4.png',UserName:"测试用户2",RankValue:75},
            // {index:3,avatarIP:'test/4.png',UserName:"测试用户3",RankValue:50},
            // {index:4,avatarIP:'test/4.png',UserName:"测试用户4",RankValue:25}
        ];
    }
    
    init(){
        //将场景加到舞台上
        Laya.stage.addChild(this);
        this.zOrder = 99999;
        //设置默认数据
        this.setlist(this.arr);
        // Laya.stage.visible  = false;
        if(Laya.Browser.onMiniGame){
            //接受来自主域的信息
            wx.onMessage(this.recevieData.bind(this));
            // 直接展示数据
            // this.getFriendData();
        }
    }

    /**
     * 获取好友排行
     */
    getFriendData(){
        if (this.isdownLoadRank == true) {
            return;
        }
        this.isdownLoadRank = true;
        var _$this = this;
        wx.getFriendCloudStorage({
            keyList:["fenRank"],
            success:function(res){
                console.log("+++++++++++++++++++++++++++++");
                console.log(res);
                //关于拿到的数据详细情况可以产看微信文档
                //https://developers.weixin.qq.com/minigame/dev/api/UserGameData.html
                var listData;
                var obj;
                var kv;
                var arr = [];
                console.log('-----------------getFriendCloudStorage------------');
                if(res.data){
                    for(var i = 0;i<res.data.length;i++){
                        obj = res.data[i];
                        if(!(obj.KVDataList.length))
                            continue
                        //拉取数据是，使用了多少个key- KVDataList的数组就有多少
                        //更详细的KVData可以查看微信文档:https://developers.weixin.qq.com/minigame/dev/api/KVData.html
                        kv = obj.KVDataList[0];
                        if(kv.key!="fenRank")
                            continue
                        kv = JSON.parse(kv.value)
                        listData = {};
                        listData.avatarIP = obj.avatarUrl;
                        listData.UserName = obj.nickname;
                        listData.openID = obj.openid;
                        listData.RankValue = kv.wxgame.value1;
                        listData.rankIndex = i;
                        // listData.update_time=kv.wxgame.update_time;
                        arr.push(listData);
                        console.debug(listData);
                    }
                    //根据RankValue排序
                    arr = arr.sort(function(a,b){
                        return b.RankValue - a.RankValue;
                    });
                    //增加一个用于查看的index排名
                    for(var i = 0; i< arr.length;i++){
                        arr[i].index = i + 1;
                    }
                    //设置数组
                    _$this.setlist(arr);
                }
                }
                ,fail:function(data){
                    console.log('------------------获取托管数据失败--------------------');
                    console.log(data);
                }
            });
        }
        /**
         * 接收信息
         * @param message 收到的主域传过来的信息
         */
        recevieData(message){
            if (message.fen != null && message.fen != undefined) {
                this.fen = message.fen;
                this.key = message.key;
                this.setSelfData();
            }
        }
        /**
         * 上报自己的数据
         * @param data 上报数据
         */
        setSelfData(data){
            var kvDataList = [];
            var obj = {};
            obj.wxgame ={};
            obj.wxgame.value1 = String(this.fen);
            console.log("MyData: " + obj.wxgame.value1);
            let outSelf = this;
            // obj.wxgame.update_time  = Laya.Browser.now();
            kvDataList.push({"key":"fenRank","value":JSON.stringify(obj)});
            wx.setUserCloudStorage({
                KVDataList:kvDataList,
                success:function(e){
                    console.log('-----success:' + JSON.stringify(e));
                    outSelf.getFriendData();
                },
                fail:function(e){
                    console.log('-----fail:' + JSON.stringify(e));
                    outSelf.getFriendData();
                },
                complete:function(e){
                    console.log('-----complete:' + JSON.stringify(e));
                    outSelf.getFriendData();
                }
            });
        }

        /**
         * 设置list arr
         * @param arr 赋值用的arr
         */
        setlist(arr){
            this._list.array =arr;
            this._list.refresh();
        }
}