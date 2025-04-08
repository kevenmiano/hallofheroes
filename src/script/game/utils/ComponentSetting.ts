import { getdefaultLangageCfg } from "../../core/lang/LanguageDefine";
import Logger from "../../core/logger/Logger";
import ByteArray from "../../core/net/ByteArray";
import Dictionary from "../../core/utils/Dictionary";
import Utils from "../../core/utils/Utils";
import { DisplayObjectContainer } from "../component/DisplayObject";
import { SITE_MODE } from "../module/login/model/ServerListData";
import DisplayLoader from "./DisplayLoader";
import StringUtils from "./StringUtils";

/**
 * @author:pzlricky
 * @data: 2020-11-26 11:13
 * @description ***
 */
export default class ComponentSetting {
  private static _APP_VERSION: number = 0; //本地Version
  private static _APP_REMOTE_VERSION: number = 0; //远程AppVersion
  private static _APP_DOWN_LOADURL: string = ""; //APP下载路径

  /**
   * 按钮按住时开始 发出change的时间
   */
  public static BUTTON_PRESS_START_TIME: number = 500;
  /**
   *  按钮按住时每次发出change的时间间隔
   */
  public static BUTTON_PRESS_STEP_TIME: number = 100;
  /**
   * Combox执行隐藏缓动动画的缓动函数
   */
  // public static COMBOBOX_HIDE_EASE_FUNCTION: Function = Sine.easeIn;
  /**
   * Combox执行隐藏缓动动画的时间
   */
  public static COMBOBOX_HIDE_TIME: number = 0;
  /**
   * Combox执行展示缓动动画的缓动函数
   */
  // public static COMBOBOX_SHOW_EASE_FUNCTION: Function = Sine.easeInOut;
  /**
   * Combox执行展示缓动动画的时间
   */
  public static COMBOBOX_SHOW_TIME: number = 0.5;
  /**
   * bitmapData配置在XML中的标签名称
   */
  public static BITMAPDATA_TAG_NAME: string = "bitmapData";
  /**
   * bitmap配置在XML中的标签名称
   */
  public static BITMAP_TAG_NAME: string = "bitmap";
  /**
   *  简单Alert的默认名称
   */
  public static SIMPLE_ALERT_STYLE: string = "SimpleAlert";
  /**
   * 功能提示框
   */
  public static FUNCTION_ALERT_STLE: string = "FunctionAlert";
  /** 使用绑定钻石提示框 */
  public static USEBINDPOINT_ALERT_STYLE: string = "UseBindPointAlertStyle";

  public static CHATINVIE_ALERT_STYLE: string = "ChatInvieAlertStyle";
  /**
   * SimpleBitmapButton的filterString
   */
  public static SIMPLE_BITMAP_BUTTON_FILTER: string =
    "null,lightFilter,null,grayFilter";
  /**
   *确定和取消按钮的间距
   */
  public static ALERT_BUTTON_GAPE: number = 30;
  /**
   * 是否使用3d加速
   */
  public static useStage3D: boolean;

  /**
   * 是否合并配置表
   */
  public static configZip: boolean = false;

  public static COMBOX_LIST_LAYER: DisplayObjectContainer;

  public static SCROLL_UINT_INCREMENT: number = 1;
  public static SCROLL_BLOCK_INCREMENT: number = 20;
  public static DISPLACEMENT_OFFSET: number = 1;
  public static LANGUAGE: string = "zh_cn";
  public static REQUEST_PATH: string;
  public static TEMPLATE_PATH: string = "http://10.10.4.164:80/web/";
  //todo  勿赋值 已经替换成  Laya.URL.basePath
  public static RESOURCE_PATH: string = ""; //
  //资源路径存放至一起,方便资源存放远程服务器时候,其他资源地址路径加上远程路径
  public static RES_HOME: string = "res/"; //RES根目录资源配置路径

  private static _SOUND_PREFIX: string = "res/animation/sounds/"; //音效配置路径
  public static RES_ANIMATION: string = "res/animation/";

  public static BACKUP_RESOURCE_PATH: string;

  public static ISFROMHTTPS: boolean = false;
  public static IS_BACK_FROM_REGISTER: boolean = false;

  public static ResloveConfigXMLPathCall: Function = null;
  public static ResloveConfigZipPathCall: Function = null;
  public static ResloveConfigUISourcePathCall: Function = null;

  public static ALPHA_LAYER_FILTER: string = "alphaLayerGilter";
  public static MD5_FILE_NAME: string = "resouececheck.sq";
  public static CORE_MODULE_NAME: string = "core.xml";
  public static SITE: string;
  public static LOGIN_RND: number = 0; //登陆随机数

