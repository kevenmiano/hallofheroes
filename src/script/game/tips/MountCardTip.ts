import LangManager from "../../core/lang/LangManager";
import ResMgr from "../../core/res/ResMgr";
import UIManager from "../../core/ui/UIManager";
import { DateFormatter } from "../../core/utils/DateFormatter";
import StringHelper from "../../core/utils/StringHelper";
import { MovieClip } from "../component/MovieClip";
import { BaseItem } from "../component/item/BaseItem";
import { t_s_itemtemplateData } from "../config/t_s_itemtemplate";
import { t_s_mounttemplateData } from "../config/t_s_mounttemplate";
import GoodsSonType from "../constant/GoodsSonType";
import { EmWindow } from "../constant/UIDefine";
import { GoodsInfo } from "../datas/goods/GoodsInfo";
import { PlayerInfo } from "../datas/playerinfo/PlayerInfo";
import { AnimationManager } from "../manager/AnimationManager";
import { ArmyManager } from "../manager/ArmyManager";
import { MessageTipManager } from "../manager/MessageTipManager";
import { MountsManager } from "../manager/MountsManager";
import { PathManager } from "../manager/PathManager";
import { PlayerManager } from "../manager/PlayerManager";
import { TempleteManager } from "../manager/TempleteManager";
import { ToolTipsManager } from "../manager/ToolTipsManager";
import { BagHelper } from "../module/bag/utils/BagHelper";
import { GoodsCheck } from "../utils/GoodsCheck";
import BaseTips from "./BaseTips";

/**
 * @description
 * @author yuanzhan.yu
 * @date 2021/8/10 15:42
 * @ver 1.0
 */
export class MountCardTip extends BaseTips {
  public bg: fgui.GLoader;
  public item: BaseItem;
  public txt_name: fgui.GTextField;
  public txt_useLevel: fgui.GTextField;
  public txt_type: fgui.GTextField;
  public txt_bind: fgui.GTextField;
  public subBox1: fgui.GGroup;
  public txt_addition: fgui.GRichTextField;
  public txt_score: fgui.GRichTextField;
  public txt_desc: fgui.GRichTextField;
  public txt_price: fgui.GTextField;
  public group_price: fgui.GGroup;
  public txt_time: fgui.GTextField;
  public btn_use: fgui.GButton;
  public btn_batchUse: fgui.GButton;
  public group_oprate: fgui.GGroup;
  public n25: fgui.GGroup;
  public subBox2: fgui.GGroup;
  public totalBox: fgui.GGroup;
  public dot: fgui.GImage;
  public animationCom: fgui.GComponent;

  private _info: GoodsInfo;
  private _canOperate: boolean;

  constructor() {
    super();
  }

  public OnInitWind() {
    super.OnInitWind();

    this.initData();
    this.initView();
    this.addEvent();

    this.updateView();
    //note 调用ensureBoundsCorrect立即重排
    this.totalBox.ensureBoundsCorrect();
  }

  private initData() {
    [this._info, this._canOperate] = this.params;
  }

  private initView() {}

  private addEvent() {
    this.btn_use.onClick(this, this.onBtnUseClick.bind(this));
    this.btn_batchUse.onClick(this, this.onBtnBatchUseClick.bind(this));
  }

  public OnShowWind() {
    super.OnShowWind();
  }

