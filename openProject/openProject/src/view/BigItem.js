import { BigItemUI } from "../ui/layaMaxUI";
export default class BigItem extends BigItemUI {

    constructor(){ 
        super();
    }

    set dataSource(value){
        if(!value)
            return;
            let rankNumber = value.rankIndex + 1;
            this.text_rank.text = String(rankNumber);
            this.img_head.skin = value.avatarIP;
            this.text_name.text = value.UserName;
            this.text_score.text = value.RankValue;


            if (rankNumber == 1) {
                this.text_rank.text.visible = false;
                this.rank1.visible = true;
                this.rank2.visible = false;
                this.rank3.visible = false;
            } else if (rankNumber == 2) {
                this.text_rank.text.visible = false;
                this.rank1.visible = false;
                this.rank2.visible = true;
                this.rank3.visible = false;
            } else if (rankNumber == 3) {
                this.text_rank.text.visible = false;
                this.rank1.visible = false;
                this.rank2.visible = false;
                this.rank3.visible = true;
            } else {
                this.text_rank.text.visible = true;
                this.rank1.visible = false;
                this.rank2.visible = false;
                this.rank3.visible = false;
            }
    }
}