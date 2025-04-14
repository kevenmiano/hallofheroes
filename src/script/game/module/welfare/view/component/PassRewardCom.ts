import FUI_PassRewardCom from "../../../../../../fui/Welfare/FUI_PassRewardCom";
import LangManager from "../../../../../core/lang/LangManager";
import UIManager from "../../../../../core/ui/UIManager";
import { t_s_passcheckData } from "../../../../config/t_s_passcheck";
import { EmWindow } from "../../../../constant/UIDefine";
import { PassCheckEvent } from "../../../../constant/event/NotificationEvent";
import { ArmyManager } from "../../../../manager/ArmyManager";
import { NotificationManager } from "../../../../manager/NotificationManager";
import { TempleteManager } from "../../../../manager/TempleteManager";
import { FrameCtrlManager } from "../../../../mvc/FrameCtrlManager";
import { ThaneEquipShowHelper } from "../../../../utils/ThaneEquipShowHelper";
import WelfareCtrl from "../../WelfareCtrl";
import WelfareData from "../../WelfareData";
import PassportView from "../PassportView";
import PassRewardItem from "./PassRewardItem";

/**
 * @author:zhihua.zhou
 * @data: 2022-05-30
 * @description 勇士犒赏令的奖励列表
 * 奖励分为基础奖励+进阶奖励, 分别读取数据表t_s_passcheck中免费奖励（FreeReward）和进阶奖励（PayReward）的数据,
 */
export default class PassRewardCom extends FUI_PassRewardCom {
  next: PassRewardItem;
  private listData: Array<t_s_passcheckData>;
  private _curIndex: number = -1;
  private grade: number;
  private _maxGrade: number;
  private isPay: boolean;

  onConstruct() {
    super.onConstruct();

    let cfgVal = TempleteManager.Instance.getConfigInfoByConfigName(
      "passcheck_max_grade",
    ).ConfigValue;
    if (cfgVal) {
      this._maxGrade = parseInt(cfgVal);
    }
    this.list.setVirtual();
    this.list.itemRenderer = Laya.Handler.create(
      this,
      this.onRenderList0,
      null,
      false,
    );
    this.list.on(fgui.Events.SCROLL, this, this.onScroll);
    this.listData = TempleteManager.Instance.getPassCheckCfeByJob(
      this.ctrlData.passRewardInfo.passIndex,
    );
    if (this.listData.length == 0) {
      this.listData = TempleteManager.Instance.getPassCheckCfeByJob(0);
    }
    this.list.scrollPane.mouseWheelEnabled = false;
    this.initLanguage();
    this.img_lock.onClick(this, this.onAdvance);
  }

  private initLanguage() {
    this.txt_0.text = LangManager.Instance.GetTranslation("pass.text06");
    this.txt_1.text = LangManager.Instance.GetTranslation("pass.text07");
  }

  updateView(grade: number, isPay: boolean) {
    this.grade = grade;
    this.isPay = isPay;
    this.list.numItems = this.listData.length;
    this.scrollEnd();
  }

  /**
   * 跳转到直到的地方
   */
  public gotoIndex() {
    //当战令等级溢出时, 显示为最高等级页面
    if (this.grade > this._maxGrade) {
      this.list.scrollToView(this.list.numItems - 1);
      return;
    }
    let idx = this.ctrlData.canReceivePassCheckReward;
    if (idx > 0) {
      //在有未领取奖励时, 打开页面, 等级最低的未领取奖励位于页面第二栏
      idx = Math.min(idx, this.list.numItems - 1);
      idx = idx - 2;
    } else {
      //在无未领取奖励时, 当前战令最高等级位于页面第一栏
      idx = Math.min(this.grade, this.list.numItems - 1);
      idx = idx - 1;
    }
    idx = Math.max(0, idx);
    this.list.scrollToView(idx, false, true);
  }

  /**
   * 进阶犒赏令
   */
  onAdvance() {
    if (PassportView.isLogin) {
      PassportView.isLogin = false;
      this.img_red.visible = false;
      NotificationManager.Instance.dispatchEvent(
        PassCheckEvent.RECEIVE_PASS_REWARD,
        [false],
      );
    }
    UIManager.Instance.ShowWind(EmWindow.PassAdvanceWnd);
  }

  onScroll() {
    Laya.timer.callLater(this, this.scrollEnd);
  }

