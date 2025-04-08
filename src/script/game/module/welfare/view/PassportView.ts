import FUI_PassportView from "../../../../../fui/Welfare/FUI_PassportView";
import LangManager from "../../../../core/lang/LangManager";
import UIManager from "../../../../core/ui/UIManager";
import { ArrayConstant, ArrayUtils } from "../../../../core/utils/ArrayUtils";
import { DateFormatter } from "../../../../core/utils/DateFormatter";
import Utils from "../../../../core/utils/Utils";
import SimpleAlertHelper from "../../../component/SimpleAlertHelper";
import { t_s_passcheckData } from "../../../config/t_s_passcheck";
import { PassCheckEvent } from "../../../constant/event/NotificationEvent";
import { EmWindow } from "../../../constant/UIDefine";
import { ArmyManager } from "../../../manager/ArmyManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { NotificationManager } from "../../../manager/NotificationManager";
import { TempleteManager } from "../../../manager/TempleteManager";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import PassRewardInfo from "../data/PassRewardInfo";
import PassTaskItemData from "../data/PassTaskItemData";
import WelfareCtrl from "../WelfareCtrl";
import WelfareData from "../WelfareData";
import { WelfareManager } from "../WelfareManager";
import PassRewardCom from "./component/PassRewardCom";
import PassTaskItem from "./component/PassTaskItem";
/**
 * 通行证主界面
 */
export default class PassportView extends FUI_PassportView{
    private _leftTime: number = -1;
    private _maxGrade: number = 50;
    private tab0Data:Array<string>;
    // private tab1Data:Array<string>;
    //@ts-ignore
    public data:PassRewardInfo;
    //@ts-ignore
    public reward_com: PassRewardCom;
    //@ts-ignore
    public txt0:fairygui.GTextField;
    //@ts-ignore
    public txt1:fairygui.GTextField;
    //@ts-ignore
    public txt2:fairygui.GTextField;
    //@ts-ignore
    public txt_left:fairygui.GTextField;
    private taskListData:Array<PassTaskItemData>;
    // private taskTypeArr:Array<number>;
    private _curSelectIdx:number=0;
    private _refresh_dayCfg:any;
    private _refresh_weekCfg:any;
    private get control(): WelfareCtrl {
        return FrameCtrlManager.Instance.getCtrl(EmWindow.Welfare) as WelfareCtrl;
    }
    private get ctrlData(): WelfareData {
        return this.control.data;
    }
    public static isLogin:boolean=true;

    protected onConstruct() {
        super.onConstruct();
        this.initEvent();
        //【通行证】界面展示格式配置: 返利,价值
        let cfgVal = TempleteManager.Instance.getConfigInfoByConfigName('passcheck_exhibition').ConfigValue
        if(cfgVal){
            let arr = cfgVal.split(',');
            this.txt_discount.text = arr[0] + '%';
        }
        this.tab0Data = [];
        cfgVal = TempleteManager.Instance.getConfigInfoByConfigName('passcheck_max_grade').ConfigValue
        if(cfgVal){
            this._maxGrade = parseInt(cfgVal);
        }
        this.txt_tip.text = LangManager.Instance.GetTranslation('Passport.tip1',this._maxGrade,this._maxGrade)
        this.txt8.text = LangManager.Instance.GetTranslation('Passport.tip8');
        this._refresh_dayCfg = TempleteManager.Instance.getConfigInfoByConfigName('passcheck_refresh_day').ConfigValue;
        this._refresh_weekCfg = TempleteManager.Instance.getConfigInfoByConfigName('passcheck_refresh_week').ConfigValue;
        this.taskListData = [];
        this.refreshView();
        this.initLanguage();
        this.reward_com.gotoIndex();
    }

    private initLanguage(){
        //在xml里面
        // this.btn_buy.title = LangManager.Instance.GetTranslation('pass.text01');
        this.btn_claim.title = LangManager.Instance.GetTranslation('MailWnd.onceGetedTxt');
        
        // this.txt1.text = LangManager.Instance.GetTranslation('pass.text03');
        // this.txt2.text = LangManager.Instance.GetTranslation('pass.text04');
        if(this.data.state == 1){
            this.txt0.color = "#B0695A";
            this.txt0.text = LangManager.Instance.GetTranslation('pass.text02');
            this.txt_left.text = LangManager.Instance.GetTranslation('Passport.tip3');
        }else{
            this.txt0.color = "#ff0000";
            this.txt0.text = LangManager.Instance.GetTranslation('Passport.tip2');
            this.txt_left.text = LangManager.Instance.GetTranslation('Passport.tip4');
        }
    }

