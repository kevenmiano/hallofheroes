import StringHelper from "../../core/utils/StringHelper";
import Utils from "../../core/utils/Utils";
import { AvatarPosition } from "../avatar/data/AvatarPosition";
import { JobType } from "../constant/JobType";
import { PathInfo } from "../datas/PathInfo";
import { isOversea } from "../module/login/manager/SiteZoneCtrl";
import StringUtils from "../utils/StringUtils";

export class PathManager {
  private static _info: PathInfo;
  public static SITE_MAIN: string = "";

  public static get info(): PathInfo {
    return this._info;
  }

  public static setup(info: PathInfo) {
    this._info = info;
  }

  public static get nickNamePath(): string {
    return this._info.NICK_NAME_PATH;
  }

  public static get forwardSite(): string {
    return this._info.FOWARDSITE;
  }

  public static get forwardName(): string {
    return this._info.FOWARDNAME;
  }

  public static solveResourceClassPath(id: string, type: string): string {
    return "slg.resource.effect." + type + "Asset" + id;
  }

  public static solveHeroAvatarPath(path: string, sex: number): string {
    return (
      this.resourcePath +
      "equip" +
      path.toLocaleLowerCase() +
      "/" +
      sex +
      "/" +
      sex +
      ".json"
    );
  }

  public static solveWingAvatarPath(
    name: string,
    job: number,
    sex: number,
  ): string {
    return (
      this.resourcePath +
      "equip" +
      name.toLocaleLowerCase() +
      "/" +
      job +
      "_" +
      sex +
      "/" +
      job +
      "_" +
      sex +
      ".json"
    );
  }

  public static getDefaultJobBattleAvatar(): string {
    return this.resourcePath + "equip/mystery_default_body/2/2.json";
  }

  public static solveShowPawnAvatarPath(value: number): string {
    return this.resourcePath + "show_pawn/" + value + ".json";
  }
  public static solveShowHeroAvatarPath(
    type: string,
    method: string,
    direction: string,
    path: string,
    sex: number,
  ): string {
    let fileName: string = sex + ".json";
    if (!method)
      return (
        this.resourcePath +
        type.toLocaleLowerCase() +
        path.toLocaleLowerCase() +
        "/" +
        fileName.toLocaleLowerCase()
      );
    //文件名0.swf代表女avatar,文件名1.swf代表男avatar
    else
      return (
        this.resourcePath +
        type.toLocaleLowerCase() +
        path.toLocaleLowerCase() +
        "/" +
        method.toLocaleLowerCase() +
        "/" +
        direction.toLocaleLowerCase() +
        "/" +
        fileName.toLocaleLowerCase()
      ); //文件名0.swf代表女avatar,文件名1.swf代表男avatar
  }
  public static get solveEffectConfig(): string {
    return (
      this.resourcePath +
      "commandEffectConfig.xml" +
      "?v=" +
      new Date().getTime()
    );
  }
  public static solveRoleClassPath(id: string, nameStr: string = ""): string {
    return "slg.resource.movie.MovieAsset" + nameStr + id;
  }

  public static libEffectResourceClassPath(id: string): string {
    return "slg.resource.effect.effect" + id.toLocaleLowerCase();
  }

  /**
   * 代理商脏字符文件地址
   */
  public static get AgentZhanPath(): string {
    return (
      this._info.TEMPLATE_PATH +
      "proxy_dirty.txt" +
      "?v=" +
      new Date().getTime()
    );
  }

  public static solveRolePath(name: string, suff: string = ""): string {
    return (
      this.resourcePath +
      "swf/" +
      name.toLocaleLowerCase() +
      "/" +
      name.toLocaleLowerCase() +
      "/" +
      name.toLocaleLowerCase() +
      ".json"
    );
  }

  public static solveSoundPath(name: string, suff: string = ""): string {
    return this.resourcePath + "sounds/" + name.toLocaleLowerCase() + ".mp3";
  }

  public static solveSkillSoundResPath(
    name: string,
    transition: boolean = false,
    toLowerCase: boolean = false,
  ): string {
    let jsonName = name;
    let folderName = "";
    if (transition) {
      folderName = StringHelper.replaceStr(name, ".", "_");
    }
    if (toLowerCase) {
      folderName = folderName.toLocaleLowerCase();
    }
    // Logger.log("solveSkillResPath", this.resourcePath + "skilleffect/" + folderName + "/" + jsonName + ".json")
    return (
      this.toLowerCase(this.resourcePath + "skilleffect/" + folderName) +
      "/Sound/"
    );
  }

