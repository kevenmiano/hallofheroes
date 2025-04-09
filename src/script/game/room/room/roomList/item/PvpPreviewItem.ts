import FUI_PvpPreviewItem from "../../../../../../fui/RoomList/FUI_PvpPreviewItem";
import LangManager from "../../../../../core/lang/LangManager";
import { JobType } from "../../../../constant/JobType";
import { GoodsInfo } from "../../../../datas/goods/GoodsInfo";

import HeroMsg = com.road.yishi.proto.battle.HeroMsg;
import { getdefaultLangageCfg } from "../../../../../core/lang/LanguageDefine";

export default class PvpPreviewItem extends FUI_PvpPreviewItem {
  goodsArr: GoodsInfo[];
  constructor() {
    super();
  }

  protected onConstruct() {
    super.onConstruct();
  }

  setInfo(info: HeroMsg, index: number) {
    //@ts-ignore
    this.rankStarItem.setInfo(info.segmentId);
    this.cPos.selectedIndex = index < 3 ? 0 : 1;
    this.imgIcon.icon = JobType.getJobIcon(info.job);
    // this.txtName.text =  LangManager.Instance.GetTranslation("sort.serverName", String(info.baseHero.serverId)) + '-' + info.baseHero.nickName;
    let multi = info.multiLanNickName;
    let count = multi.length;
    let lanCfg = getdefaultLangageCfg();
    let lanIndex = lanCfg.index;
    let nickName = info.serverName;
    for (let index = 0; index < count; index++) {
      let element = multi[index];
      if (lanIndex == element.lan) {
        nickName = element.param.toString();
        break;
      }
    }
    let nameStr = nickName;
    if (info.serverName) {
      nameStr = info.serverName + "-" + nameStr;
    }
    this.txtName.text = nameStr;
    this.txtPower.text = LangManager.Instance.GetTranslation(
      "public.playerInfo.ap"
    );
    this.txtValue.text = info.fightCapacity + "";
  }

  public dispose() {
    super.dispose();
  }
}
