import FUI_RankStarItem from "../../../../../../fui/RoomList/FUI_RankStarItem";
import FUIHelper from "../../../../utils/FUIHelper";

export default class RankStarItem extends FUI_RankStarItem {
  constructor() {
    super();
  }

  protected onConstruct() {
    super.onConstruct();
  }

  setInfo(id: number, mini?: boolean) {
    this.imgIcon.icon = this.getIconBySegment(id, mini);
    this.cStar.selectedIndex = this.getStarBySegment(id);
  }

  /**
   * 获取段位图标
   * @param id 段位
   */
  getIconBySegment(id: number, mini?: boolean) {
    let rank = Math.ceil((id - 1000) / 3);
    if (rank > 6) {
      rank = 6;
    }
    if (rank == 0) {
      rank = 1;
    }
    if (mini) {
      return FUIHelper.getItemURL("RoomHall", "Img_Division0" + rank + "_2");
    }
    return FUIHelper.getItemURL("RoomList", "Img_Division0" + rank);
  }

  /**
   * 获取段位图标
   * @param id 段位
   */
  getStarBySegment(id: number) {
    id -= 1000;
    if (id >= 16) {
      return 0;
    }
    let rank = id % 3;
    if (rank == 0) {
      rank = 3;
    }
    return rank;
  }

  public dispose() {
    super.dispose();
  }
}