  public static solveSkillResPath(
    name: string,
    transition: boolean = true,
    toLowerCase: boolean = false,
  ): string {
    let jsonName = name;
    let folderName = "";
    if (transition) {
      folderName = StringHelper.replaceStr(name, ".", "_");
      jsonName = StringHelper.replaceStr(name, ".", "_");
    }
    if (toLowerCase) {
      folderName = folderName.toLocaleLowerCase();
    }
    // Logger.log("solveSkillResPath", this.resourcePath + "skilleffect/" + folderName + "/" + jsonName + ".json")
    return this.toLowerCase(
      this.resourcePath +
        "skilleffect/" +
        folderName.toLocaleLowerCase() +
        "/" +
        jsonName.toLocaleLowerCase() +
        ".json",
    );
  }

  public static solveSkillPublicResPath(
    jsonName?: string,
    transition: boolean = true,
  ): string {
    let prefix = "skilleffect/skill_public/";
    if (transition) {
      jsonName = StringHelper.replaceStr(jsonName, ".", "_");
    }
    let url = this.resourcePath + prefix;
    return this.toLowerCase(jsonName ? url + jsonName + ".json" : prefix);
  }

  public static solveResistSheldResPath(
    jsonName?: string,
    transition: boolean = true,
  ): string {
    let prefix = "skilleffect/resist_sheld/";
    if (transition) {
      jsonName = StringHelper.replaceStr(jsonName, ".", "_");
    }
    let url = this.resourcePath + prefix;
    return this.toLowerCase(jsonName ? url + jsonName + ".json" : prefix);
  }

  public static solveSkillNameResPath(name?: string): string {
    let prefix = "skillname/";
    let url = this.resourcePath + prefix;
    return this.toLowerCase(name ? url + name + ".png" : prefix);
  }

  public static solveRoleDefaultPath(
    job: number,
    partStr: string,
    sex: number,
    suff: string = "",
  ): string {
    let jobStr: string;
    switch (job) {
      case JobType.WARRIOR:
        jobStr = "warrior";
        break;
      case JobType.HUNTER:
        jobStr = "hunter";
        break;
      case JobType.WIZARD:
        jobStr = "wizard";
        break;
      default:
        jobStr = "wizard";
    }
    // "res/animation/equip/hunter_default_body/0/0.json"
    return this.toLowerCase(
      this.resourcePath +
        "equip/" +
        jobStr +
        "_default_" +
        partStr +
        suff +
        "/" +
        sex +
        "/" +
        sex +
        ".json",
    );
  }

  public static getBattleMapPath(mapAssetId: number): string {
    let ext = ".jpg";
    // 原生iOS上getRes获取的单张图片, 需要改后缀
    if (Utils.useAstc) {
      ext = ".ktx";
    }
    return (
      this.resourcePath +
      "sceneima/" +
      mapAssetId +
      "/map" +
      mapAssetId +
      "/" +
      mapAssetId +
      ext
    );
  }

  public static getBattleMapAniPath(mapAssetId: number): string {
    return "BattleBgAniMap" + mapAssetId;
  }

  public static getTimeStoryResPath(name: string): string {
    return this.resourcePath + "timestory/" + name;
  }
  public static get resourcePath(): string {
    return "res/animation/";
  }
  public static get CastleServicePath(): string {
    return this._info.CastleServicePath;
  }

  public static get SocktPath(): string {
    return this._info.SocktPath;
  }

  public static get SocketPort(): number {
    return this._info.SocketPort;
  }

  /**转小写 */
  public static toLowerCase(value: string): string {
    return value.toLocaleLowerCase();
  }

  /**转大写 */
  public static toUpperCase(value: string): string {
    return value.toUpperCase();
  }

