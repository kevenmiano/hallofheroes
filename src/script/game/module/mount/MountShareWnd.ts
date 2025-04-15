import ResMgr from "../../../core/res/ResMgr";
import SDKManager from "../../../core/sdk/SDKManager";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import { IconFactory } from "../../../core/utils/IconFactory";
import Utils from "../../../core/utils/Utils";
import { BaseItem } from "../../component/item/BaseItem";
import { t_s_mounttemplateData } from "../../config/t_s_mounttemplate";
import { IconType } from "../../constant/IconType";
import { GoodsInfo } from "../../datas/goods/GoodsInfo";
import { PlayerInfo } from "../../datas/playerinfo/PlayerInfo";
import { ArmyManager } from "../../manager/ArmyManager";
import ConfigInfoManager from "../../manager/ConfigInfoManager";
import { MountsManager } from "../../manager/MountsManager";
import { PathManager } from "../../manager/PathManager";
import { PlayerManager } from "../../manager/PlayerManager";
import FUIHelper from "../../utils/FUIHelper";
import { WildSoulCollection } from "./model/WildSoulCollection";
import { WildSoulInfo } from "./model/WildSoulInfo";
import { ConfigManager } from "../../manager/ConfigManager";
import { SHARE_CHANNEL } from "../../../core/sdk/SDKConfig";
import LangManager from "../../../core/lang/LangManager";
import { isOversea } from "../login/manager/SiteZoneCtrl";
import Resolution from "../../../core/comps/Resolution";

export default class MountShareWnd extends BaseWindow {
  public img_star: fgui.GImage;
  public starGroup: fgui.GGroup;
  public MountNameTxt: fgui.GRichTextField;
  public closeBtn: fgui.GButton;
  public rewardList: fgui.GList;
  public sharelist: fgui.GList;
  public firstShareReward: fgui.GGroup;
  private _rewardDataArr: Array<any> = [];
  private _mountData: t_s_mounttemplateData;
  private _path: string;
  private _preUrl: string;
  private _resUrl: string;
  private BackgroundGroup: fgui.GLoader;
  private centerPoint: fgui.GGraph;

  public isOversea: fgui.Controller;

  private _info: WildSoulInfo;
  private _mountImgSprite: Laya.Sprite;
  public playerIcon: fgui.GLoader;
  public userNameTxt: fgui.GTextField;
  public levelTxt: fgui.GTextField;
  public consortiaNameTxt: fgui.GTextField;
  public img1: fgui.GImage;
  public img2: fgui.GImage;
  public shareGroup: fgui.GImage;

  private shareDatalist: Array<any> = [];
  constructor() {
    super();
    this.resizeContent = true;
  }
  public OnInitWind() {
    this.addEvent();

    this.isOversea = this.getController("isOversea");
    this.isOversea.selectedIndex = isOversea() ? 1 : 0;
    if (this.params) {
      this._mountData = this.params.frameData;
      this.MountNameTxt.text = this._mountData.TemplateNameLang;
      this._info = this.wildSoulCollection.getWildSoulInfo(
        this._mountData.TemplateId,
      );
      if (this._info) {
        this.img_star.fillAmount = this._info.starLevel / 5;
      } else {
        this.img_star.fillAmount = 0;
      }
      let str: string = "Img_Mount_Bg" + this._mountData.MountType;
      this.BackgroundGroup.url = FUIHelper.getItemURL("Mount", str);
      this._rewardDataArr = ConfigInfoManager.Instance.getMountShareReward();
      this.rewardList.numItems = this._rewardDataArr.length;
      Utils.setDrawCallOptimize(this.rewardList);
      this.updateAvatar(this._mountData.AvatarPath);
      this.firstShareReward.visible = MountsManager.Instance.mountShareStatus;
      this.playerIcon.url = this.getIconUrl();
      this.userNameTxt.text = this.playerInfo.nickName;
      this.levelTxt.text = LangManager.Instance.GetTranslation(
        "public.level2",
        ArmyManager.Instance.thane.grades.toString(),
      );
      this.consortiaNameTxt.text = ArmyManager.Instance.thane.consortiaName;

      //
      this.setShareDatalist();
    }
    this.closeBtn.visible = true;
  }

  private addEvent() {
    this.rewardList.itemRenderer = Laya.Handler.create(
      this,
      this.renderListItem,
      null,
      false,
    );
    this.sharelist.itemRenderer = Laya.Handler.create(
      this,
      this.renderShareListItem,
      null,
      false,
    );
    this.sharelist.on(fairygui.Events.CLICK_ITEM, this, this.shareBtnHandlr);
  }

  private removeEvent() {
    if (this.rewardList.itemRenderer instanceof Laya.Handler) {
      this.rewardList.itemRenderer.recover();
    }
    if (this.sharelist.itemRenderer instanceof Laya.Handler) {
      this.sharelist.itemRenderer.recover();
    }
    this.sharelist.off(fairygui.Events.CLICK_ITEM, this, this.shareBtnHandlr);
    Utils.clearGListHandle(this.rewardList);
  }

