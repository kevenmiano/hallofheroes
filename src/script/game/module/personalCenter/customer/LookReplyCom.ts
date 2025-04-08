import FUI_LookReplyCom from "../../../../../fui/PersonalCenter/FUI_LookReplyCom";
import CustomerServiceManager from "../../../manager/CustomerServiceManager";

/**
 * 查看客服回复
 */
export default class LookReplyCom extends FUI_LookReplyCom {


    onConstruct(){
        super.onConstruct();
 
    }

    init(){
        let model = CustomerServiceManager.Instance.model;
        if(!model.currentReplyInfo)return;
        this.txt_title.text = model.currentReplyInfo.title;
        this.txt_desc.text = model.currentReplyInfo.content;
        this.txt_desc1.text = model.currentReplyInfo.replayContent;
        this.txt_time.text = model.currentReplyInfo.date.toLocaleDateString();
    }

}