import ConfigMgr from "../../core/config/ConfigMgr";
import LangManager from "../../core/lang/LangManager";
import UIManager from "../../core/ui/UIManager";
import { DateFormatter } from "../../core/utils/DateFormatter";
import { BaseItem } from "../component/item/BaseItem";
import SimpleAlertHelper from "../component/SimpleAlertHelper";
import { t_s_dropitemData } from "../config/t_s_dropitem";
import { t_s_itemtemplateData } from "../config/t_s_itemtemplate";
import { t_s_obtainData } from "../config/t_s_obtain";
import { t_s_pettemplateData } from "../config/t_s_pettemplate";
import { CommonConstant } from "../constant/CommonConstant";
import { ConfigType } from "../constant/ConfigDefine";
import { BAG_EVENT } from "../constant/event/NotificationEvent";
import GoodsSonType from "../constant/GoodsSonType";
import GTabIndex from "../constant/GTabIndex";
import OpenGrades from "../constant/OpenGrades";
import TemplateIDConstant from "../constant/TemplateIDConstant";
import { EmWindow } from "../constant/UIDefine";
import { GoodsInfo } from "../datas/goods/GoodsInfo";
import { PlayerBufferInfo } from "../datas/playerinfo/PlayerBufferInfo";
import { PlayerInfo } from "../datas/playerinfo/PlayerInfo";
import { ArmyManager } from "../manager/ArmyManager";
import { CampaignManager } from "../manager/CampaignManager";
import CarnivalManager from "../manager/CarnivalManager";
import { FashionManager } from "../manager/FashionManager";
import { GoodsManager } from "../manager/GoodsManager";
import MarketManager from "../manager/MarketManager";
import { MessageTipManager } from "../manager/MessageTipManager";
import { MopupManager } from "../manager/MopupManager";
import { MountsManager } from "../manager/MountsManager";
import { NotificationManager } from "../manager/NotificationManager";
import OfferRewardManager from "../manager/OfferRewardManager";
import { PlayerBufferManager } from "../manager/PlayerBufferManager";
import { PlayerManager } from "../manager/PlayerManager";
import { ResourceManager } from "../manager/ResourceManager";
import { SocketSendManager } from "../manager/SocketSendManager";
import { TempleteManager } from "../manager/TempleteManager";
import { ToolTipsManager } from "../manager/ToolTipsManager";
import TreasureMapManager from "../manager/TreasureMapManager";
import { SceneManager } from "../map/scene/SceneManager";
import SceneType from "../map/scene/SceneType";
import { FashionModel } from "../module/bag/model/FashionModel";
import { RoleModel } from "../module/bag/model/RoleModel";
import { BagHelper } from "../module/bag/utils/BagHelper";
import HeadIconModel from "../module/bag/view/HeadIconModel";
import { ConsortiaControler } from "../module/consortia/control/ConsortiaControler";
import HomeWnd from "../module/home/HomeWnd";
import MainToolBar from "../module/home/MainToolBar";
import { PetData } from "../module/pet/data/PetData";
import PetModel from "../module/pet/data/PetModel";
import { ShopGoodsInfo } from "../module/shop/model/ShopGoodsInfo";
import { FrameCtrlManager } from "../mvc/FrameCtrlManager";
import { OfferRewardModel } from "../mvc/model/OfferRewardModel";
import { GoodsCheck } from "../utils/GoodsCheck";
import { SwitchPageHelp } from "../utils/SwitchPageHelp";
import { WorldBossHelper } from "../utils/WorldBossHelper";
import BaseTips from "./BaseTips";

/**
 * @description
 * @author yuanzhan.yu
 * @date 2021/5/13 15:56
 * @ver 1.0
 *
 */
export class PropTips extends BaseTips {
  public bg: fgui.GLoader;
  public item: BaseItem;
  public txt_name: fgui.GTextField;
  public txt_useLevel: fgui.GTextField;
  public txt_type: fgui.GTextField;
  public txt_bind: fgui.GTextField;
  public txt_owned: fgui.GTextField;
  public subBox1: fgui.GGroup;
  public txt_desc: fgui.GTextField;
  public txt_price: fgui.GTextField;
  public group_price: fgui.GGroup;
  public txt_time: fgui.GTextField;
  public btn_use: fgui.GButton;
  public btn_obtain: fgui.GButton;
  public btn_batchUse: fgui.GButton;
  public previewBtn: fgui.GButton;
  public group_oprate: fgui.GGroup;
  public subBox2: fgui.GGroup;
  public totalBox: fgui.GGroup;
  public container: fgui.GGroup;
  public leftBox: fgui.GGroup;
  public rightBox: fgui.GGroup;
  public list: fgui.GList;
  public n20: fgui.GGroup;
  public puarchargeTxt: fgui.GTextField;

  private _info: GoodsInfo;
  private _canOperate: boolean;
  private _previewType: string = "treasure";
  private isFashion: boolean = false; //时装合成

  constructor() {
    super();
  }

  public OnInitWind() {
    super.OnInitWind();

    this.initData();
    this.initView();
    this.addEvent();

    this.updateView();
    this.rightBox.visible = false;
    //note 调用ensureBoundsCorrect立即重排
    // this.n20.ensureBoundsCorrect();
    this.subBox1.ensureBoundsCorrect();
    this.subBox2.ensureBoundsCorrect();
    this.totalBox.ensureBoundsCorrect();
    this.leftBox.ensureBoundsCorrect();
    this.rightBox.ensureBoundsCorrect();
    this.container.ensureBoundsCorrect();
    this.contentPane.ensureBoundsCorrect();
  }

  private initData() {
    [this._info, this._canOperate] = this.params;
  }

  private initView() {
    this.subBox2.visible = true;
    this.puarchargeTxt.text = LangManager.Instance.GetTranslation(
      "market.tips.purcharge",
    );
  }

  private addEvent() {
    this.btn_obtain.onClick(this, this.onObtain);
    this.btn_use.onClick(this, this.onBtnUseClick.bind(this));
    this.btn_batchUse.onClick(this, this.onBtnBatchUseClick.bind(this));
    this.previewBtn.onClick(this, this.onClickPreviewBtn);
  }

  public OnShowWind() {
    super.OnShowWind();
  }

