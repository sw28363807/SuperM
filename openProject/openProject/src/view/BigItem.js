import { BigItemUI } from "../ui/layaMaxUI";
export default class BigItem extends BigItemUI {

    constructor(){ 
        super();
    }

    set dataSource(value){
        if(!value)
            return;
            this.img_head.skin = value.avatarIP;
            this.text_name.text = value.UserName;
            this.text_score.text = value.RankValue;
    }
}