  private updateView() {
    if (this._info) {
      this.item.info = this._info;
      this.item.isActive.selectedIndex = 0; //不显示时装和坐骑的已激活标识
      this.item.text = "";
      this.txt_name.text = this._info.templateInfo.TemplateNameLang;
      this.txt_name.color = GoodsSonType.getColorByProfile(
        this._info.templateInfo.Profile,
      );
      this.txt_type.text = this.getGoodsTypeName(this._info.templateInfo);
      ToolTipsManager.Instance.setMountActiveTxt(this._info, this.txt_bind);

      //附加属性
      let mountTemplate: t_s_mounttemplateData =
        TempleteManager.Instance.getMountTemplateById(
          this._info.templateInfo.Property1,
        );
      let strArray: any[] = LangManager.Instance.GetTranslation(
        "mounts.WildsoulItem.tips01",
      ).split("|");
      let valueArray: any[] = [];
      if (mountTemplate) {
        valueArray = [
          mountTemplate.Power,
          mountTemplate.Intellect,
          mountTemplate.Physique,
          mountTemplate.Agility,
          mountTemplate.ExpandLevel, //属性上限
          mountTemplate.Speed,
        ]; //速度加成
      }

      let tipStr: string = "";
      for (let i: number = 0; i < valueArray.length; i++) {
        if (valueArray[i] != 0 && i < strArray.length) {
          tipStr +=
            StringHelper.repHtmlTextToFguiText(
              StringHelper.format(strArray[i], valueArray[i]),
            ) + "<br>";
        }
      }
      this.txt_addition.text = tipStr; //"智力+10<br/>体质+30<br/>体质+30<br/>体质+30";
      this.txt_score.text = LangManager.Instance.GetTranslation(
        "mountTip.soulscore",
        mountTemplate ? mountTemplate.SoulScore : 0,
      );

      this.txt_desc.visible = mountTemplate
        ? mountTemplate.Property2 != -1
        : false;
      if (mountTemplate && !mountTemplate.StarItem) {
        this.txt_desc.visible = false;
      }

      this.dot.visible = this.txt_desc.visible;
      if (this.txt_desc.visible) {
        this.txt_desc.text = LangManager.Instance.GetTranslation(
          "mountTip.soulsAdd",
          Math.ceil(mountTemplate ? mountTemplate.Power / 5 : 0),
        );
      }

      this.group_price.visible = this._info.templateInfo.SellGold > 0;
      let str: string =
        "" +
        this._info.templateInfo.SellGold * (1 + this._info.strengthenGrade * 2);
      this.txt_price.text = this._info.templateInfo.SellGold == 0 ? "" : str;

      if (this._info.templateInfo.NeedGrades > 1) {
        this.txt_useLevel.text = LangManager.Instance.GetTranslation(
          "yishi.view.tips.goods.EquipTipsContent.grade",
          this._info.templateInfo.NeedGrades,
        );
        if (
          !GoodsCheck.isGradeFix(
            ArmyManager.Instance.thane,
            this._info.templateInfo,
            false,
          )
        ) {
          this.txt_useLevel.color = "#FF0000";
        }
      } else {
        this.txt_useLevel.text = "";
      }

      if (this._info.id != 0) {
        this.txt_bind.visible = true;
      } else {
        this.txt_bind.visible = false;
      }

      //有效期
      // if (this._info.templateInfo.Property2 <= 0) {
      //     tipStr = LangManager.Instance.GetTranslation("mounts.WildsoulItem.forever");
      // }
      // else
      // {
      //     tipStr = LangManager.Instance.GetTranslation("mounts.WildsoulItem.tips02", this._info.templateInfo.Property2);
      // }
      // this.txt_time.text = tipStr;
      if (this._info.validDate > 0) {
        //加上时效性
        this.txt_time.visible = true;
      } else {
        this.txt_time.visible = false;
      }
      let timeStr: string;
      if (this._info.leftTime == -1) {
        timeStr = LangManager.Instance.GetTranslation(
          "yishi.view.tips.goods.EquipTip.timeStr01",
        );
      } else if (this._info.leftTime < 0) {
        timeStr = LangManager.Instance.GetTranslation(
          "yishi.view.tips.goods.EquipTip.timeStr02",
        );
      } else {
        timeStr = DateFormatter.getFullDateString(this._info.leftTime);
      }
      this.txt_time.text =
        LangManager.Instance.GetTranslation(
          "yishi.view.tips.goods.EquipTip.time.text",
        ) +
        ":" +
        timeStr;

      if (
        this._canOperate &&
        BagHelper.checkCanUseGoods(this._info.templateInfo.SonType)
      ) {
        this.group_oprate.visible = true;
        this.btn_batchUse.visible = this.showBatchUseBtn();
      } else {
        this.group_oprate.visible = false;
      }
      if (BagHelper.isOpenConsortiaStorageWnd()) {
        this.btn_batchUse.visible = false;
        this.btn_use.title = BagHelper.getText(this._info);
        this.group_oprate.visible = true;
      }

      this.n25.ensureBoundsCorrect();
      this.subBox1.ensureBoundsCorrect();
      if (mountTemplate) this.createAnimation(mountTemplate);
    }
  }

  private _mountMovieClip: MovieClip;
  private _avatarPath = "";
  private _cacheName = "";
  private createAnimation(mountTemplate: t_s_mounttemplateData) {
    let avatarPath = PathManager.getMountPath(mountTemplate.AvatarPath);
    this._avatarPath = avatarPath;
    ResMgr.Instance.loadRes(
      avatarPath,
      (res) => {
        if (this.destroyed) {
          return;
        }

        if (this._mountMovieClip) {
          this._mountMovieClip.stop();
          if (this._mountMovieClip.parent) {
            this._mountMovieClip.parent.removeChild(this._mountMovieClip);
          }
        }

        if (!res) {
          return;
        }
        let frames = res.frames;
        let _preUrl = res.meta.prefix;
        this._cacheName = _preUrl;

        let offsetX: number = 0;
        let offsetY: number = 0;
        if (res.offset) {
          let offset = res.offset;
          offsetX = offset.footX;
          offsetY = offset.footY;
        }

        AnimationManager.Instance.createAnimation(
          _preUrl,
          "",
          undefined,
          "",
          AnimationManager.MapPhysicsFormatLen,
        );
        this._mountMovieClip = new MovieClip(this._cacheName);
        this.animationCom.displayListContainer.addChild(this._mountMovieClip);
        this._mountMovieClip.gotoAndStop(1);

        let sourceSize = new Laya.Rectangle();
        for (let key in frames) {
          if (Object.prototype.hasOwnProperty.call(frames, key)) {
            let sourceItem = frames[key].sourceSize;
            sourceSize.width = sourceItem.w;
            sourceSize.height = sourceItem.h;
            break;
          }
        }
        this._mountMovieClip.pivotX = sourceSize.width >> 1;
        this._mountMovieClip.pivotY = sourceSize.height >> 1;

        let comWidth = this.animationCom.width;
        let comHiehgt = this.animationCom.height;
        let scaleX = comWidth / sourceSize.width;
        let scaleY = comHiehgt / sourceSize.height;
        let scale = Math.min(scaleX, scaleY);
        this._mountMovieClip.scale(scale, scale, true);
        // let scaleX:number = 294/sourceSize.width;
        // let scaleY:number = 190/sourceSize.height;
        // this._mountMovieClip.scaleX = this._mountMovieClip.scaleY = Math.min(scaleX, scaleY);

        this._mountMovieClip.x = this.animationCom.width >> 1;
        this._mountMovieClip.y = this.animationCom.height >> 1;

        this._mountMovieClip.gotoAndPlay(1, true);
        // let h = this.contentPane.y + this.contentPane.height -750;
        // if(h > 0){
        //     this.contentPane.y -= h;
        // }
        this.n25.ensureBoundsCorrect();
        this.subBox1.ensureBoundsCorrect();
        this.subBox2.ensureBoundsCorrect();
        this.animationCom.visible = true;
        this.updatePosition();
      },
      null,
      Laya.Loader.ATLAS,
    );
  }