  public static VERTION_PATH: string = ""; //更新公告地址
  public static MD5_OBJECT: Array<string> = [];
  public static CASTEL_BACKUP_PIC_PATH: string = "res/game/castle/bg.jpg"; //内城底图
  public static CAMPAIGN_MASK_PIC: string = "res/game/campaign/mask.png"; //副本地图迷雾图片资源
  public static CASTEL_BUILD_LEVELBG_PATH1: string =
    "res/game/castle/level1.png"; //内城建筑等级底图1
  public static CASTEL_BUILD_LEVELBG_PATH2: string =
    "res/game/castle/level2.png"; //内城建筑等级底图2拉伸的
  public static CASTEL_BUILD_MARKET_HALO: string =
    "res/game/castle/market_halo.png"; //市场光圈
  public static CASTEL_BUILD_MARKET_CASH: string =
    "res/game/castle/market_cash.png"; //市场金币
  /**
   * 所有资源文件的md5列表, 有配置文件md5.xml得到
   */
  public static md5Dic: Dictionary = new Dictionary();
  /**
   * 所有UI资源和代码文件的md5文件列表, 这些资源都是需要进行md5验证,
   * 并且在资源文件中包含md5信息
   */
  public static checkMD5: Dictionary = new Dictionary();

  //版本分割开关
  //公会战
  public static CONSORTIA_GVG: boolean = true;

  //跨服战场
  public static RVR_CROSS: boolean = true;

  //众神之战
  public static WARLORD: boolean = true;

  //藏宝图
  public static TREASURE_MAP: boolean = false;

  //战斗守护
  public static BATTLE_GUARD: boolean = true;

  //龙纹
  public static TATTOO: boolean = true;

  //天穹之径
  public static SINGLE_PASS: boolean = true;

  //英灵神格
  public static PET_REFING: boolean = true;

  //英灵转换
  public static PET_EXCHANGE: boolean = true;

  //英灵阵型
  public static PET_FORMATION: boolean = true;

  //英灵(中等)
  public static PET: boolean = true;

  //深渊迷宫
  public static ABYSS_MAZE: boolean = true;

  //天赋系统
  public static GENIUS: boolean = false;

  //符孔系统
  public static RUNE_HOLE: boolean = true;

  //单人本（60级及以上）
  public static CAMPAIGN_SINGLE_60: boolean = true;
  //多人本（60级及以上）
  public static CAMPAIGN_PVE_60: boolean = true;
  //多人本（元素森林 普通/噩梦/地狱）
  public static CAMPAIGN_PVE_YUANSU: number = 3;
  //多人本 王者之塔（简单/普通/困难/噩梦）
  public static CAMPAIGN_PVE_KINGTOWER: number = 4; //1-4

  //人物等级（60级及以上）英灵升级到59级
  public static PET_GRADE: boolean = true;

  //时装合成(现在商城不投放幸运符道具, 幸运符不足直接黄字提示)
  public static FASHION_COMPOSE: boolean = true;

  //星运背包
  public static STAR_BAG: boolean = true;

  //龙魂
  public static DRAG_SOUL: boolean = true;

  //铁匠铺物品tips道具锁
  public static PROP_LOCK: boolean = false;

  //铁匠铺合成页签 水晶页签
  public static FORGE_SJ: boolean = false;

  //是否为Ios版本
  public static IOS_VERSION: boolean = false;

  public static VERSION_COMPARE: boolean = false;

  //抢红包活动
  public static GOLDEN_SHEEP: boolean = true;
  public static VERSION_DOWNS: string[] = [];

  //装备神铸
  public static SHEN_ZHOU: boolean = true;

  //英灵远征
  public static PET_REMOTE: boolean = true;

  //英灵竞技
  public static PET_CHALLENGE: boolean = true;

  //英灵战役
  public static PET_CAMPAIGN: boolean = true;

  //纹章圣物
  public static WENZHANG_SHENGWU: boolean = true;

  //泰坦之战
  public static MULTILORD: boolean = false;

  public static APP_DOWN_URL: string = "";

  /**
   * 命运守护开关
   */
  public static FortuneGuard: boolean = true;

  //英灵炼化开放第几阶的
  public static PetRefiningMaxStage: number = 2;

  /** 组队人数*/
  public static TEAM_NUM: number = 3;

  /**商城许愿池开关 */
  public static SHOP_TAB_HOPE: boolean = true;

  public static setLocalVerion(version: number) {
    this._APP_VERSION = version;
  }

  public static setRemoteVerion(version: number) {
    this._APP_REMOTE_VERSION = version;
  }

  public static setRemoteDownloadURL(url: string) {
    this._APP_DOWN_LOADURL = url;
  }

  public static get localVerion(): number {
    return this._APP_VERSION;
  }

  public static get remoteVerion(): number {
    return this._APP_REMOTE_VERSION;
  }

  public static get appDownloadURL(): string {
    return this._APP_DOWN_LOADURL;
  }