  public static showHeroEquipPath(): string {
    return this.toLowerCase(this.resourcePath + "equip_show/male.json");
  }
  public static solveEffectPath(id: string, type: string): string {
    return this.toLowerCase(
      this.resourcePath + "swf/" + id + "/" + type + id + ".json",
    );
  }
  public static getOuterCityMapsData(name: number): string {
    let ext = ".dat";
    return this.toLowerCase(
      this.resourcePath + "maps/" + name + "/" + name + ext,
    );
  }
  public static getOuterCityTilesData(name: number): string {
    let ext = ".bin";
    return this.toLowerCase(
      this.resourcePath + "maps/" + name + "/" + name + ext,
    );
  }
  public static getOuterCityNoteData(name: number): string {
    return this.toLowerCase(
      this.resourcePath + "maps/" + name + "/" + name + ".rd",
    );
  }
  public static getOuterCityNotePaths(name: number): string {
    return this.toLowerCase(
      this.resourcePath + "maps/" + name + "/" + name + ".path",
    );
  }
  public static getMapBackPaths(name: string | number): string {
    return this.toLowerCase(
      this.resourcePath + "mapmaterial/land/" + name + "/",
    );
  }
  public static solveMapPhysicsBySonType(sonType: number): string {
    return this.toLowerCase(
      this.resourcePath +
        "mapmaterial/build/" +
        sonType +
        "/" +
        sonType +
        ".json",
    );
  }
  public static solveMapPhysicsBySwf(swf: string, type: number): string {
    return this.toLowerCase(
      this.resourcePath + "mapmaterial/build/" + swf + "/" + type + ".json",
    );
  }
  public static solveCampaignMovieByUrl(url: string): string {
    return this.resourcePath + url;
  }
  // 一些在地图编辑器中的动画路径 不方便改动 使用代码做转换
  public static fixCampaignMovieByUrl(url: string): string {
    let sontype = StringUtils.substrSwfName(url);
    return this.toLowerCase(url.replace(".swf", "/" + sontype + ".json"));
  }
  public static solveHeadPath(id: number): string {
    return this.resourcePath + "images/head/" + id + ".png";
  }
  public static solveSelectCampaignPath(
    chapterID: number,
    areaID?: number,
  ): string {
    if (!areaID) {
      return (
        PathManager.resourcePath +
        "swf/singlecampaign1/" +
        chapterID +
        "/map/" +
        chapterID +
        ".jpg"
      );
    } else {
      return (
        PathManager.resourcePath +
        "swf/singlecampaign1/" +
        chapterID +
        "/" +
        areaID +
        ".jpg"
      );
    }
  }
  public static mapNameMoviePath(mapId: number): string {
    return this.resourcePath + "images/mapname/" + mapId + ".png";
  }
  public static mapInstanceRoomName(id: number): string {
    return this.resourcePath + "images/instanceimg/" + id + "/name.png";
  }
  public static mapInstanceRoomIcon(id: number): string {
    return this.resourcePath + "images/instanceimg/" + id + "/icon.jpg";
  }
  public static mapInstanceSmallIconPath(id: number): string {
    return this.resourcePath + "images/instanceimg/" + id + "/small.png";
  }
  public static mapInstanceNormalIconPath(id: number): string {
    return this.resourcePath + "images/instanceimg/" + id + "/center.jpg";
  }
  public static getClientLoginPath(): string {
    return this._info.CLIENT_LOGIN_PATH;
  }
  public static getClientLoginName(): string {
    return this._info.CLIENT_LOGIN_NAME;
  }
  /**
   * 游戏版本号
   */
  public static getVersion(): string {
    return this._info.VERSION;
  }
  /**
   *表情数量
   */
  public static getFaceNum(): number {
    return this._info.FACE_NUM;
  }
  public static mapInstanceBigIconPath(id: number): string {
    return this.resourcePath + "images/instanceimg/" + id + "/big.jpg";
  }
  public static mapInstanceNamePath(id: number): string {
    return this.resourcePath + "images/instanceimg/" + id + "/name.png";
  }
  public static mapInstanceOpenIcon(id: number): string {
    return this.resourcePath + "images/instanceimg/" + id + "/open.png";
  }
  public static mapInstanceOverIcon(id: number): string {
    return this.resourcePath + "images/instanceimg/" + id + "/over.png";
  }
  public static mapPVProomIconPath(): string {
    return this.resourcePath + "images/PVProom/" + "PVP_1.jpg";
  }
  public static avatarResourcePath(name: string, sex: number): string {
    return (
      this.resourcePath + "swf/avatar" + name + "/" + sex + "/" + sex + ".json"
    );
  }
  public static wingAvatarResourcePath(
    name: string,
    job: number,
    sex: number,
  ): string {
    return (
      this.resourcePath +
      "swf/avatar" +
      name +
      "/" +
      job +
      "_" +
      sex +
      "/" +
      job +
      "_" +
      sex +
      ".json"
    );
  }
  /**
   * @param key 基本情况是avatar资源的名字, 对应具体资源的文件夹名
   * @param sex 性别, 但坐骑为2, npc为0, 男女是01
   * @param positionType 1为普通 2为时装
   * @param position 这个为AVATAR的部位
   * @param job 职业
   * @param avatarType 目前有玩家（1）和NPC（2）
   * @return 组合得出avatar资源的地址
   *
   */
  public static getAvatarResourcePath(
    key: string,
    sex: number,
    positionType: number,
    position: string,
    job: number,
    avatarType: number,
    fileType: string = ".json",
  ): string {
    let url: string = "";
    if (job == 100) return this.resourcePath + key;
    if (positionType == 1) {
      //普通
      if (position == AvatarPosition.MOUNT) {
        //坐骑
        url =
          this.resourcePath + "swf/avatar" + key + "/" + 2 + "/" + 2 + fileType;
      } else if (position == AvatarPosition.WING) {
        //翅膀
        url =
          this.resourcePath +
          "swf/avatar" +
          key +
          "/" +
          job +
          "_" +
          sex +
          "/" +
          job +
          "_" +
          sex +
          fileType;
      } else if (position == AvatarPosition.PET) {
        //英灵
        url =
          this.resourcePath + "swf/avatar" + key + "/" + 2 + "/" + 2 + fileType;
      } else if (avatarType == 1) {
        //玩家
        url =
          this.resourcePath +
          "swf/avatar" +
          key +
          "/" +
          sex +
          "/" +
          sex +
          fileType;
      } else if (avatarType == 2) {
        //NPC
        url = this.resourcePath + "swf/npc/" + key + "/" + key + fileType;
      } else if (avatarType == 3) {
        //紫晶矿车
        if (position == AvatarPosition.BODY) {
          url =
            this.resourcePath +
            "swf/avatar/mineral_body/" +
            key +
            "/" +
            key +
            fileType;
        } else if (position == AvatarPosition.HAIR_UP) {
          url =
            this.resourcePath +
            "swf/avatar/mineral_hair/" +
            key +
            "/" +
            key +
            fileType;
        }
      }
    } else if (positionType == 2) {
      //时装
      url =
        this.resourcePath +
        "swf/avatar" +
        key +
        "/" +
        job +
        "_" +
        sex +
        "/" +
        job +
        "_" +
        sex +
        fileType;
    } else {
      throw new Error("未知的类型");
    }
    return url.toLowerCase();
  }