  private updateView() {
    if (!this._info) return;
    this.item.info = this._info;
    this.item.text = "";
    this.txt_name.text = this._info.templateInfo.TemplateNameLang;
    this.txt_name.color = GoodsSonType.getColorByProfile(
      this._info.templateInfo.Profile,
    );
    this.txt_type.text = this.getGoodsTypeName(this._info.templateInfo);
    if (this.txt_type.text == "") {
      this.txt_type.visible = false;
    }
    ToolTipsManager.Instance.setMountActiveTxt(this._info, this.txt_bind);
    this.txt_desc.text = this._info.templateInfo.DescriptionLang;
    // 218（坐骑卡）、109-112（时装部件）
    let sontypes = [218, 109, 110, 111, 112];
    this.previewBtn.visible = false;

    if (
      this._info.templateInfo.Property2 == 1 &&
      this._info.templateInfo.SonType == 206
    ) {
      let dropItems = TempleteManager.Instance.getDropItemssByDropId(
        this._info.templateId,
      );
      let tempGoods = new GoodsInfo();
      for (let dropitem of dropItems) {
        tempGoods.templateId = dropitem.ItemId;
        if (sontypes.indexOf(tempGoods.templateInfo.SonType) >= 0) {
          this.previewBtn.visible = true;
          this._previewType = "treasure";
          break;
        }
      }
    }

    if (
      this._info.templateInfo.Property2 == 1 &&
      this._info.templateInfo.SonType == GoodsSonType.SONTYPE_MULTI_BOX
    ) {
      this.previewBtn.visible = true;
      this._previewType = "box";
      this.previewBtn.getController("preview").selectedIndex = 1;
    }

    // if (this._info.isBinds) {
    //     this.txt_bind.text = LangManager.Instance.GetTranslation("yishi.view.tips.goods.EquipTipsContent.bind1");
    //     this.txt_bind.color = "#ee1a38";
    // }
    // else {
    //     this.txt_bind.text = LangManager.Instance.GetTranslation("yishi.view.tips.goods.EquipTipsContent.bind2");
    //     this.txt_bind.color = "#8eea17";
    // }
    //读取配置表t_s_dropitem所配置的宝箱内掉落概率及道具

    //类型为206的箱子道具新增字段控制描述显示.
    let p3 = this._info.templateInfo.Property3;
    if (this._info.templateInfo.SonType == 206 && p3 > 0) {
      let langs = LangManager.Instance;
      let showRandom = p3 == 2;
      let resultStr: string = "";
      let str0: string = "";
      let str1: string = "";
      let str2: string = "";
      let str3: string = langs.GetTranslation("propTips.boxTip6"); //没有1时, “并”字省略
      let dropArr: t_s_dropitemData[] =
        TempleteManager.Instance.getDropItemssByDropId(
          this._info.templateInfo.Property1,
        );
      for (let i = 0; i < dropArr.length; i++) {
        const dropdata: t_s_dropitemData = dropArr[i];
        let cfg = TempleteManager.Instance.getGoodsTemplatesByTempleteId(
          dropdata.ItemId,
        );
        if (dropdata.AppearType == 1) {
          //必定开出: str0
          if (str0 == "") {
            str0 = langs.GetTranslation("propTips.boxTip1") + "<br>";
          }
          str0 +=
            langs.GetTranslation(
              "propTips.boxTip4",
              cfg.TemplateNameLang,
              dropdata.Data,
            ) + "<br>";
        } else if (dropdata.AppearType == 4) {
          //并】可获得以下物品中的一种:  str1
          if (str1 == "") {
            str1 = langs.GetTranslation("propTips.boxTip2") + "<br>";
          }

          if (showRandom && dropdata.Random) {
            str1 +=
              langs.GetTranslation(
                "propTips.boxTip5",
                cfg.TemplateNameLang,
                dropdata.Data,
                dropdata.Random / 1000,
              ) + "<br>";
          } else {
            str1 +=
              langs.GetTranslation(
                "propTips.boxTip4",
                cfg.TemplateNameLang,
                dropdata.Data,
              ) + "<br>";
          }
        } else if (dropdata.AppearType == 3) {
          //同时有几率额外开出:
          if (str2 == "") {
            str2 = langs.GetTranslation("propTips.boxTip3") + "<br>";
          }
          if (showRandom && dropdata.Random) {
            str2 +=
              langs.GetTranslation(
                "propTips.boxTip5",
                cfg.TemplateNameLang,
                dropdata.Data,
                dropdata.Random / 100000,
              ) + "<br>";
          } else {
            str2 +=
              langs.GetTranslation(
                "propTips.boxTip4",
                cfg.TemplateNameLang,
                dropdata.Data,
              ) + "<br>";
          }
        }
      }
      if (str0.length > 0 && str1.length > 0) {
        str1 = str3 + str1;
      }
      if (str2.length) {
        str2 = "<br>" + str2;
      }
      resultStr = str0 + "<br>" + str1 + str2;
      this.txt_desc.text = resultStr;
    }
    let count = BagHelper.Instance.getUserCount(this._info.templateId);
    if (this._info.templateId == TemplateIDConstant.TEMP_ID_VIP_EXP) {
      //vip经验不显示数量
      this.txt_owned.text = "";
      this.txt_owned.visible = false;
    } else if (this._info.templateId == TemplateIDConstant.TEMP_ID_CUP) {
      //已使用道具次数/可使用道具次数
      let grade = ArmyManager.Instance.thane.grades;
      let max = "";
      //"30,10|40,15|50,20|60,25|70,30|80,35",
      let cfgItem =
        TempleteManager.Instance.getConfigInfoByConfigName("grail_level_point");
      if (cfgItem && cfgItem.ConfigValue) {
        let arr = cfgItem.ConfigValue.split("|");
        for (let i = arr.length - 1; i >= 0; i--) {
          const element = arr[i];
          if (element) {
            let arr1 = element.split(",");
            if (arr1) {
              if (grade >= parseInt(arr1[0])) {
                max = arr1[1];
                break;
              }
            }
            if (i == 0) {
              if (grade < parseInt(arr1[0])) {
                max = arr1[1];
              }
            }
          }
        }
      }
      let usedNum = ArmyManager.Instance.thane.skillCate.extraSkillPoint;
      let str = LangManager.Instance.GetTranslation(
        "propTips.canUseCount",
        usedNum,
        max,
      );
      this.txt_owned.text = str;
    } else {
      this.txt_owned.setVar("count", count + "").flushVars();
      this.txt_owned.visible = true;
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

    // if (this._info.id != 0) {
    //     this.txt_bind.visible = true;
    // }
    // else {
    //     this.txt_bind.visible = false;
    // }

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
      (BagHelper.checkCanUseGoods(this._info.templateInfo.SonType) ||
        this._info.templateInfo.TemplateId == CommonConstant.PET_SOUL_STONE)
    ) {
      this.group_oprate.visible = true;
      this.btn_batchUse.visible = this.showBatchUseBtn();
    } else {
      this.group_oprate.visible = false;
    }
    if (this._canOperate) {
      this.initFashion();
    }
    if (BagHelper.isOpenConsortiaStorageWnd()) {
      this.btn_batchUse.visible = false;
      this.btn_use.title = BagHelper.getText(this._info);
      this.group_oprate.visible = true;
    }

    if (this._info.templateInfo.ObtainId && BagHelper.isOpenBag()) {
      this.btn_obtain.visible = true;
      this.list.itemRenderer = Laya.Handler.create(
        this,
        this.onRender,
        null,
        false,
      );
      this.list.on(fairygui.Events.CLICK_ITEM, this, this.onClickObtain);
    }

    let showPurcharg = MarketManager.Instance.canPurchare(this._info);

    this.puarchargeTxt.visible = showPurcharg;
  }