  scrollEnd() {
    let index = this.list.childIndexToItemIndex(0);
    if (this._curIndex != index) {
      this._curIndex = index;
      //i.	战令最大等级后的预览奖励栏的等级改为“≥XX级”
      if (this.grade >= this._maxGrade) {
        //ii.	当玩家达到战令最大等级后, 预览栏固定只显示溢出等级奖励, 左侧常规等级奖励滑动不再影响预览栏
        this.showNext();
      } else {
        //拖动到100级时预览奖励显示>100级奖励
        if (this._curIndex >= this._maxGrade - 5) {
          this.showNext();
          return;
        }
        let nextData = this.getNextData(this._curIndex);
        if (nextData) {
          this.next.setData(nextData);
          this.next.c1.setSelectedIndex(1);
          this.next.visible = true;
          this.next.img_claim0.visible =
            this.next.img_claim1.visible =
            this.next.img_claim1.visible =
              false;
          this.next.img_red0.visible =
            this.next.img_red1.visible =
            this.next.img_red2.visible =
              false;
          this.next.img_lock0.visible =
            this.next.img_lock1.visible =
            this.next.img_lock2.visible =
              false;
        }
        this.next.txt_count.text = "";
        this.next.group0.y = -22;
        this.next.c1.setSelectedIndex(1);
      }
      this.next.visible = true;
    } else {
      if (this.grade >= this._maxGrade) {
        this.showNext();
      }
    }
  }

  private showNext() {
    let maxCfg = TempleteManager.Instance.getPassCheckItemByGrade(
      -1,
      this.ctrlData.passRewardInfo.passIndex,
    );
    if (!maxCfg) {
      maxCfg = TempleteManager.Instance.getPassCheckItemByGrade(-1, 0);
    }
    this.next.setData(maxCfg);
    //只要返回给你的这个奖励等级小于你当前的等级的时候  溢出奖励, 已领取等级
    if (
      this.ctrlData.passRewardInfo.rewardGrade < this.grade ||
      this.grade == 0
    ) {
      if (this.grade > this._maxGrade) {
        this.next.baseState = PassRewardItem.OPEN;
      } else {
        this.next.baseState = PassRewardItem.DEFAULT;
      }
    } else {
      this.next.baseState = PassRewardItem.CLOSE;
    }
    this.next.c1.setSelectedIndex(2);
    this.next.group1.visible = false;
    this.next.group2.visible = false;
    this.next.group0.y = 90;
    this.next.txt_level.text =
      ">" +
      LangManager.Instance.GetTranslation("public.level2", this._maxGrade);
    //当前等级与rewargrade 的差值, 如果rewardgrade==0, 就是当前等级与最大等级的差值
    if (this.ctrlData.passRewardInfo.rewardGrade == 0) {
      let val = this.grade - this._maxGrade;
      val = Math.max(val, 1);
      this.next.txt_count.text = "X" + val;
    } else {
      this.next.txt_count.text =
        "X" + (this.grade - this.ctrlData.passRewardInfo.rewardGrade);
    }
    if (this.next.txt_count.text == "X0") {
      this.next.txt_count.visible = false;
    } else {
      this.next.txt_count.visible = true;
    }
  }

  /**
   * 根据当前列表显示的第一个等级, 判断下一个可预览等级
   * @param idx
   * @returns
   */
  getNextData(idx: number): t_s_passcheckData {
    idx += 5;
    if (this.listData.length) {
      while (idx < this._maxGrade) {
        let data = this.listData[idx];
        if (data.IsTips == 1) {
          return this.listData[idx];
        }
        idx++;
      }
    }
    return null;
  }

  onRenderList0(index: number, item: PassRewardItem) {
    if (item) {
      item.setData(this.listData[index]);

      let grade = item.cfgdata.Grade;
      if (this.ctrlData.passRewardInfo.isReceivedBase(grade))
        item.baseState = PassRewardItem.CLOSE;
      else if (this.canPick(grade))
        //判断活跃度值是否满足
        item.baseState = PassRewardItem.OPEN;
      else item.baseState = PassRewardItem.DEFAULT;

      if (this.ctrlData.passRewardInfo.isReceivedAdvance(grade))
        item.advanceState = PassRewardItem.CLOSE;
      else if (this.canPick(grade) && this.isPay)
        //判断活跃度值是否满足
        item.advanceState = PassRewardItem.OPEN;
      else item.advanceState = PassRewardItem.DEFAULT;
    }
  }

  /**
   * 指定的奖励是否可以领取
   * */
  public canPick(point: number = 0): boolean {
    if (this.grade >= point) return true;
    return false;
  }

  private get control(): WelfareCtrl {
    return FrameCtrlManager.Instance.getCtrl(EmWindow.Welfare) as WelfareCtrl;
  }

  private get ctrlData(): WelfareData {
    return this.control.data;
  }

  dispose(): void {
    if (this.img_lock) {
      this.img_lock.offClick(this, this.onAdvance);
    }
    if (this.list) {
      this.list.off(fgui.Events.SCROLL, this, this.onScroll);
    }
    super.dispose();
  }
}