  public static NpcAvatarResourcePath(name: string): string {
    return this.toLowerCase(this.resourcePath + "swf/npc/" + name + ".json");
  }
  public static avatarStandResourceClassPath(url: string): string {
    return url + "Stand";
  }
  public static avatarWalkResourceClassPath(url: string): string {
    return url + "Walk";
  }
  public static avatarShowResourceClassPath(url: string): string {
    return url + "Show";
  }

  public static get templatePath(): string {
    //			return "tempinfos.xml";
    return (
      this._info.TEMPLATE_PATH + "tempinfos.xml" + "?v=" + new Date().getTime()
    );
  }
  public static get timeStoryPath(): string {
    return (
      this._info.TEMPLATE_PATH + "gametimes.xml" + "?v=" + new Date().getTime()
    );
  }
  public static get versionPath(): string {
    return (
      this._info.TEMPLATE_PATH + "version.xml" + "?v=" + new Date().getTime()
    );
  }

  public static get backAvatarList(): string {
    return (
      this._info.TEMPLATE_PATH + "avata.xml" + "?v=" + new Date().getTime()
    );
  }

  public static get backResourceList(): string {
    return (
      this._info.TEMPLATE_PATH + "resource.xml" + "?v=" + new Date().getTime()
    );
  }

  public static get orderPath(): string {
    return "http://10.10.6.226:8080/web/xml/";
  }

  // unuse
  public static get challengPath(): string {
    return (
      this._info.TEMPLATE_PATH +
      "challengeorder.json" +
      "?v=" +
      new Date().getTime()
    );
  }

  public static get crossOrderPath(): string {
    return (
      this._info.TEMPLATE_PATH +
      "cross/crossscore.json" +
      "?v=" +
      new Date().getTime()
    );
  }

  // unuse
  public static get singlePassOrderPath(): string {
    return (
      this._info.TEMPLATE_PATH +
      "singlepass.json" +
      "?v=" +
      new Date().getTime()
    );
  }