  onRender(index: number, item: fairygui.GButton) {
    if (item) {
      let cfg: t_s_obtainData = this.obtainArr[index];
      if (cfg) {
        item.getChild("title").asTextField.text = cfg.NameLang;
        item.data = cfg;
      }
    }
  }

  private onClickPreviewBtn() {
    if (this._previewType === "treasure") {
      FrameCtrlManager.Instance.open(EmWindow.PreviewGoodsWnd, this._info);
    } else if (this._previewType === "box") {
      UIManager.Instance.ShowWind(EmWindow.PreviewBoxWnd, [
        this._info,
        1,
        true,
      ]);
      // FrameCtrlManager.Instance.open(EmWindow.PreviewBoxWnd, [this._info, 1, true]);
    }
    this.OnBtnClose();
  }

  private onClickObtain(item: fairygui.GButton) {
    if (!item.data) return;
    let obtainId = (item.data as t_s_obtainData).ObtainId;
    let campaignId = (item.data as t_s_obtainData).Param1;
    let difficult = (item.data as t_s_obtainData).Param2;
    if (obtainId > 10000 && obtainId < 20000) {
      //战役
      FrameCtrlManager.Instance.open(EmWindow.PveCampaignWnd, {
        CampaignId: campaignId,
      });
    } else if (obtainId > 20000 && obtainId < 30000) {
      //多人副本
      FrameCtrlManager.Instance.open(EmWindow.PveMultiCampaignWnd, {
        CampaignId: campaignId,
        difficult: difficult,
      });
    }
    FrameCtrlManager.Instance.exit(EmWindow.SRoleWnd);
    switch (obtainId) {
      case 30001: //商城
        SwitchPageHelp.gotoShopFrame();
        break;
      case 30002: //迷宫商店
        // FrameCtrlManager.Instance.open(EmWindow.MazeShopWnd, { returnToWinFrameData: 0 });
        FrameCtrlManager.Instance.open(EmWindow.ShopWnd, {
          page: 3,
          returnToWinFrameData: 0,
        });
        break;
      // case 30003://高级公会商城
      //     FrameCtrlManager.Instance.open(EmWindow.ShopCommWnd, { shopType: ShopGoodsInfo.CONSORTIA_SHOP })
      //     break;
      case 30003: //公会商城
      case 30004: //公会商城
        //看有没有加入公会 没有加入公会就调用公会加入的那个界面
        if (
          PlayerManager.Instance.currentPlayerModel.playerInfo.consortiaID == 0
        ) {
          FrameCtrlManager.Instance.open(EmWindow.ConsortiaApply);
        } else {
          let contorller = FrameCtrlManager.Instance.getCtrl(
            EmWindow.Consortia,
          ) as ConsortiaControler;
          var lv: number = contorller.model.consortiaInfo.shopLevel;
          if (lv <= 0) {
            MessageTipManager.Instance.show(
              LangManager.Instance.GetTranslation(
                "shop.view.ShopFrame.command01",
              ),
            );
          } else {
            // FrameCtrlManager.Instance.open(EmWindow.ShopCommWnd, { shopType: ShopGoodsInfo.CONSORTIA_SHOP })
            FrameCtrlManager.Instance.open(EmWindow.ShopWnd, { page: 1 });
          }
        }
        break;
      case 30005: //紫晶商店
        FrameCtrlManager.Instance.open(EmWindow.MineralShopWnd);
        break;
      case 30006: //英灵兑换商店
        UIManager.Instance.ShowWind(EmWindow.PetExchangeShopWnd);
        break;
      case 30007: //竞技商店
        // FrameCtrlManager.Instance.open(EmWindow.PvpShop);
        FrameCtrlManager.Instance.open(EmWindow.ShopWnd, { page: 2 });
        break;
      case 30008: //农场商店
        FrameCtrlManager.Instance.open(EmWindow.FarmShopWnd);
        break;

      default:
        break;
    }
    this.hide();
  }

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

  private obtainArr: any;
  private onObtain() {
    if (this.rightBox.visible) {
      return;
    }
    this.obtainArr = [];
    let array = this._info.templateInfo.ObtainId.split(",");
    for (let i = 0; i < array.length; i++) {
      const obtainId = array[i];
      let cfg: t_s_obtainData = TempleteManager.Instance.getObtainCfg(obtainId);
      if (cfg) {
        this.obtainArr.push(cfg);
      }
    }
    this.list.numItems = this.obtainArr.length;
    this.list.resizeToFit(); //height = 50 * this.obtainArr.length
    this.rightBox.visible = true;

    this.rightBox.ensureBoundsCorrect();
    this.container.ensureBoundsCorrect();
    this.contentPane.ensureBoundsCorrect();
    this.contentPane.x -= this.rightBox.width;
    //TODO 判断边界
    // ToolTipsManager.Instance.setTipPos()
    // this.setCenter();
  }