  private shareBtnHandlr(item: fgui.GButton) {
    if (item && !item.isDisposed) {
      let typeCode = Number(item.data);
      this.firstShareReward.visible = false;
      this.sharelist.visible = false;
      this.closeBtn.visible = false;
      SDKManager.Instance.getChannel().saveScreenshot(this, 1, typeCode);
      this.OnBtnClose();
    }
  }

  /**
   * 分享
   */
  private setShareDatalist() {
    this.shareDatalist = [];
    //分享开关列表
    let shareOpen = [
      { switch: ConfigManager.info.FB_SHARE, id: SHARE_CHANNEL.FB },
      { switch: ConfigManager.info.Twitter_SHARE, id: SHARE_CHANNEL.Twitter },
      { switch: ConfigManager.info.Discord_SHARE, id: SHARE_CHANNEL.Discord },
      {
        switch: ConfigManager.info.Instagram_SHARE,
        id: SHARE_CHANNEL.Instagram,
      },
      { switch: ConfigManager.info.Telegram_SHARE, id: SHARE_CHANNEL.Telegram },
      { switch: ConfigManager.info.Whatsapp_SHARE, id: SHARE_CHANNEL.Whatsapp },
      { switch: ConfigManager.info.Youtube_SHARE, id: SHARE_CHANNEL.Youtube },
    ];
    let count = shareOpen.length;
    for (let index = 0; index < count; index++) {
      let item = shareOpen[index];
      if (item.switch) {
        let code = this.getIconType2Code(item.id);
        if (this.isExistCode(code))
          this.shareDatalist.push({
            icon: "Icon_Share_" + code,
            code: code,
          });
      }
    }

    this.sharelist.numItems = this.shareDatalist.length;
    this.sharelist.visible = this.sharelist.numItems > 0;
  }

  /**
   * 渲染奖励列表
   * @param index
   * @param item
   */
  private renderListItem(index: number, item: BaseItem) {
    item.info = this.getGoodsInfo(this._rewardDataArr[index]);
  }

  /**
   * 渲染分享单元格
   * @param index
   * @param item
   */
  private renderShareListItem(index: number, item: fgui.GButton) {
    if (item && !item.isDisposed) {
      let shareItemData = this.shareDatalist[index];
      if (shareItemData) {
        let iconName = shareItemData.icon;
        let iconURL = FUIHelper.getItemURL("Mount", iconName);
        item.icon = iconURL;
        item.data = shareItemData.code;
      }
    }
  }

  private getGoodsInfo(str: string): GoodsInfo {
    let goodsInfo: GoodsInfo = new GoodsInfo();
    goodsInfo.templateId = parseInt(str.split(",")[0]);
    goodsInfo.count = parseInt(str.split(",")[1]);
    return goodsInfo;
  }

  public get playerInfo(): PlayerInfo {
    return PlayerManager.Instance.currentPlayerModel.playerInfo;
  }

  public getIconUrl(): string {
    return IconFactory.getPlayerIcon(
      ArmyManager.Instance.thane.snsInfo.headId,
      IconType.HEAD_ICON,
    );
  }

  private updateAvatar(path: string) {
    if (this._path == path) {
      return;
    }
    this._path = path;
    this._resUrl = this.getUrl(path);
    ResMgr.Instance.loadRes(
      this._resUrl,
      (res) => {
        this.loaderCompleteHandler(res);
      },
      null,
      Laya.Loader.ATLAS,
    );
  }