    onRecvPassInfo(isupdate:boolean=true){
        if(!isupdate) return;
        this.refreshView();
        this.checkOneKey();
        this.tab0.numItems = this.tab0Data.length;
    }

    /**
     * 刷新任务列表
     */
    onRecvTaskFresh(isreward:false=false){
        this.updateExp();
        this.taskListData.length = 0;
        if(this.tab0.selectedIndex == 2){
            this.taskListData = this.ctrlData.passTaskModel.getTaskListByType(2);
        }else{
            this.taskListData = this.ctrlData.passTaskModel.getTaskListByType(1);
        }
        this.taskListData = ArrayUtils.sortOn(this.taskListData, ["status"], ArrayConstant.NUMERIC | ArrayConstant.NUMERIC);
        // if(this.tab0.selectedIndex == 1){
            // this.checkRepeatTask();
        // }
        this.taskList.numItems = this.taskListData.length;
        this.checkOneKey();
        this.reward_com.updateView(this.ctrlData.passGrade,this.data.isPay);
        this.tab0.numItems = this.tab0Data.length;
        if(this.data.state == 1){
            let arr = this._refresh_dayCfg.split(',');
            let idx = arr.length - this.ctrlData.passTaskModel.dayFreshNum;
            if(idx>=0){
                idx = idx;
            }else{
                idx = 0;
            }
            this.btn_refresh.title = LangManager.Instance.GetTranslation('Passport.tip9',idx,arr.length)
            this.btn_refresh.enabled = idx>0;
        }
    }

    /**
     * 【【例维】刷新任务后，完成任务会遗留一个假的任务（刷新后消失）【偶现】】https://www.tapd.cn/36229514/bugtrace/bugs/view?bug_id=1136229514001047124
     */
    // private checkRepeatTask(){
    //     let array = this.taskListData;
    //     for (let i = 0; i < array.length; i++) {
    //         const taskData = array[i];
    //         let cfg = TempleteManager.Instance.getPassTask(taskData.taskType,taskData.taskId);
    //         if(cfg){
    //             if(taskData.finishNum == cfg.TaskNum && taskData.status == 2){
    //                 this.taskListData.splice(i,1);
    //                 break;
    //             }
    //         }
    //     }
    // }

    initEvent(){
        this.taskList.setVirtual();
        this.taskList.itemRenderer = Laya.Handler.create(this, this.onRenderTaskList, null, false);
        this.tab0.itemRenderer = Laya.Handler.create(this, this.onTab0, null, false);
        this.tab0.on(fairygui.Events.CLICK_ITEM, this, this.onSelectTab0);
        this.btn_buy.onClick(this,this.onBuy);
        this.btn_claim.onClick(this,this.onClaim);
        this.btn_refresh.onClick(this,this.onRefresh);
        NotificationManager.Instance.on(PassCheckEvent.RECEIVE_PASS_REWARD,this.onRecvPassInfo,this);
        NotificationManager.Instance.on(PassCheckEvent.PASS_TASK_FRESH,this.onRecvTaskFresh,this);
    }

    removeEvent(){
        // this.taskList.itemRenderer.recover();
        Utils.clearGListHandle(this.taskList);
        this.tab0.off(fairygui.Events.CLICK_ITEM, this, this.onSelectTab0);
        // this.tab0.itemRenderer.recover();
        Utils.clearGListHandle(this.tab0);
        this.btn_buy.offClick(this,this.onBuy);
        this.btn_refresh.offClick(this,this.onRefresh);
        this.btn_claim.offClick(this,this.onClaim);
        NotificationManager.Instance.off(PassCheckEvent.RECEIVE_PASS_REWARD,this.onRecvPassInfo,this);
        NotificationManager.Instance.off(PassCheckEvent.PASS_TASK_FRESH,this.onRecvTaskFresh,this);
    }
    updateExp(){
        let level = this.ctrlData.passGrade;
        //当前等级已获得的经验值/当前等级最大经验值
        let curExp = this.ctrlData.passExp%100;
        this.txt_exp.text =  curExp+ '/' + 100;
        this.txt_explv.text = this.ctrlData.passGrade.toString();
        this.expbar.value = curExp;
        if(level >= this._maxGrade){
            this.c2.selectedIndex = 1;
            this.txt_explv.text = this.ctrlData.passGrade.toString();
        }
       
    }

