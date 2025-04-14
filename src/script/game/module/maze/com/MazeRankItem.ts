import FUI_MazeRankItem from "../../../../../fui/Maze/FUI_MazeRankItem";
import MazeOrderInfo from "../MazeOrderInfo";
export default class MazeRankItem extends FUI_MazeRankItem {
  private _vdata: MazeOrderInfo;
  private _type: number;
  public set vdata(value: MazeOrderInfo) {
    if (!value || this._vdata == value) return;
    this._vdata = value;
    this.Img_first.visible = false;
    this.Img_second.visible = false;
    this.Img_third.visible = false;
    if (this._type == 0) {
      //迷宫
      this.RankValueTxt.text = "";
      if (this._vdata.mazeOrder == 1) {
        this.Img_first.visible = true;
      } else if (this._vdata.mazeOrder == 2) {
        this.Img_second.visible = true;
      } else if (this._vdata.mazeOrder == 3) {
        this.Img_third.visible = true;
      } else {
        this.RankValueTxt.text = this._vdata.mazeOrder.toString();
      }

      this.UserNameTxt.text = this._vdata.nickName;
      this.LayerNumTxt.text = this._vdata.maxFloor.toString();
    } else if (this._type == 1) {
      //深渊迷宫
      this.RankValueTxt.text = "";
      if (this._vdata.mazeOrder == 1) {
        this.Img_first.visible = true;
      } else if (this._vdata.mazeOrder == 2) {
        this.Img_second.visible = true;
      } else if (this._vdata.mazeOrder == 3) {
        this.Img_third.visible = true;
      } else {
        this.RankValueTxt.text = this._vdata.mazeOrder.toString();
      }
      this.UserNameTxt.text = this._vdata.nickName;
      this.LayerNumTxt.text = this._vdata.maxFloor.toString();
    }
  }

  public set type(type: number) {
    this._type = type;
  }
}
