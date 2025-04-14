import FUI_MessageCellInfo from "../../../../fui/Base/FUI_MessageCellInfo";

/**
 * @author:pzlricky
 * @data: 2021-05-13 11:12
 * @description 每行消息单元格
 */
export default class MessageInfoCell extends FUI_MessageCellInfo {
  private _cellData: any;
  private _emojiUrl: string = "";
  private _msgcontent: string = "";

  public channel: number = 0;
  public userId: number = 0;
  public nickName: string = ""; //发送者昵称
  public serverName: string = "";
  public consortiaId: number = 0;
  public vipGrade: number = 0;
  public userType: number = 0;
  public type: number = 0;
  public contenttext: string = "";
  public faceLink: string = "";
  public receiverName: string = ""; //接收者昵称

  onConstruct() {
    super.onConstruct();
    this.hasEmoji.selectedIndex = 0; //默认不显示
    this.hasContent.selectedIndex = 0; //默认不显示
  }
}