    private refreshView(){ 
        this.data = this.ctrlData.passRewardInfo;
        this.updateExp();
        this.reward_com.img_lock.visible = !this.data.isPay;
        if(PassportView.isLogin && !this.data.isPay){
            this.reward_com.img_red.visible = true;
        }
        this.reward_com.updateView(this.ctrlData.passGrade,this.data.isPay);
        if(this._leftTime > 0){//只需要刷新购买状态
            this.reward_com.img_lock.visible = !this.data.isPay;
            return;
        }
        this.tab0Data = [LangManager.Instance.GetTranslation('mainBar.TopToolsBar.dayGuideBtnTipData')];
        // this.taskTypeArr = [];
        //任务分类: 任务共分为今日、本周、成就三种任务类型, 由数据表t_s_passchecktask中的（Area）字段控制【1每日任务、2每周任务, 3成就任务】
        for (let i = 1; i < 3; i++) {
            if(TempleteManager.Instance.hasPassTask(i)){
                // this.taskTypeArr.push(i);
                this.tab0Data.push(LangManager.Instance.GetTranslation('pass.tab'+ (i-1)))
            }
        }
        this.tab0.numItems = this.tab0Data.length;
        this.tab0.selectedIndex = 0;

        this._leftTime = this.data.leftTime;
        this.txt_left_time.text = DateFormatter.getSevenDateString(this._leftTime);
        //活动时间
        if (this._leftTime > 0) {
            Laya.timer.loop(1000, this, this.onTimer);
        }
        this.checkOneKey();
        if(this.data.state == 2 && this.tab0.selectedIndex != 0){
            //在玩家有任务奖励未领取时
            if(!this.btn_claim.enabled){
                this.c1.selectedIndex = 2;//在玩家无任务奖励未领取（或领取任务奖励之后）, 或无任务刷新出来时, 显示为空白页面
            }
        }
    }

    private updateTaskList(index:number){
        this.taskListData.length = 0;
        this.taskListData = this.ctrlData.passTaskModel.getTaskListByType(index);
        this.taskListData = ArrayUtils.sortOn(this.taskListData, ["status"], ArrayConstant.NUMERIC | ArrayConstant.NUMERIC);
        this.taskList.numItems = this.taskListData.length;
    }

    onTimer() {
        this._leftTime--;
        this.txt_left_time.text = DateFormatter.getSevenDateString(this._leftTime);
        if (this._leftTime <= 0) {
            Laya.timer.clear(this, this.onTimer);
            FrameCtrlManager.Instance.exit(EmWindow.Welfare);
        }
    }

    onSelectTab0(item:fairygui.GButton){
        let index = this.tab0Data.indexOf(item.title);
        if(this._curSelectIdx == index){
            return;
        }
        this._curSelectIdx = index;
        this.c1.selectedIndex = index > 0 ? 1 : 0;
       
        if(index>0){
            this.updateTaskList(index);
            let arr = this._refresh_dayCfg.split(',');
            let idx = arr.length - this.ctrlData.passTaskModel.dayFreshNum;
            if(idx>=0){
                idx = idx;
            }else{
                idx = 0;
            }
            this.btn_refresh.title = LangManager.Instance.GetTranslation('Passport.tip9',idx,arr.length)
            this.btn_refresh.visible = true;
            this.checkOneKey();
            if(index == 1){
                if(this.data.state == 1){
                    this.btn_refresh.enabled = idx >0;
                }else{
                    this.btn_refresh.enabled = false;
                }
            }else{
                this.btn_refresh.visible = false;
            }
            if(this.data.state == 2){
                //在玩家有任务奖励未领取时
                if(!this.btn_claim.enabled){
                    this.c1.selectedIndex = 2;//在玩家无任务奖励未领取（或领取任务奖励之后）, 或无任务刷新出来时, 显示为空白页面
                }
            }
        }else{
            this.reward_com.scrollEnd();
            this.btn_refresh.visible = false;
            this.checkOneKey();
        }
    }