  private loaderCompleteHandler(res: any) {
    if (!res) {
      return;
    }
    this._preUrl = res.meta.prefix;
    let fPathfPath = `${this._preUrl}${""}${Utils.numFormat(1, 4)}.png`;
    this._mountImgSprite = new Laya.Sprite();
    this._mountImgSprite.autoSize = true;
    this._mountImgSprite.loadImage(fPathfPath);
    this.addChild(this._mountImgSprite);
    let templateId = this._mountData.TemplateId;
    let sourceSize = new Laya.Rectangle();
    sourceSize.width = this._mountImgSprite.width;
    sourceSize.height = this._mountImgSprite.height;
    this._mountImgSprite.pivotX = sourceSize.width >> 1;
    this._mountImgSprite.pivotY = sourceSize.height >> 1;
    this._mountImgSprite.x = this.centerPoint.x;
    this._mountImgSprite.y = this.centerPoint.y;
    if (templateId == 1124) {
      //魔界战犀
      this._mountImgSprite.x -= 50;
      this._mountImgSprite.y -= 80;
    } else if (templateId == 7002 || templateId == 8135) {
      //魔兽影灵,荷鲁斯猎鹰
      this._mountImgSprite.y -= 80;
    } else if (templateId == 8054) {
      //摩羯座
      this._mountImgSprite.x += 30;
      this._mountImgSprite.y -= 40;
    } else if (templateId == 1128 || templateId == 8334) {
      //异域战虎,人马DJ
      this._mountImgSprite.x -= 40;
      this._mountImgSprite.y -= 60;
    } else if (templateId == 1111) {
      //幽冥雪猿
      this._mountImgSprite.y -= 30;
    } else if (templateId == 8093 || templateId == 8201) {
      //荷塘月色, 破坏炸弹
      this._mountImgSprite.x += 40;
      this._mountImgSprite.y -= 40;
    } else if (templateId == 3005) {
      //梦幻蓝
      this._mountImgSprite.x += 50;
      this._mountImgSprite.y -= 40;
    } else if (templateId == 1147) {
      //霜雪豹
      this._mountImgSprite.y -= 40;
    } else if (templateId == 8097 || templateId == 8233) {
      //麟龙, 图腾魔像
      this._mountImgSprite.y -= 80;
    } else if (templateId == 3002) {
      //幽冥魔狼
      this._mountImgSprite.y -= 20;
    } else if (templateId == 8072) {
      //呆萌飞鼠
      this._mountImgSprite.x += 30;
      this._mountImgSprite.y -= 40;
    } else if (templateId == 3080) {
      //圆舞火鸡
      this._mountImgSprite.x += 20;
      this._mountImgSprite.y -= 30;
    } else if (templateId == 8204 || templateId == 8026 || templateId == 8292) {
      //白羽,火箭飞艇, 梦神
      this._mountImgSprite.x += 20;
      this._mountImgSprite.y -= 30;
    } else if (templateId == 1109) {
      //阿狸
      this._mountImgSprite.x += 50;
    } else if (templateId == 3069) {
      //梦幻鹿
      this._mountImgSprite.y -= 120;
    } else if (templateId == 8288 || templateId == 3045) {
      //绿野麋鹿,熔岩火驹
      this._mountImgSprite.y -= 30;
    } else if (templateId == 8324) {
      //夜煞
      this._mountImgSprite.x += 20;
      this._mountImgSprite.y -= 60;
    } else if (templateId == 8284 || templateId == 8053) {
      //噬光兽, 囚牛
      this._mountImgSprite.x += 50;
      this._mountImgSprite.y -= 70;
    } else if (
      templateId == 8146 ||
      templateId == 8073 ||
      templateId == 8389 ||
      templateId == 8214
    ) {
      //朱厌 , 鲨鱼, 机械路霸, 铁元素
      this._mountImgSprite.y -= 40;
    } else if (templateId == 8216) {
      //比蒙,
      this._mountImgSprite.x += 20;
      this._mountImgSprite.y -= 50;
    } else if (templateId == 1130) {
      //炽焰
      this._mountImgSprite.x -= 50;
      this._mountImgSprite.y -= 60;
    } else if (templateId == 8278 || templateId == 8198 || templateId == 8141) {
      //机械黄蜂, 瀑布元素, 黄金蛤蟆
      this._mountImgSprite.y -= 50;
    } else if (templateId == 8317 || templateId == 8235) {
      //幻影龙, 迷你飞船
      this._mountImgSprite.x -= 20;
      this._mountImgSprite.y -= 40;
    } else if (templateId == 8160) {
      //白金刚
      this._mountImgSprite.x -= 190;
      this._mountImgSprite.y -= 220;
    } else if (templateId == 8215) {
      //独轮车
      this._mountImgSprite.x += 30;
      this._mountImgSprite.y -= 100;
    }
  }

  private get wildSoulCollection(): WildSoulCollection {
    return MountsManager.Instance.avatarList;
  }

  private getUrl(path: string): string {
    return (
      PathManager.resourcePath +
      "equip_show" +
      path.toLocaleLowerCase() +
      "/2/2.json"
    );
  }

  private isExistCode(code: number): boolean {
    let config: number[] = [];
    //区分Android iOS
    if (Utils.isAndroid()) {
      //android
      config = PathManager.info.share_android;
    } else if (Utils.isIOS()) {
      //iOS
      config = PathManager.info.share_ios;
    } else if (Utils.isWebWan()) {
      //web
      config = PathManager.info.share_web;
    } else if (Utils.isPC()) {
      config = PathManager.info.share_web;
    }
    if (config.indexOf(code) != -1) {
      return true;
    }
    return false;
  }

  /**
   * @param channelId SHARE_CHANNEL
   * @returns
   */
  private getIconType2Code(channelId: number = 0) {
    let shareCode: number = 0;
    switch (channelId) {
      case SHARE_CHANNEL.FB:
        shareCode = 6;
        break;
      case SHARE_CHANNEL.Twitter:
        shareCode = 18;
        break;
      case SHARE_CHANNEL.Discord:
        shareCode = 24;
        break;
      case SHARE_CHANNEL.Instagram:
        shareCode = 22;
        break;
      case SHARE_CHANNEL.Telegram:
        shareCode = 16;
        break;
      case SHARE_CHANNEL.Whatsapp:
        shareCode = 20;
        break;
      case SHARE_CHANNEL.Youtube:
        shareCode = 14;
        break;
      default:
        break;
    }
    return shareCode;
  }

  dispose() {
    this.removeEvent();
    super.dispose();
  }
}
