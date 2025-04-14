import { CampaignNode } from "../../../map/space/data/CampaignNode";
import { PhysicInfo } from "../../../map/space/data/PhysicInfo";

/**
 *
 */
export class MonopolyNodeInfo {
  public position: number;
  /**
   * 1 陷阱	<br/>
   * 2 宝箱类型	<br/>
   * 3 随机移动	<br/>
   * 4 镜像战斗	<br/>
   */
  public type: number;
  public templateId: number;
  public x: number;
  public y: number;
  public nodeId: number;
  public campaignNode: CampaignNode;
  public physicInfo: PhysicInfo;

  public MonopolyNodeInfo() {}

  public get sonType(): number {
    var sonType: number = 2268;
    switch (this.templateId) {
      case 9551:
      case 9601:
      case 9651:
      case 9701:
      case 9751:
      case 9801:
        sonType = 2268;
        break;
      case 9552:
      case 9602:
      case 9652:
      case 9702:
      case 9752:
      case 9802:
        sonType = 2269;
        break;
      case 9553:
      case 9603:
      case 9653:
      case 9703:
      case 9753:
      case 9803:
        sonType = 2270;
        break;
      case 9554:
      case 9604:
      case 9654:
      case 9704:
      case 9754:
      case 9804:
        sonType = 2271;
        break;
      case 9555:
      case 9605:
      case 9655:
      case 9705:
      case 9755:
      case 9805:
        sonType = 2409;
        break;
      case 9556:
      case 9606:
      case 9656:
      case 9706:
      case 9756:
      case 9806:
        sonType = 2198;
        break;
    }
    return sonType;
  }
}