    /**
     * 购买等级
     */
    onBuy(){
        UIManager.Instance.ShowWind(EmWindow.PassBuyWnd);
    }

    /**
     * 是否显示一键领取
     */
    private checkOneKey(){
        if(this.tab0.selectedIndex == 0){
            this.btn_claim.enabled = this.ctrlData.canReceivePassCheckReward > 0;
        }else{
            //自动领取今日+本周页签下的任务经验, 成就页签不要一键领取按钮
            let area = this.tab0.selectedIndex;
            if(area < 3){
                this.btn_claim.enabled = this.ctrlData.canReceivePassTaskByArea(area);
            }else{
                this.btn_claim.enabled = false;
            }
        }
        if(this.btn_claim.enabled){
            this.btn_claim.getChild('redDot').visible = true;
        }else{
            this.btn_claim.getChild('redDot').visible = false;
        }
    }

    /**
     * 一键领取
     */
    private onClaim(){
        if(this.tab0.selectedIndex == 0){
            //奖励一键领取
            WelfareManager.Instance.reqPassRewardInfo(3,0,0);
        }else{
            //自动领取今日+本周页签下的任务经验, 成就页签不要一键领取按钮
            let area = this.tab0.selectedIndex;
            if(area < 3){
                WelfareManager.Instance.reqPassTask(3,0,area,0,0);
            }
        }
        this.btn_claim.enabled = true;
        this.btn_claim.getChild('redDot').visible = false;
    }

    onRenderTaskList(index:number,item:PassTaskItem){
        if(item){
            item.setData(this.taskListData[index]);
        }
    }

    onTab0(index:number,item:any){
        if(item){
            item.title = this.tab0Data[index];
            if(index == 0){
                let showRed = PassportView.isLogin && !this.data.isPay
                item.getChild('redDot').visible = this.ctrlData.canReceivePassCheckReward || showRed;
            }else
            {
                // item.getChild('redDot').visible = this.ctrlData.canReceivePassCheckTaskReward;
                item.getChild('redDot').visible = this.ctrlData.canReceivePassTaskByArea(index);
            }
        }
    }

    onRefresh(){
        if(this.data.state ==2){
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation('Passport.tip7'));
            return;
        }
        //当有可领取任务时, 点击刷新按钮弹出系统文字提示: “请先领取任务经验后再刷新
        // if(this.btn_claim.enabled){
        //     MessageTipManager.Instance.show(LangManager.Instance.GetTranslation('Passport.tip6'));
        //     return;
        // }

        let content: string ='';
        let arr = this._refresh_dayCfg.split(',');
        let price = arr[this.ctrlData.passTaskModel.dayFreshNum];
        let leftCount = arr.length - this.ctrlData.passTaskModel.dayFreshNum;
        let parm = leftCount + '/' +arr.length;
        if(price == '0'){
            content = LangManager.Instance.GetTranslation("pass.buy4",price,parm);
        }else
        {
            content = LangManager.Instance.GetTranslation("Passport.tip10",price,parm); 
        }
        //【通行证】通行证每日刷新格式: 【价格,价格,价格...】
        let checkStr = LangManager.Instance.GetTranslation("mainBar.view.VipCoolDownFrame.useBind");
        SimpleAlertHelper.Instance.Show(SimpleAlertHelper.USEBINDPOINT_ALERT, { checkRickText: checkStr, checkDefault: true }, null, content, null, null, this.confirmback.bind(this));
    }

    private confirmback(b: boolean, check: boolean) {
        if (b) {
            let buyType = check ? 0 : 1;
            // WelfareManager.Instance.reqPassTask(2,this.data.taskId,this.data.area,this.data.id,buyType);
            WelfareManager.Instance.reqPassTask(2,0,this.tab0.selectedIndex,0,buyType);
        }
    }

    dispose(): void {
        this.removeEvent();
        Laya.timer.clear(this, this.onTimer);
        super.dispose();
    }


}