  public static get configZipUrl(): string {
    return this.RESOURCE_PATH + "res/" + String(this.versionType) + "/"; //configzip配置路径
  }

  /**
   * 对应模块的压缩配置文件地址
   * @return
   *
   */
  public static getUIConfigZIPPath(): string {
    if (ComponentSetting.ResloveConfigZipPathCall == null) {
      if (!DisplayLoader.isDebug) {
        return (
          ComponentSetting.RESOURCE_PATH +
          "ui/" +
          ComponentSetting.LANGUAGE +
          "/xml/xml.png"
        );
      }
      return "ui/" + ComponentSetting.LANGUAGE + "/xml/xml.png";
    } else {
      return ComponentSetting.ResloveConfigZipPathCall();
    }
  }

  /**
   * 对应Sound目录下音效
   */
  public static get SOUND_PREFIX(): string {
    return this.RESOURCE_PATH + this._SOUND_PREFIX;
  }

  /**
   * 当前版本, 默认release
   */
  public static get versionType(): string {
    let versionType = window.localStorage.getItem("versionType");
    if (!versionType) {
      versionType = SITE_MODE.RELEASE;
    }
    return versionType;
  }

  //Font路径
  public static get FONT_PREFIX(): string {
    return this.RESOURCE_PATH + "res/font/"; //font资源配置路径
  }

  //UI路径
  public static get UI_PREFIX(): string {
    let langCfg = getdefaultLangageCfg();
    return this.RESOURCE_PATH + "res/" + String(this.versionType) + "/UI/"; //UI资源配置路径
  }

  //配置表路径
  public static get CONFIG_PREFIX(): string {
    return this.RESOURCE_PATH + "res/" + String(this.versionType) + "/config/"; //配置表配置路径
  }

  //xml配置表路径
  public static get XML_PREFIX(): string {
    return "res/" + String(this.versionType) + "/xml/"; //配置表配置路径
  }

  /**
   * 对应模块的资源地址
   * @param soundPathName
   * @return
   *
   */
  public static getSoundSourcePath(soundPathName: string): string {
    return (
      ComponentSetting._SOUND_PREFIX +
      soundPathName.toLocaleLowerCase() +
      ".wav"
    );
  }

  public static getSkillSoundSourcePath(soundPathName: string): string {
    return (
      ComponentSetting._SOUND_PREFIX +
      "skilleffect/" +
      soundPathName.toLocaleLowerCase() +
      ".wav"
    );
  }

  /**
   * 对应模块的资源地址
   * @param musicPathName
   * @return
   *
   */
  public static getSoundMusicPath(musicPathName: string): string {
    return (
      ComponentSetting._SOUND_PREFIX +
      musicPathName.toLocaleLowerCase() +
      ".mp3"
    );
  }

  /**
   * 对应模块的资源地址
   * @param module
   * @return
   *
   */
  public static getUISourcePath(module: string): string {
    return ComponentSetting.UI_PREFIX + module;
  }

  /**
   * 语言包文件地址
   */
  public static get LanguagePath(): string {
    if (DisplayLoader.isDebug)
      return "res/config/" + ComponentSetting.LANGUAGE + "/" + "language.json";
    else
      return (
        ComponentSetting.RESOURCE_PATH +
        "res/config/" +
        ComponentSetting.LANGUAGE +
        "/" +
        "language.json"
      );
  }
  /**
   * 脏字符文件地址
   */
  public static get ZhanPath(): string {
    if (Utils.isWxMiniGame() && ComponentSetting.IOS_VERSION) {
      return this.RESOURCE_PATH + this.XML_PREFIX + "zip_dirty.txt";
    } else {
      return (
        ComponentSetting.TEMPLATE_PATH +
        "zip_dirty.txt" +
        "?v=" +
        new Date().getTime()
      );
    }
    return "";
  }
  /**
   * 代理商脏字符文件地址
   */
  public static get AgentZhanPath(): string {
    if (Utils.isWxMiniGame() && ComponentSetting.IOS_VERSION) {
      return this.RESOURCE_PATH + this.XML_PREFIX + "proxy_dirty.txt";
    } else {
      return (
        ComponentSetting.TEMPLATE_PATH +
        "proxy_dirty.txt" +
        "?v=" +
        new Date().getTime()
      );
    }
    return "";
  }
  /**
   * 模板文件地址
   */
  public static get templatePath(): string {
    return (
      ComponentSetting.TEMPLATE_PATH +
      "tempinfos.xml" +
      "?v=" +
      new Date().getTime()
    );
  }

  /**
   * 名字库
   */
  public static get NamesLibPath(): string {
    return this.XML_PREFIX + "nameslib.txt";
  }