  public static get gemMazeOrderPath(): string {
    return (
      this._info.TEMPLATE_PATH + "gemmaze.json" + "?v=" + new Date().getTime()
    );
  }

  public static getMazeOrderPath(index: number): string {
    if (index == 0)
      return (
        this._info.TEMPLATE_PATH +
        "tower_unzip.xml" +
        "?v=" +
        new Date().getTime()
      );
    else if (index == 1)
      return (
        this._info.TEMPLATE_PATH +
        "tower2_unzip.xml" +
        "?v=" +
        new Date().getTime()
      );
    return "";
  }

  public static getHookStatePath(state: number): string {
    return this.resourcePath + "images/hook/" + state + ".png";
  }

  public static get snsTempPath(): string {
    return (
      this._info.TEMPLATE_PATH + "sns_temp.xml" + "?v=" + new Date().getTime()
    );
  }
  public static get fightStatePath(): string {
    return this.resourcePath + "images/avatar/fight.png";
  }
  public static get warFightBuff(): string {
    return this.resourcePath + "images/buff/war.png";
  }
  public static get gainBuff(): string {
    return this.resourcePath + "images/buff/gain.png";
  }

  public static getCarnivalPath(
    theme: string,
    imgStr: string,
    fileType: string = ".png",
  ): string {
    return (
      this.resourcePath + "images/carnival/" + theme + "/" + imgStr + fileType
    );
  }

  public static getCarnivalFolderPath(
    theme: string,
    folder: string,
    imgStr: string,
    fileType: string = ".png",
  ): string {
    return (
      this.resourcePath +
      "images/carnival/" +
      theme +
      "/" +
      folder +
      "/" +
      imgStr +
      fileType
    );
  }

  public static getMountAvatar(templateId: number): string {
    return "/mount_default";
  }
  public static getGvgBufferIconPath(templateId: number): string {
    return this.resourcePath + "icon/gvgbuffer/" + templateId + ".png";
  }
  public static getDemonBufferIconPath(templateId: number): string {
    return this.resourcePath + "icon/demonbuffer/" + templateId + ".png";
  }
  public static getCardIconPath(iconPath: string): string {
    return this.resourcePath + "icon/powcard" + iconPath + ".png";
  }
  public static getCardSwfPath(swfPath: string): string {
    return this.resourcePath + "icon/powcard" + swfPath + ".json";
  }

  public static getCardSuitPath(iconPath: string): string {
    return this.resourcePath + "icon/suitcard/icon" + iconPath;
  }

  public static getCardSuitNamePath(iconPath: string): string {
    return this.resourcePath + "icon/suitcard/name" + iconPath;
  }

  public static getCardSuitDefaultPath(): string {
    return this.resourcePath + "icon/suitcard/icon/default.jpg";
  }

  /**
   * 客服
   */
  public static get customerPath(): string {
    return this._info.REQUEST_PATH + "complaintshandle";
  }
  public static get customerReplyPath(): string {
    return this._info.REQUEST_PATH + "questionreplaylist";
  }
  public static get customerSubmitEvaluatePath(): string {
    return this._info.REQUEST_PATH + "appraisereplayservlet";
  }
  public static get customerSubmitImagePath(): string {
    return this._info.UPLOAD_PATH + "fileupload/upload";
  }

  public static getVehicleSkillPath(actionId: string): string {
    return (
      this.resourcePath + "vehicle/skill/" + actionId + "/" + actionId + ".json"
    );
  }

  public static getVehicleNPCPath(id: string): string {
    return this.resourcePath + "vehicle/NPC/" + id + "/" + id + ".json";
  }

  public static getVehicleAvatarPath(tempid: string): string {
    return this.resourcePath + "vehicle/avatar/vehicle_" + tempid + "/2.json";
  }

  public static getVehicleShowAvatarPath(key: string): string {
    return this.resourcePath + "equip_show/vehicle_" + key + "/2.png";
  }

  public static getAppellImgPath(templateId: number): string {
    return this.resourcePath + "images/appell/" + templateId + ".png";
  }

  public static getAppellBgPath(templateId: number): string {
    return this.resourcePath + "icon/appell/" + templateId + ".png";
  }

  public static getAppellImgPath2(
    templateId: number,
    index: number = 0,
  ): string {
    return "res/game/common/appell/" + templateId + "_" + index + ".png";
  }

  public static getAppellPath(): string {
    return "res/game/common/appell.json";
  }

  public static getNetSpeedTestPath(): string {
    return Laya.URL.basePath + "imgNetSpeedTest.png";
  }