  private showBatchUseBtn(): boolean {
    let b: boolean = this._info.templateInfo.IsCanBatch == 1;
    if (this._info.templateInfo.SonType == GoodsSonType.SONTYPE_BOX) {
      let num: number;
      switch (this._info.templateInfo.Property2) {
        case -800:
          num = Math.floor(
            ArmyManager.Instance.thane.gloryPoint /
              this._info.templateInfo.Property3,
          );
          break;
        case -700:
          num = Math.floor(
            ResourceManager.Instance.gold.count /
              this._info.templateInfo.Property3,
          );
          break;
        case -600:
          num = Math.floor(
            ResourceManager.Instance.waterCrystal.count /
              this._info.templateInfo.Property3,
          );
          break;
        case -500:
          num = Math.floor(
            this.playerInfo.giftToken / this._info.templateInfo.Property3,
          );
          break;
        case -400:
          num = Math.floor(
            this.playerInfo.point / this._info.templateInfo.Property3,
          );
          break;
        case -300:
          num = Math.floor(
            ResourceManager.Instance.gold.count /
              this._info.templateInfo.Property3,
          );
          break;
        case -200:
          num = Math.floor(
            this.playerInfo.mineral / this._info.templateInfo.Property3,
          );
          break;
        case -100:
          num = Math.floor(
            ResourceManager.Instance.gold.count /
              this._info.templateInfo.Property3,
          );
          break;
        default:
          num = Math.floor(
            GoodsManager.Instance.getGoodsNumByTempId(
              this._info.templateInfo.Property2,
            ) / this._info.templateInfo.Property3,
          );
          break;
      }
      let num2: number = Math.min(num, this._info.count);
      if (num2 > 1) {
        b = true;
      }
    }
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

  /**
   * 分解英灵珠所得
   * @param quality
   * @returns
   */
  private getDecomposeResult(quality) {
    let count = 1;
    if ((quality - 1) / 5 <= 0) {
      count = 2;
    } else if ((quality - 1) / 5 == 1) {
      count = 3;
    } else {
      count = Math.ceil(Math.pow((quality - 1) / 5, 4));
    }
    return count;
  }

  public petTemplate: t_s_pettemplateData;
  /**
   *使用英灵珠
   */
  private usePetPearl() {
    if (PetModel.checkSamePetType()) return;
    this.petTemplate = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_pettemplate,
      this._info.templateInfo.Property1,
    );
    if (this.petTemplate) {
      let arr = PetModel.getSamePetType(this.petTemplate.PetType);
      if (arr.length > 0) {
        //若已有对应系的英灵，则先比较当前拥有英灵，以及英灵珠对应英灵的阶级（P2）和品质
        if (arr.length == 1) {
          const petdata: PetData = arr[0];
          let confirm: string =
            LangManager.Instance.GetTranslation("public.confirm");
          let cancel: string =
            LangManager.Instance.GetTranslation("public.cancel");
          let prompt: string =
            LangManager.Instance.GetTranslation("public.prompt");
          let content: string;
          let p1 = "";
          let p2 = "";
          let quality: number = 0;
          //若英灵珠的阶级和品质均小于或等于当前拥有英灵，则提示“已拥有更优秀的英灵，是否分解物品获得 物品名 x数量”，确认后获得对应物品（旧版本献祭英灵的机制）
          if (
            this.petTemplate.Quality <= petdata.quality &&
            this.petTemplate.Property2 <= petdata.template.Property2
          ) {
            let temp = TempleteManager.Instance.getGoodsTemplatesByTempleteId(
              TemplateIDConstant.TEMP_ID_PET_COE_STONE,
            );
            if (temp) {
              quality = (this.petTemplate.Quality - 1) * 5 + 1;
              p1 = `[color=${PetData.getQualityColor(
                this.petTemplate.Quality - 1,
              )}]${this._info.templateInfo.TemplateNameLang}[/color]`;
              p2 = `[color=${temp.profileColor}]${
                temp.TemplateNameLang + " x" + this.getDecomposeResult(quality)
              }[/color]`;
              content = LangManager.Instance.GetTranslation(
                "PetSave.txt8",
                p1,
                p2,
              );
              SimpleAlertHelper.Instance.Show(
                SimpleAlertHelper.SIMPLE_ALERT,
                [this._info],
                prompt,
                content,
                confirm,
                cancel,
                this.confirmCallback.bind(this),
              );
            }
          } else {
            //若英灵珠的阶级和品质任意一项大于当前拥有英灵，则弹出覆盖提示 使用后，英灵名会变化为为英灵名，是否确认？
            quality = Math.max(petdata.quality, this.petTemplate.Quality); //取高品质的英灵的
            p1 = `[color=${PetData.getQualityColor(petdata.quality - 1)}]${
              petdata.template.TemplateNameLang
            }[/color]`;
            //取高阶级的英灵
            if (this.petTemplate.Property2 < petdata.template.Property2) {
              p2 = `[color=${PetData.getQualityColor(quality - 1)}]${
                petdata.template.TemplateNameLang
              }[/color]`;
            } else {
              p2 = `[color=${PetData.getQualityColor(quality - 1)}]${
                this.petTemplate.TemplateNameLang
              }[/color]`;
            }
            content = LangManager.Instance.GetTranslation(
              "PetSave.txt9",
              p1,
              p2,
            );
            SimpleAlertHelper.Instance.Show(
              SimpleAlertHelper.SIMPLE_ALERT,
              [this._info],
              prompt,
              content,
              confirm,
              cancel,
              this.confirmCallback.bind(this),
            );
          }
        }
      } else {
        //若没有对应系的英灵，则直接使用成功，获得对应英灵
        SocketSendManager.Instance.sendUseItem(this._info.pos);
      }
    }
  }

