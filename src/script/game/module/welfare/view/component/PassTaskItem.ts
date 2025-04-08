// @ts-nocheck
import FUI_PassTaskItem from "../../../../../../fui/Welfare/FUI_PassTaskItem";
import LangManager from "../../../../../core/lang/LangManager";
import SimpleAlertHelper from "../../../../component/SimpleAlertHelper";
import { EmWindow } from "../../../../constant/UIDefine";
import { MessageTipManager } from "../../../../manager/MessageTipManager";
import { TempleteManager } from "../../../../manager/TempleteManager";
import { FrameCtrlManager } from "../../../../mvc/FrameCtrlManager";
import PassTaskItemData from "../../data/PassTaskItemData";
import WelfareCtrl from "../../WelfareCtrl";
import WelfareData from "../../WelfareData";
import { WelfareManager } from "../../WelfareManager";

/**
* @author:zhihua.zhou
* @data: 2022-05-30
* @description 勇士犒赏令的任务列表ITEM
*/
export default class PassTaskItem extends FUI_PassTaskItem {
    //@ts-ignore
    data: PassTaskItemData;

    onConstruct() {
        super.onConstruct();
        this.btn_go.onClick(this,this.onGo);
        this.btn_claim.onClick(this,this.onClaim);
        this.initLanguage();
    }

    private initLanguage(){
        this.btn_go.title = LangManager.Instance.GetTranslation('pass.text08');
        this.btn_claim.title = LangManager.Instance.GetTranslation('map.campaign.view.fall.BattleFallGoodsView.recive');
    }

    /**
     * 抽取的任务内容及所需完成的数量通过数据表t_s_passchecktask中字段（TaskType）和（TaskNum）控制
     * 每条任务有其对应的刷新概率, 通过数据表t_s_passchecktask中字段（Rand）控制【使用调来4类型概率计算】
     * 每条任务的任务积分读取数据表t_s_passchecktask中字段（Experience）的数据
     * 每条任务的任务内容类型及数量分别读取数据表t_s_passchecktask中字段（TaskType）和（TaskNum）的数据
     */
    setData(taskData:PassTaskItemData){
        this.data = taskData;

        // let cfgVal:string = '';
        // if(this.data.area == 1){
        //     cfgVal = TempleteManager.Instance.getConfigInfoByConfigName('passcheck_refresh_day').ConfigValue;
        //     let arr = cfgVal.split(',');
        //     // this.btn_refresh.visible = this.ctrlData.passTaskModel.dayFreshNum < arr.length;
        // }else if(this.data.area == 2)
        // {
        //     cfgVal = TempleteManager.Instance.getConfigInfoByConfigName('passcheck_refresh_week').ConfigValue;
        //     if(cfgVal){
        //         let arr = cfgVal.split(',');
        //         // this.btn_refresh.visible = this.ctrlData.passTaskModel.weekFreshNum < arr.length;
        //     }
        // }else
        // {
        //     // this.btn_refresh.visible = false;
        // }

        let cfg = TempleteManager.Instance.getPassTask(taskData.taskType,taskData.taskId);
        if(cfg){
            this.txt_desc.text = cfg.NameLang.replace('{TaskNum}',cfg.TaskNum.toString()) + ' ('+taskData.finishNum + '/'+cfg.TaskNum+')';
            this.txt_exp.text = cfg.Experience.toString();
            switch (taskData.status) {
                case 1:
                    this.c1.setSelectedIndex(1);
                    // this.btn_refresh.visible = false;
                    break;
                case 2:
                    this.c1.setSelectedIndex(0);
                    break;
                case 3:
                    this.c1.setSelectedIndex(2);
                    // this.btn_refresh.visible = false;
                    break;
                default:
                    break;
            }
            this.txt_exp.fontSize = cfg.Experience >= 1000 ? 23 : 30;
        }
    }

    onGo(){
        if(this.ctrlData.passRewardInfo.state == 2){
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation('Passport.tip7'));
            return;
        }
        WelfareManager.Instance.switchScene(this.data.taskType);
    }

    onClaim(){
        WelfareManager.Instance.reqPassTask(1,this.data.taskId,this.data.area,this.data.id,0);    
    }

    private get ctrlData(): WelfareData {
        return this.control.data;
    }

    private get control(): WelfareCtrl {
        return FrameCtrlManager.Instance.getCtrl(EmWindow.Welfare) as WelfareCtrl;
    }

    dispose(): void {
        this.btn_go.offClick(this,this.onGo);
        // this.btn_refresh.offClick(this,this.onRefresh);
        this.btn_claim.offClick(this,this.onClaim);
        super.dispose();
    }

}