  /************ pet *****************************************/

  public static getPetFollowPath(key: string): string {
    return this.resourcePath + "swf/avatar" + key + "/2/2.json";
  }
  // 非战斗变身展示
  public static getPetMorphShowPath(key: string): string {
    return this.resourcePath + "equip_show" + key + "/2/2.json";
  }

  public static getPetBattleFollowShowPath(key: string): string {
    return this.resourcePath + "equip" + key + "_follow/2/2.json";
  }
  // 战斗变身展示
  public static getPetBattleMorphShowPath(key: string): string {
    return this.resourcePath + "equip" + key + "/2/2.json";
  }
  public static getFateWalkPath(id: number, fileType: string = ".png"): string {
    return this.resourcePath + "swf/avatar/fatehalo_attack/" + id + fileType;
  }

  public static getFateBattlePath(id: number): string {
    return (
      this.resourcePath + "equip/fatehalo_attack/" + id + "/" + id + ".json"
    );
  }
  /************ pet end*****************************************/

  public static getFishSwfPath(swfPath: string): string {
    return this.resourcePath + "fish" + swfPath + ".json";
    //			return this.resourcePath + "icon/powcard/1.json";
  }

  public static getNpcBtnPath(): string {
    return "res/game/common/npcBtn.json";
  }
  /**战斗回放录像文件  改为存腾讯了 */
  public static getBattleRecordPath(str: string): string {
    return str;
    // return this._info.REQUEST_PATH + "record/" + str;
  }

  public static getSevenBoxPath(str: string): string {
    return this.resourcePath + str;
  }

  public static getTreasureIconPath(iconPath: string): string {
    return this.resourcePath + "icon/" + iconPath + ".png";
  }

  public static getTranslucencePath(job: number, sex: number): string {
    return this.resourcePath + "swf/translucence/translucence/" + "2" + ".json";
  }

  /**二维码 */
  public static get qrcodePath(): string {
    return "res/game/qrcode/qrcode.jpg";
  }

  public static getRemotePetOrderPath(): string {
    return (
      this._info.TEMPLATE_PATH + "remotepet.json" + "?v=" + new Date().getTime()
    );
  }

  /**loading背景图 */
  public static getLoadingBgPath(index: number = 3): string {
    if (isOversea()) {
      return "res/game/loading/os/loading-" + index + ".jpg";
    } else {
      return "res/game/loading/in/loading-" + index + ".jpg";
    }
  }

  //坐骑
  public static getMountPath(avatarPath: string): string {
    return (
      PathManager.resourcePath +
      "equip_show" +
      avatarPath.toLocaleLowerCase() +
      "/2/2.json"
    );
  }

  //坐骑单张图
  public static getSMountPath(avatarPath: string): string {
    return (
      PathManager.resourcePath +
      "equip_show" +
      avatarPath.toLocaleLowerCase() +
      "_s" +
      "/2/2.json"
    );
  }

  // 小地图
  public static getSMapPath(mapId: number): string {
    return "res/game/smap/MapImg" + mapId + ".jpg";
  }

  /**
   * 外城小地图的金矿, 符石碎片矿
   * @param sonType
   * @returns
   */
  public static solveMapPngBySonType(sonType: number): string {
    return this.toLowerCase(
      this.resourcePath +
        "mapmaterial/build/" +
        sonType +
        "/" +
        sonType +
        "_small.png",
    );
  }

  public static getMineItemPngBySonType(sonType: number): string {
    return this.toLowerCase(
      this.resourcePath +
        "mapmaterial/build/" +
        sonType +
        "/" +
        sonType +
        "_mine.png",
    );
  }

  public static getCityPngBySonType(sonType: number): string {
    return this.toLowerCase(
      this.resourcePath +
        "mapmaterial/build/" +
        sonType +
        "/" +
        sonType +
        "_small.png",
    );
  }

  // 内城建筑png、建筑特效json
  public static getCastleBuildResPath(str: string): string {
    return this.toLowerCase(this.resourcePath + "images/" + str);
  }

  /** 单张副本图 复用战斗地图 */
  public static getSingleBgMapPath(sceneId: number): string {
    return this.getBattleMapPath(sceneId);
  }

  /** 秘境选择副本底图 */
  public static getSecretSelectBgPath(imgPath: string): string {
    return this.toLowerCase(
      this.resourcePath + "images/secret/" + imgPath + ".png",
    );
  }
}