  /**
   * 新手配置文件地址
   */
  public static get newbieConfigPath(): string {
    return this.XML_PREFIX + "newbie.xml";
    // if (DisplayLoader.isDebug) {
    //     return "ui/" + ComponentSetting.LANGUAGE + "/" + "newbie.xml";
    // }
    // else {
    //     return ComponentSetting.RESOURCE_PATH + "ui/" + ComponentSetting.LANGUAGE + "/" + "newbie.xml";
    // }
  }
  /**获取UI语言包**/
  public static getUILanguage(langName: string) {
    return (
      this.RESOURCE_PATH + this.XML_PREFIX + "language/" + langName + ".xml"
    );
  }

  /**
   * 新指引文件地址
   */
  public static get newGuildHelpPath(): string {
    if (DisplayLoader.isDebug) {
      return "ui/" + ComponentSetting.LANGUAGE + "/" + "newguildhelp.xml";
    } else {
      return (
        ComponentSetting.RESOURCE_PATH +
        "ui/" +
        ComponentSetting.LANGUAGE +
        "/" +
        "newguildhelp.xml"
      );
    }
  }
  /**
   * 对应模块的代码文件
   */
  public static getProjectSourcePath(project: string): string {
    if (!DisplayLoader.isDebug) {
      return ComponentSetting.RESOURCE_PATH + project;
    }
    return project;
  }

  public static getOuterCityMapsData(name: number): string {
    let ext = ".dat";
    return ComponentSetting.RESOURCE_PATH + "maps/" + name + "/" + name + ext;
  }

  public static getOuterCityTilesData(name: number): string {
    let ext = ".bin";
    return ComponentSetting.RESOURCE_PATH + "maps/" + name + "/" + name + ext;
  }

  public static mapNameMoviePath(mapId: number): string {
    return ComponentSetting.RESOURCE_PATH + "images/mapName/" + mapId + ".png";
  }

  public static getBattleMapPath(mapAssetId: number): string {
    return (
      ComponentSetting.RESOURCE_PATH +
      "sceneima/" +
      mapAssetId +
      "/map" +
      mapAssetId +
      ".swf"
    );
  }

  public static storyMoviePathCall: Function;
  public static getStoryMoviePath(): string {
    if (ComponentSetting.storyMoviePathCall != null) {
      return ComponentSetting.storyMoviePathCall();
    }
    return "";
  }

  /**
   * 返回指定url加载的文件的md5信息
   * @param url
   * @return
   *
   */
  public static getUrlMd5(url: string): string {
    let filePath: string = ComponentSetting.getMD5FilePathByUrl(url);
    if (!StringUtils.isEmpty(filePath)) {
      let v: string = ComponentSetting.md5Dic[filePath];
      if (v == null) v = "7road";
      return v;
    } else return "";
  }

  public static checkNeedAnalyzeMd5(md5: string): boolean {
    return ComponentSetting.MD5_OBJECT.indexOf(md5) >= 0;
  }
  /**
   * 从文件路劲中返回文件名: 如从ui/zh_cn/swf/xx.swf中返回xx.swf ;
   * @param path
   * @return
   *
   */
  public static getMD5FileNameByFilePath(path: string): string {
    path = ComponentSetting.getMD5FilePathByUrl(path);
    let fileName: string;
    if (path.indexOf("/") >= 0) {
      fileName = path.substr(path.lastIndexOf("/") + 1, path.length);
    } else {
      fileName = path;
    }
    return fileName;
  }
  /**
   * 去掉加载路径中？后面的参数
   * @param path
   * @return
   *
   */
  public static getMD5FilePathByUrl(path: string): string {
    if (path.indexOf("?") >= 0) {
      path = path.substring(0, path.indexOf("?"));
    }
    return path.toLowerCase();
  }
  /**
   * 对比md5码是否匹配
   * @param temp
   * @param fileName
   * @return
   *
   */
  public static compareMD5(temp: ByteArray, md5: string): boolean {
    let md5Bytes: ByteArray = new ByteArray();
    md5Bytes.writeUTFBytes(md5);

    md5Bytes.position = 0;
    temp.position = 5;
    while (md5Bytes.bytesAvailable > 0) {
      let source: number = md5Bytes.readByte();
      let target: number = temp.readByte();
      if (source != target) {
        Logger.error("文件解码失败");
        return false;
      }
    }
    return true;
  }

  public static setColor(frame: number): string {
    let colorArray: Array<string> = [
      "#00d8ff",
      "#ffffff",
      "#bae800",
      "#fff600",
      "#ff0004",
      "#4dbbee",
      "#ff0b2d",
      "#64cc27",
      "#ffffff",
    ];
    return colorArray[frame - 1];
  }

  public static setFarmItemColor(frame: number): string {
    let colorArray: Array<string> = [
      "#ffffff",
      "#59cd41",
      "#32a2f8",
      "#a838f7",
      "#eb9504",
      "#ce0f0f",
    ];
    return colorArray[frame - 1];
  }
}