  /**加载完成, 重置容器坐标 */
  private updatePosition() {}

  private getGoodsTypeName(temp: t_s_itemtemplateData): string {
    switch (temp.SonType) {
      case GoodsSonType.SONTYPE_TASK:
        return LangManager.Instance.GetTranslation(
          "yishi.view.tips.goods.PropTips.SONTYPE_TASK",
        );
      case GoodsSonType.SONTYPE_COMPOSE_MATERIAL:
        return LangManager.Instance.GetTranslation(
          "yishi.view.tips.goods.PropTips.COMPOSE_MATERIAL",
        );
    }
    return "";
  }

  private showBatchUseBtn(): boolean {
    let b: boolean = this._info.templateInfo.IsCanBatch == 1;
    return b;
  }

  private get playerInfo(): PlayerInfo {
    return PlayerManager.Instance.currentPlayerModel.playerInfo;
  }

  private onBtnUseClick() {
    if (BagHelper.isOpenConsortiaStorageWnd()) {
      BagHelper.consortiaStorageOperate(this._info);
      this.hide();
    } else {
      this.onBtnUseClick2();
    }
  }

  private onBtnUseClick2() {
    if (this._info) {
      let str: string = "";
      if (
        this._info.templateInfo.SonType != GoodsSonType.SONTYPE_NOVICE_BOX &&
        !GoodsCheck.isGradeFix(
          ArmyManager.Instance.thane,
          this._info.templateInfo,
          false,
        )
      ) {
        let str: string = LangManager.Instance.GetTranslation(
          "cell.view.GoodsItemMenu.command01",
        );
        MessageTipManager.Instance.show(str);
        this.hide();
        return;
      } else if (
        this._info.templateInfo.SonType == GoodsSonType.SONTYPE_MOUNT_CARD
      ) {
        MountsManager.Instance.sendUseGoods(this._info);
      }
    }
    this.hide();
  }

  private onBtnBatchUseClick() {
    if (
      this._info.templateInfo.SonType != GoodsSonType.SONTYPE_NOVICE_BOX &&
      !GoodsCheck.isGradeFix(
        ArmyManager.Instance.thane,
        this._info.templateInfo,
        false,
      )
    ) {
      let str: string = LangManager.Instance.GetTranslation(
        "cell.view.GoodsItemMenu.command01",
      );
      MessageTipManager.Instance.show(str);
      this.hide();
      return;
    }
    if (!BagHelper.Instance.checkCanMulUse(this._info)) {
      this.hide();
      return;
    }

    UIManager.Instance.ShowWind(EmWindow.BatchUseConfirmWnd, [this._info]);
    this.hide();
  }

  private removeEvent() {
    this.btn_use.offClick(this, this.onBtnUseClick.bind(this));
    this.btn_batchUse.offClick(this, this.onBtnBatchUseClick.bind(this));
  }

  protected OnClickModal() {
    this.hide();
  }

  public OnHideWind() {
    this.removeEvent();
    if (this._avatarPath) {
      //这里感觉不太好去清理动画相关的操作, 如果场景里面也在使用这个坐骑, 会不会造成显示问题？
      // ResMgr.Instance.cancelLoadByUrl(this._avatarPath);
      AnimationManager.Instance.clearAnimationByName(this._cacheName);
      ResMgr.Instance.clearTextureRes(this._avatarPath);
      this._avatarPath = null;
    }
    super.OnHideWind();
  }

  dispose(dispose?: boolean) {
    this._info = null;
    // this.item.dispose();

    super.dispose(dispose);
  }
}
