/**This class is automatically generated by LayaAirIDE, please do not make any modifications. */
var View=laya.ui.View;
var Dialog=laya.ui.Dialog;
var Scene=Laya.Scene;
var REG = Laya.ClassUtils.regClass;
export class BigUI extends View {
	constructor(){ 
		super();
	}
	createChildren() {
		super.createChildren();
		this.createView(BigUI.uiView);
	}
	
}
BigUI.uiView={"type":"View","props":{"width":1336,"height":750},"compId":2,"child":[{"type":"List","props":{"y":75,"x":375,"width":585,"var":"_list","vScrollBarSkin":" ","spaceY":-5,"repeatX":1,"height":600,"elasticEnabled":true,"bgColor":"#6a8d87"},"compId":3,"child":[{"type":"bigItem","props":{"runtime":"view/BigItem.js","renderType":"render"},"compId":5}]}],"loadList":[],"loadList3D":[]};
REG("ui.test.BigUI",BigUI);
export class BigItemUI extends View {
	constructor(){ 
		super();
	}
	createChildren() {
		super.createChildren();
		this.createView(BigItemUI.uiView);
	}
	
}
BigItemUI.uiView={"type":"View","props":{"width":580,"renderType":"render","height":100},"compId":2,"child":[{"type":"Sprite","props":{"zOrder":1,"y":6,"x":3,"width":575,"texture":"loading/bigaaaaa.png","height":86},"compId":7},{"type":"Image","props":{"y":11,"x":151,"width":75,"var":"img_head","height":75},"compId":3,"child":[{"type":"Sprite","props":{"y":-1,"x":-1,"width":82,"renderType":"mask","height":82},"compId":10}]},{"type":"Label","props":{"zOrder":2,"y":16,"x":275,"width":259,"var":"text_name","text":"名字","strokeColor":"#797f3e","stroke":3,"overflow":"scroll","height":36,"fontSize":36,"color":"#b9c622","align":"center"},"compId":4},{"type":"Label","props":{"zOrder":2,"y":60,"x":408,"var":"text_score","text":"分数","strokeColor":"#797f3e","stroke":3,"fontSize":20,"color":"#c8dd30","align":"left"},"compId":5},{"type":"Label","props":{"zOrder":2,"y":36,"x":45,"width":50,"var":"text_rank","text":"999","strokeColor":"#797f3e","stroke":3,"fontSize":28,"color":"#c8dd30","align":"center"},"compId":12},{"type":"Label","props":{"zOrder":2,"y":60,"x":357,"text":"分数:","strokeColor":"#797f3e","stroke":3,"fontSize":20,"color":"#ffffff","align":"center"},"compId":11},{"type":"Sprite","props":{"zOrder":2,"y":29,"x":46,"var":"rank1","texture":"loading/rank1.png","name":"rank1"},"compId":13},{"type":"Sprite","props":{"zOrder":2,"y":29,"x":46,"var":"rank2","texture":"loading/rank2.png","name":"rank2"},"compId":14},{"type":"Sprite","props":{"zOrder":2,"y":29,"x":46,"var":"rank3","texture":"loading/rank3.png","name":"rank3"},"compId":16}],"loadList":["loading/bigaaaaa.png","loading/rank1.png","loading/rank2.png","loading/rank3.png"],"loadList3D":[]};
REG("ui.test.BigItemUI",BigItemUI);