  private onBtnUseClick2() {
    if (this._info) {
      if (this.isFashion) {
        this.putInFashinComposite();
        this.hide();
        return;
      }
      let str: string = "";
      if (this._info.templateInfo.SonType == GoodsSonType.SONTYPE_PET_CARD) {
        this.usePetPearl();
        this.hide();
        return;
      } else if (
        this._info.templateInfo.SonType == GoodsSonType.SONTYPE_HEADFRAME
      ) {
        let goodsData: t_s_itemtemplateData =
          TempleteManager.Instance.getGoodsTemplatesByTempleteId(
            this._info.templateId,
          );
        if (HeadIconModel.instance.hasActive(goodsData)) {
          MessageTipManager.Instance.show(
            LangManager.Instance.GetTranslation(
              "propTips.headIcon.hasActiveTips",
            ),
          );
          this.hide();
          return;
        }
        SocketSendManager.Instance.sendUseItem(this._info.pos);
      } else if (
        this._info.templateInfo.SonType == GoodsSonType.SONTYPE_SOUL_CRYSTAL
      ) {
        //灵魂水晶
        if (ArmyManager.Instance.thane.grades < OpenGrades.VEHICEL) {
          MessageTipManager.Instance.show(
            LangManager.Instance.GetTranslation(
              "dayGuide.DayGuideManager.command02",
              OpenGrades.VEHICEL,
            ),
          );
          this.hide();
          return;
        }
        //跳转到灵魂刻印
        NotificationManager.Instance.dispatchEvent(BAG_EVENT.JEWEL);
        FrameCtrlManager.Instance.open(EmWindow.SRoleWnd, { openJewel: true });
      } else if (
        this._info.templateInfo.SonType == GoodsSonType.SONTYPE_MOUNT_FOOD
      ) {
        //兽灵石
        if (ArmyManager.Instance.thane.grades < OpenGrades.MOUNT) {
          MessageTipManager.Instance.show(
            LangManager.Instance.GetTranslation(
              "dayGuide.DayGuideManager.command02",
              OpenGrades.MOUNT,
            ),
          );
          this.hide();
          return;
        }
        FrameCtrlManager.Instance.open(EmWindow.MountsWnd);
      } else if (
        this._info.templateInfo.SonType == GoodsSonType.SONTYPE_PET_COST
      ) {
        //英灵凝神珠
        if (ArmyManager.Instance.thane.grades < OpenGrades.PET) {
          MessageTipManager.Instance.show(
            LangManager.Instance.GetTranslation(
              "dayGuide.DayGuideManager.command02",
              OpenGrades.PET,
            ),
          );
          this.hide();
          return;
        }
        FrameCtrlManager.Instance.open(EmWindow.Pet, {
          tabIndex: GTabIndex.Pet_AttrIntensify,
        });
      } else if (
        this._info.templateInfo.TemplateId == CommonConstant.PET_SOUL_STONE
      ) {
        //圣魂石
        if (ArmyManager.Instance.thane.grades < OpenGrades.PET) {
          MessageTipManager.Instance.show(
            LangManager.Instance.GetTranslation(
              "dayGuide.DayGuideManager.command02",
              OpenGrades.PET,
            ),
          );
          this.hide();
          return;
        }
        FrameCtrlManager.Instance.open(EmWindow.Pet, {
          tabIndex: GTabIndex.Pet_AttrAdvance,
        });
      } else if (
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
        this._info.templateInfo.SonType == GoodsSonType.SONTYPE_BLOOD
      ) {
        SocketSendManager.Instance.sendUseItem(this._info.pos);
      } else if (
        this._info.templateInfo.SonType == GoodsSonType.SONTYPE_TREASURE_MAP
      ) {
        // SimpleAlertHelper.Instance.Show(undefined, null, "", "功能开发中。。。");
        TreasureMapManager.Instance.useTreasureMap(this._info);

        FrameCtrlManager.Instance.exit(EmWindow.BagWnd);
        FrameCtrlManager.Instance.exit(EmWindow.RoleWnd);
      } else if (
        this._info.templateInfo.SonType == GoodsSonType.SONTYPE_NOVICE_BOX
      ) {
        //等级宝箱
        SocketSendManager.Instance.sendUseItem(this._info.pos);
        // FrameControllerManager.Instance.openControllerByInfo(UIModuleTypes.NOVICE_GRADE_BOX,null,this._info);
        return;
      } else if (
        this._info.templateInfo.SonType == GoodsSonType.SONTYPE_APPELL
      ) {
        //称号卡
        SocketSendManager.Instance.sendUseItem(this._info.pos);
        this.hide();
        return;
      } else if (this._info.templateInfo.SonType == GoodsSonType.SONTYPE_BOX) {
        //消耗道具使用宝箱
        switch (this._info.templateInfo.Property2) {
          case -800: //荣耀水晶
            if (
              ArmyManager.Instance.thane.gloryPoint <
              this._info.templateInfo.Property3
            ) {
              //荣耀水晶不足
              str = LangManager.Instance.GetTranslation(
                "cell.mediator.playerbag.PlayerBagCellClickMediator.command08",
              );
              MessageTipManager.Instance.show(str);
            } else {
              this.checkForUseBox(this._info, 1);
            }
            break;
          case -700: //经验
            if (
              ResourceManager.Instance.gold.count <
              this._info.templateInfo.Property3
            ) {
              //经验不足
              str = LangManager.Instance.GetTranslation(
                "cell.mediator.playerbag.PlayerBagCellClickMediator.command08",
              );
              MessageTipManager.Instance.show(str);
            } else {
              this.checkForUseBox(this._info, 1);
            }
            break;
          case -600: //光晶
            if (
              ResourceManager.Instance.waterCrystal.count <
              this._info.templateInfo.Property3
            ) {
              //光晶不足
              str = LangManager.Instance.GetTranslation(
                "cell.mediator.playerbag.PlayerBagCellClickMediator.command08",
              );
              MessageTipManager.Instance.show(str);
            } else {
              this.checkForUseBox(this._info, 1);
            }
            break;
          case -500: //绑定钻石
            if (this.playerInfo.giftToken < this._info.templateInfo.Property3) {
              //绑定钻石不足
              str = LangManager.Instance.GetTranslation(
                "cell.mediator.playerbag.PlayerBagCellClickMediator.command08",
              );
              MessageTipManager.Instance.show(str);
            } else {
              this.checkForUseBox(this._info, 1);
            }
            break;
          case -400: //钻石
            if (this.playerInfo.point < this._info.templateInfo.Property3) {
              //钻石不足
              str = LangManager.Instance.GetTranslation(
                "cell.mediator.playerbag.PlayerBagCellClickMediator.command08",
              );
              MessageTipManager.Instance.show(str);
            } else {
              this.checkForUseBox(this._info, 1);
            }
            break;
          case -300: //战魂
            if (
              ResourceManager.Instance.gold.count <
              this._info.templateInfo.Property3
            ) {
              //战魂不足
              str = LangManager.Instance.GetTranslation(
                "cell.mediator.playerbag.PlayerBagCellClickMediator.command08",
              );
              MessageTipManager.Instance.show(str);
            } else {
              this.checkForUseBox(this._info, 1);
            }
            break;
          case -200: //紫晶
            if (this.playerInfo.mineral < this._info.templateInfo.Property3) {
              //紫晶不足
              str = LangManager.Instance.GetTranslation(
                "cell.mediator.playerbag.PlayerBagCellClickMediator.command08",
              );
              MessageTipManager.Instance.show(str);
            } else {
              this.checkForUseBox(this._info, 1);
            }
            break;
          case -100: //黄金
            if (
              ResourceManager.Instance.gold.count <
              this._info.templateInfo.Property3
            ) {
              str = LangManager.Instance.GetTranslation(
                "cell.mediator.playerbag.PlayerBagCellClickMediator.command08",
              );
              MessageTipManager.Instance.show(str);
            } else {
              this.checkForUseBox(this._info, 1);
            }
            break;
          default:
            if (
              GoodsManager.Instance.getGoodsNumByTempId(
                this._info.templateInfo.Property2,
              ) < this._info.templateInfo.Property3
            ) {
              str = LangManager.Instance.GetTranslation(
                "cell.mediator.playerbag.PlayerBagCellClickMediator.command08",
              ); //开启宝箱需要消耗的物品不足, 不能开启
              MessageTipManager.Instance.show(str);
            } else {
              this.checkForUseBox(this._info, 1);
            }
            break;
        }
      } else if (
        this._info.templateInfo.SonType == GoodsSonType.SONTYPE_VIP_BOX
      ) {
        if (MopupManager.Instance.model.isMopup) {
          str = LangManager.Instance.GetTranslation(
            "mopup.MopupManager.mopupTipData01",
          );
          MessageTipManager.Instance.show(str);
          return;
        }
        // MaskUtils.Instance.maskShow(0);
        // SocketSendManager.Instance.sendUseVipMoney();
        SimpleAlertHelper.Instance.Show(
          undefined,
          null,
          "",
          "功能开发中。。。",
        );
        this.hide();
        return;
      } else if (this._info.templateInfo.SonType == GoodsSonType.SONTYPE_ROSE) {
        //todo 送花界面,  和好友里的送花界面略有不同,  可以送多种花
        // UIManager.Instance.ShowWind(EmWindow.SendFlowersWnd, "")
        FrameCtrlManager.Instance.open(EmWindow.FriendWnd);
        this.hide();
        return;
      } else if (
        this._info.templateInfo.SonType == GoodsSonType.SONTYPE_RENAME_CARD
      ) {
        //todo 改名界面,  略有不同,  可能
        UIManager.Instance.ShowWind(
          EmWindow.RenameWnd,
          RoleModel.TYPE_RENAME_CARD,
        );
        this.hide();
        return;
      } else if (
        this._info.templateInfo.SonType == GoodsSonType.SONTYPE_MOUNT_CARD
      ) {
        MountsManager.Instance.sendUseGoods(this._info);
      } else if (
        this._info.templateInfo.SonType == GoodsSonType.SONTYPE_SEX_CHANGE_CARD
      ) {
        //使用变性卡
        SocketSendManager.Instance.sendUseSexChangeCard(this._info.pos);
      } else if (
        this._info.templateInfo.SonType == GoodsSonType.SONTYPE_PASSIVE_SKILL
      ) {
        SimpleAlertHelper.Instance.Show(
          undefined,
          null,
          "",
          LangManager.Instance.GetTranslation("PropTips.openTip"),
        );
        // FrameControllerManager.Instance.armyController.startFrameByType(ArmyPanelEnum.SKILL_PANEL, 1);
      } else if (
        this._info.templateInfo.SonType == GoodsSonType.SONTYPE_PET_EXP_BOOK
      ) {
        this.checkForUsePetExpBook(this._info);
      } else if (
        this._info.templateInfo.SonType ==
        GoodsSonType.SONTYPE_PET_LAND_TRANSFER
      ) {
        // SimpleAlertHelper.Instance.Show(undefined, null, "", LangManager.Instance.GetTranslation("PropTips.openTip"));
        this.checkForUsePetLandTransfer(this._info);
      } else if (
        this._info.templateInfo.SonType ==
        GoodsSonType.SONTYPE_SINGLE_PASS_BUGLE
      ) {
        let limitLevel = 60; //天国号角 使用等级限制
        let userGrade = ArmyManager.Instance.thane.grades;
        let str: string = LangManager.Instance.GetTranslation(
          "playerinfo.view.EquipInfoView.WillOpenAt",
          limitLevel,
        );
        if (userGrade < limitLevel) {
          MessageTipManager.Instance.show(str);
          return;
        }
        UIManager.Instance.ShowWind(EmWindow.SinglePassBugleWnd);
      } else if (
        this._info.templateInfo.SonType == GoodsSonType.SONTYPE_MULTI_BOX
      ) {
        //多选宝箱
        // UIManager.Instance.ShowWind(EmWindow.MultiBoxSelectWnd, [this._info, 1]);
        UIManager.Instance.ShowWind(EmWindow.PreviewBoxWnd, [
          this._info,
          1,
          false,
        ]);
        this.hide();
        return;
      } else if (this.check()) {
        let itemBuffer: PlayerBufferInfo =
          PlayerBufferManager.Instance.getItemBufferInfo(
            this._info.templateInfo.Property1,
          );
        if (itemBuffer) {
          if (this._info.templateInfo.Property3 < itemBuffer.grade) {
            str = LangManager.Instance.GetTranslation(
              "cell.view.GoodsItemMenu.command02",
            );
            MessageTipManager.Instance.show(str);
            this.hide();
            return;
          }
          SocketSendManager.Instance.sendUseItem(this._info.pos);
        } else {
          if (
            this._info.templateInfo.Property1 == 5 &&
            this._info.templateInfo.Property2 > 0
          ) {
            let wearyGet: number = this._info.templateInfo.Property2;
            let pos: number = this._info.pos;
            let itemCount: number = 1;
            if (!this.checkWearyCanGet(wearyGet, pos, itemCount)) {
              this.hide();
              return;
            } else {
              if (!this.checkWearyTodayCanGet(wearyGet, pos, itemCount)) {
                this.hide();
                return;
              }
            }
          }
          SocketSendManager.Instance.sendUseItem(this._info.pos);
        }
      }
    }
    this.hide();
  }

