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
BigUI.uiView={"type":"View","props":{"width":1336,"height":750},"compId":2,"child":[{"type":"List","props":{"y":75,"x":375,"width":585,"var":"_list","vScrollBarSkin":" ","spaceY":10,"repeatX":1,"height":600,"elasticEnabled":true,"bgColor":"#6a8d87"},"compId":3,"child":[{"type":"bigItem","props":{"runtime":"view/BigItem.js","renderType":"render"},"compId":5}]}],"loadList":[],"loadList3D":[]};
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
BigItemUI.uiView={"type":"View","props":{"width":580,"renderType":"render","height":100},"compId":2,"child":[{"type":"Sprite","props":{"y":0,"x":3,"width":575,"texture":"loading/rank.png","height":99},"compId":7},{"type":"Image","props":{"y":10,"x":71,"width":80,"var":"img_head","height":80},"compId":3,"child":[{"type":"Sprite","props":{"y":-1,"x":-1,"width":82,"renderType":"mask","height":82},"compId":10}]},{"type":"Label","props":{"y":38,"x":156,"width":259,"var":"text_name","text":"名字","strokeColor":"#3e567f","stroke":1,"overflow":"scroll","height":24,"fontSize":24,"color":"#b9c622","align":"center"},"compId":4},{"type":"Label","props":{"y":38,"x":496,"var":"text_score","text":"分数","fontSize":24,"color":"#c8dd30","align":"left"},"compId":5},{"type":"Label","props":{"y":38,"x":13,"width":50,"var":"text_rank","text":"999","fontSize":28,"color":"#c8dd30","align":"center"},"compId":12},{"type":"Label","props":{"y":38,"x":433,"text":"分数:","fontSize":24,"color":"#ffffff","align":"center"},"compId":11}],"loadList":["loading/rank.png"],"loadList3D":[]};
REG("ui.test.BigItemUI",BigItemUI);