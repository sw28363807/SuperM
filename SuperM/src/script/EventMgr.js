export default class EventMgr {

    constructor() {
        this.eventDispatcher = new Laya.EventDispatcher();
    }

    static getInstance() {
        return EventMgr.instance?EventMgr.instance:EventMgr.instance = new EventMgr();
    }

    //广播消息
    postEvent(eventName, argv) {
        this.eventDispatcher.event(eventName, argv);
    }

    //注册消息
    registEvent(eventName, caller, listener, args) {
        this.removeEvent(eventName, caller, listener);
        this.eventDispatcher.on(eventName, caller, listener, args);
    }

    //移除消息
    removeEvent(eventName, caller, listener) {
        this.eventDispatcher.off(eventName, caller, listener, false);
    }

    //慎用，不传能清掉所有的事件
    removeEventAll(eventName) {
        this.eventDispatcher.offAll(eventName);
    }

    offAllCaller(caller) {
        this.eventDispatcher.offAllCaller(caller);
    }

    //移除所有消息
    removeAllEvent() {
        this.eventDispatcher.offAll(eventName);
    }
}