  /**
   * 使用英灵岛传送符时 弹出确认框
   * @param item
   *
   */
  private checkForUsePetLandTransfer(item: GoodsInfo) {
    var canUse: boolean = false;
    switch (SceneManager.Instance.currentType) {
      case SceneType.SPACE_SCENE:
      case SceneType.CASTLE_SCENE:
      case SceneType.FARM:
        canUse = true;
        break;
      case SceneType.CAMPAIGN_MAP_SCENE:
        if (CampaignManager.Instance.mapModel) {
          if (WorldBossHelper.checkPetLand(CampaignManager.Instance.mapId)) {
            canUse = true;
          }
        }
        break;
      default:
        canUse = false;
        break;
    }
    if (canUse) {
      let confirm: string =
        LangManager.Instance.GetTranslation("public.confirm");
      let cancel: string = LangManager.Instance.GetTranslation("public.cancel");
      let prompt: string = LangManager.Instance.GetTranslation("public.prompt");
      let content: string = LangManager.Instance.GetTranslation(
        "checkForUsePetLandTransfer.content01",
        this.getPetLandLevel(item.templateInfo.Property1),
      );
      SimpleAlertHelper.Instance.Show(
        SimpleAlertHelper.SIMPLE_ALERT,
        [item],
        prompt,
        content,
        confirm,
        cancel,
        this.checkForUsePetExpBookBack.bind(this),
      );
    } else {
      let str: string = LangManager.Instance.GetTranslation(
        "checkForUsePetLandTransfer.content02",
      );
      MessageTipManager.Instance.show(str);
    }
  }

  private getPetLandLevel(templateId: number): string {
    let level: string = LangManager.Instance.GetTranslation(
      "checkForUsePetLandTransfer.level01",
    );
    switch (templateId) {
      case 20001:
        level = LangManager.Instance.GetTranslation(
          "checkForUsePetLandTransfer.level01",
        );
        break;
      case 20002:
        level = LangManager.Instance.GetTranslation(
          "checkForUsePetLandTransfer.level02",
        );
        break;
      case 20003:
        level = LangManager.Instance.GetTranslation(
          "checkForUsePetLandTransfer.level03",
        );
        break;
      case 20004:
        level = LangManager.Instance.GetTranslation(
          "checkForUsePetLandTransfer.level04",
        );
        break;
    }
    return level;
  }

  private checkForUseBox(item: GoodsInfo, num: number) {
    let confirm: string = LangManager.Instance.GetTranslation("public.confirm");
    let cancel: string = LangManager.Instance.GetTranslation("public.cancel");
    let prompt: string = LangManager.Instance.GetTranslation("public.prompt");
    let itemconfig: t_s_itemtemplateData = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_itemtemplate,
      item.templateInfo.Property2,
    );
    let costName: string = itemconfig.TemplateNameLang;
    let content: string = LangManager.Instance.GetTranslation(
      "cell.mediator.playerbag.PlayerBagCellClickMediator.command09",
      1,
      item.templateInfo.TemplateNameLang,
      1 * item.templateInfo.Property3,
      costName,
    );
    SimpleAlertHelper.Instance.Show(
      SimpleAlertHelper.SIMPLE_ALERT,
      [item, num],
      prompt,
      content,
      confirm,
      cancel,
      this.useBoxCallBack.bind(this),
    );
  }

  private useBoxCallBack(b: boolean, flag: boolean, data: any[]) {
    if (b) {
      let item: GoodsInfo = data[0];
      let num: number = data[1];
      SocketSendManager.Instance.sendUseItem(item.pos, num);
    }
  }

  /** 使用英灵经验书时 弹出确认框 */
  private checkForUsePetExpBook(item: GoodsInfo): void {
    let confirm: string = LangManager.Instance.GetTranslation("public.confirm");
    let cancel: string = LangManager.Instance.GetTranslation("public.cancel");
    let prompt: string = LangManager.Instance.GetTranslation("public.prompt");
    let content: string = LangManager.Instance.GetTranslation(
      "checkForUsePetExpBook.content02",
      item.templateInfo.Property2,
    );
    SimpleAlertHelper.Instance.Show(
      SimpleAlertHelper.SIMPLE_ALERT,
      [item],
      prompt,
      content,
      confirm,
      cancel,
      this.checkForUsePetExpBookBack.bind(this),
    );
  }

  private confirmCallback(result: boolean, flag: boolean, data: any[]) {
    if (result) {
      let item: GoodsInfo = data[0];
      if (!item) {
        return;
      }
      SocketSendManager.Instance.sendUseItem(item.pos);
    }
  }

  private checkForUsePetExpBookBack(
    result: boolean,
    flag: boolean,
    data: any[],
  ): void {
    if (!result) {
      return;
    }
    let item: GoodsInfo = data[0];
    if (!item) {
      return;
    }
    if (SceneManager.Instance.currentType == SceneType.BATTLE_SCENE) {
      return;
    }
    SocketSendManager.Instance.sendUseItem(item.pos);
  }

  private check(): boolean {
    let str: string = "";
    if (
      this._info.templateInfo.SonType ==
        GoodsSonType.SONTYPE_CONSORTIATIME_CARD &&
      (PlayerManager.Instance.currentPlayerModel.sysCurTimeBySecond -
        this.playerInfo.lastOutConsortia >=
        24 * 3600 ||
        !this.playerInfo.isAuto)
    ) {
      //盟约之证
      str = LangManager.Instance.GetTranslation(
        "cell.view.GoodsItemMenu.command07",
      );
      MessageTipManager.Instance.show(str);
      return false;
    }
    if (
      this._info.templateInfo.Property1 == 8 &&
      this.playerInfo.consortiaID == 0
    ) {
      str = LangManager.Instance.GetTranslation(
        "cell.view.GoodsItemMenu.command03",
      );
      MessageTipManager.Instance.show(str);
      this.hide();
      return false;
    }
    if (
      this._info.templateInfo.SonType == GoodsSonType.SONTYPE_COMPOSE &&
      this.playerInfo.composeList.indexOf(this._info.templateInfo.Property1) >=
        0
    ) {
      str = LangManager.Instance.GetTranslation(
        "cell.view.GoodsItemMenu.command04",
      );
      MessageTipManager.Instance.show(str);
      return false;
    }
    if (this._info.templateInfo.SonType == GoodsSonType.SONTYPE_REWARD_CARD) {
      if (MopupManager.Instance.model.isMopup) {
        str = LangManager.Instance.GetTranslation(
          "mopup.MopupManager.mopupTipData01",
        );
        MessageTipManager.Instance.show(str);
        return false;
      }
      if (this.rewardModel.baseRewardDic.getList().length >= 1) {
        str = LangManager.Instance.GetTranslation(
          "cell.view.GoodsItemMenu.command05",
        );
        MessageTipManager.Instance.show(str);
        return false;
      }
      if (this.rewardModel.remainRewardCount <= 0) {
        str = LangManager.Instance.GetTranslation(
          "cell.view.GoodsItemMenu.command06",
        );
        MessageTipManager.Instance.show(str);
        return false;
      }
    }
    if (this._info.templateInfo.SonType == GoodsSonType.SONTYPE_PET_CARD) {
      //英灵达上限
      let petNum: number = this.playerInfo.petList.length;
      if (petNum >= this.playerInfo.petMaxCount) {
        str = LangManager.Instance.GetTranslation("usePetCard.MaxNumber");
        MessageTipManager.Instance.show(str);
        return false;
      }
    }
    return true;
  }

  private checkWearyCanGet(
    wearyGet: number,
    pos: number,
    count: number = 1,
  ): boolean {
    // let wearyCanGet: number = PlayerInfo.WEARY_MAX - this.playerInfo.weary;
    // if (wearyGet > wearyCanGet) {
    //     let confirm: string = LangManager.Instance.GetTranslation("public.confirm");
    //     let cancel: string = LangManager.Instance.GetTranslation("public.cancel");
    //     let prompt: string = LangManager.Instance.GetTranslation("map.campaign.view.frame.SubmitResourcesFrame.titleTextTip");
    //     let content: string = LangManager.Instance.GetTranslation("cell.mediator.playerbag.PlayerBagCellClickMediator.command07", PlayerInfo.WEARY_MAX, wearyCanGet);
    //     SimpleAlertHelper.Instance.Show(SimpleAlertHelper.SIMPLE_ALERT, [wearyGet, pos, count], prompt, content, confirm, cancel, this.wearyCanGetCallBack.bind(this));
    //     return false;
    // }
    return true;
  }

  private checkWearyTodayCanGet(
    wearyGet: number,
    pos: number,
    count: number = 1,
  ): boolean {
    let wearyTodayCanGet: number =
      PlayerInfo.WEARY_GET_MAX - this.playerInfo.wearyLimit;
    if (wearyGet > wearyTodayCanGet) {
      let confirm: string =
        LangManager.Instance.GetTranslation("public.confirm");
      let cancel: string = LangManager.Instance.GetTranslation("public.cancel");
      let prompt: string = LangManager.Instance.GetTranslation(
        "map.campaign.view.frame.SubmitResourcesFrame.titleTextTip",
      );
      let content: string = LangManager.Instance.GetTranslation(
        "cell.mediator.playerbag.PlayerBagCellClickMediator.command06",
        PlayerInfo.WEARY_GET_MAX,
        wearyTodayCanGet,
      );
      SimpleAlertHelper.Instance.Show(
        SimpleAlertHelper.SIMPLE_ALERT,
        [wearyGet, pos, count, true],
        prompt,
        content,
        confirm,
        cancel,
        this.wearyTodayCanGetCallBack.bind(this),
      );
      return false;
    }
    return true;
  }

  private wearyCanGetCallBack(b: boolean, flag: boolean, data: any[]) {
    if (b) {
      let wearyGet: number = data[0],
        pos: number = data[1],
        count: number = data[2];
      if (this.checkWearyTodayCanGet(wearyGet, pos, count)) {
        SocketSendManager.Instance.sendUseItem(pos, count);
      }
    }
  }

  private wearyTodayCanGetCallBack(b: boolean, flag: boolean, data: any[]) {
    if (b) {
      let wearyGet: number = data[0],
        pos: number = data[1],
        count: number = data[2],
        today: boolean = data[3];
      SocketSendManager.Instance.sendUseItem(pos, count);
    }
  }

  private onBtnBatchUseClick() {
    if (this._info.templateInfo.SonType == GoodsSonType.SONTYPE_ROSE) {
      //todo 送花界面,  和好友里的送花界面略有不同,  可以送多种花
      // UIManager.Instance.ShowWind(EmWindow.SendFlowersWnd, "")
      FrameCtrlManager.Instance.open(EmWindow.FriendWnd);
      this.hide();
      return;
    }
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
    if (!BagHelper.Instance.checkCanMulUse(this._info) || !this.check()) {
      this.hide();
      return;
    }
    if (this._info.templateInfo.SonType == GoodsSonType.SONTYPE_NOVICE_BOX) {
      //等级宝箱
      SocketSendManager.Instance.sendUseItem(this._info.pos);
      // FrameControllerManager.Instance.openControllerByInfo(UIModuleTypes.NOVICE_GRADE_BOX,null,this._info);
      return;
    }

    let str: string = "";
    if (this._info.templateInfo.SonType == GoodsSonType.SONTYPE_BOX) {
      //消耗道具使用宝箱
      switch (this._info.templateInfo.Property2) {
        case -800: //荣耀水晶
          if (
            ArmyManager.Instance.thane.gloryPoint <
            this._info.templateInfo.Property3
          ) {
            //荣耀水晶不足
            str = LangManager.Instance.GetTranslation(
              "cell.mediator.playerbag.PlayerBagCellClickMediator.command08",
            );
            MessageTipManager.Instance.show(str);
            return;
          }
          break;
        case -700: //经验
          if (
            ResourceManager.Instance.gold.count <
            this._info.templateInfo.Property3
          ) {
            //经验不足
            str = LangManager.Instance.GetTranslation(
              "cell.mediator.playerbag.PlayerBagCellClickMediator.command08",
            );
            MessageTipManager.Instance.show(str);
            return;
          }
          break;
        case -600: //光晶
          if (
            ResourceManager.Instance.waterCrystal.count <
            this._info.templateInfo.Property3
          ) {
            //光晶不足
            str = LangManager.Instance.GetTranslation(
              "cell.mediator.playerbag.PlayerBagCellClickMediator.command08",
            );
            MessageTipManager.Instance.show(str);
            return;
          }
          break;
        case -500: //绑定钻石
          if (this.playerInfo.giftToken < this._info.templateInfo.Property3) {
            //绑定钻石不足
            str = LangManager.Instance.GetTranslation(
              "cell.mediator.playerbag.PlayerBagCellClickMediator.command08",
            );
            MessageTipManager.Instance.show(str);
            return;
          }
          break;
        case -400: //钻石
          if (this.playerInfo.point < this._info.templateInfo.Property3) {
            //钻石不足
            str = LangManager.Instance.GetTranslation(
              "cell.mediator.playerbag.PlayerBagCellClickMediator.command08",
            );
            MessageTipManager.Instance.show(str);
            return;
          }
          break;
        case -300: //战魂
          if (
            ResourceManager.Instance.gold.count <
            this._info.templateInfo.Property3
          ) {
            //战魂不足
            str = LangManager.Instance.GetTranslation(
              "cell.mediator.playerbag.PlayerBagCellClickMediator.command08",
            );
            MessageTipManager.Instance.show(str);
            return;
          }
          break;
        case -200: //紫晶
          if (this.playerInfo.mineral < this._info.templateInfo.Property3) {
            //紫晶不足
            str = LangManager.Instance.GetTranslation(
              "cell.mediator.playerbag.PlayerBagCellClickMediator.command08",
            );
            MessageTipManager.Instance.show(str);
            return;
          }
          break;
        case -100: //黄金
          if (
            ResourceManager.Instance.gold.count <
            this._info.templateInfo.Property3
          ) {
            str = LangManager.Instance.GetTranslation(
              "cell.mediator.playerbag.PlayerBagCellClickMediator.command08",
            );
            MessageTipManager.Instance.show(str);
            return;
          }
          break;
        default:
          if (
            GoodsManager.Instance.getGoodsNumByTempId(
              this._info.templateInfo.Property2,
            ) < this._info.templateInfo.Property3
          ) {
            str = LangManager.Instance.GetTranslation(
              "cell.mediator.playerbag.PlayerBagCellClickMediator.command08",
            ); //开启宝箱需要消耗的物品不足, 不能开启
            MessageTipManager.Instance.show(str);
            return;
          }
          break;
      }
    }

    UIManager.Instance.ShowWind(EmWindow.BatchUseConfirmWnd, [this._info]);
    this.hide();
  }

  private get rewardModel(): OfferRewardModel {
    return OfferRewardManager.Instance.model;
  }

  protected get fashionModel(): FashionModel {
    return FashionManager.Instance.fashionModel;
  }

  private initFashion() {
    let optTyp: string = FashionManager.Instance.getOptType(this._info);
    if (optTyp.length > 0) {
      this.btn_use.title = optTyp;
      this.isFashion = true;
      this.btn_use.x = (this.width - this.btn_use.width) >> 1;
      this.btn_batchUse.visible = false;
      this.group_oprate.visible = true;
    }
    let batchType = FashionManager.Instance.getBatchType(this._info);
    if (batchType.length > 0) {
      this.btn_batchUse.title = batchType;
      this.btn_batchUse.visible = true;
    }
  }

  /**
   * 放入
   * @returns
   */
  protected putInFashinComposite() {
    FashionManager.Instance.putInOut(this._info);
  }

  private removeEvent() {
    if (this._info.templateInfo.ObtainId) {
      this.list.off(fairygui.Events.CLICK_ITEM, this, this.onClickObtain);
    }
    this.previewBtn.offClick(this, this.onClickPreviewBtn);
    this.btn_obtain.offClick(this, this.onObtain.bind(this));
    this.btn_use.offClick(this, this.onBtnUseClick.bind(this));
    this.btn_batchUse.offClick(this, this.onBtnBatchUseClick.bind(this));
  }

  protected OnClickModal() {
    this.hide();
  }

  public OnHideWind() {
    super.OnHideWind();

    this.removeEvent();
  }

  dispose(dispose?: boolean) {
    this._info = null;
    super.dispose(dispose);
  }
}
