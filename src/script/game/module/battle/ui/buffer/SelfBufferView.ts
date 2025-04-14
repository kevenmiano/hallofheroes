/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-01-05 17:51:20
 * @LastEditTime: 2024-01-03 18:38:58
 * @LastEditors: jeremy.xus
 * @Description: 玩家自己的buffer列表视图
 */

import { BattleManager } from "../../../../battle/BattleManager";
import { BufferDamageData } from "../../../../battle/data/BufferDamageData";
import { HeroRoleInfo } from "../../../../battle/data/objects/HeroRoleInfo";
import BuffItemCell from "../../../../battle/view/buffer/BuffItemCell";
import { RoleEvent } from "../../../../constant/event/NotificationEvent";
import BattleWnd from "../../BattleWnd";

export class SelfBufferView {
  private _buffDatas: BufferDamageData[] = [];

  private comSelfBuff: fgui.GComponent;
  // private cDeBuffPos: fgui.Controller;

  private bufferItemCells: BuffItemCell[] = [];

  protected view: BattleWnd;

  constructor(view: BattleWnd) {
    this.view = view;
    this.comSelfBuff = this.view["comSelfBuff"];
    this.initEvent();
  }

  private initEvent() {
    this.roleInfo.addEventListener(
      RoleEvent.REFRESH_BUFFER,
      this.updateBufferData,
      this,
    );
    this.roleInfo.addEventListener(
      RoleEvent.REFRESH_BUFFER_TURN,
      this.refreshBufferViewTurn,
      this,
    );
  }

  private removeEvent() {
    this.roleInfo.removeEventListener(
      RoleEvent.REFRESH_BUFFER,
      this.updateBufferData,
      this,
    );
    this.roleInfo.removeEventListener(
      RoleEvent.REFRESH_BUFFER_TURN,
      this.refreshBufferViewTurn,
      this,
    );
  }

  /**
   * 没有ICON的buff不展示, 只显示增益减益buff
   * @param data
   */
  private updateBufferData(data: BufferDamageData[]) {
    let needIconBuffers: BufferDamageData[] = [];
    data.forEach((buffer: BufferDamageData) => {
      if (
        buffer.currentTurn > 0 &&
        buffer.Icon &&
        (buffer.AttackData == 1 || buffer.AttackData == 2)
      ) {
        needIconBuffers.push(buffer);
      }
    });
    this._buffDatas = needIconBuffers.reverse();
    this.refreshBufferView();
  }

  private refreshBufferView() {
    this.removeAllBuffer();
    let itemView: BuffItemCell;
    let index = 1;
    let startX = 0;
    let startY = 0;
    let offsetX = 2;
    let offsetY = 4;
    for (let itemData of this._buffDatas) {
      if (!itemData) continue;
      itemView = BuffItemCell.createInstance() as BuffItemCell;
      itemView.cellData = itemData;
      itemView.x = startX;
      itemView.y = startY;
      this.comSelfBuff.addChild(itemView);
      startX = itemView.x + itemView.width + offsetX;
      index++;
      //换行
      if (index % 8 == 0) {
        startX = 0;
        startY = itemView.y - itemView.height - offsetY;
      }
    }

    this.comSelfBuff.ensureSizeCorrect();
  }

  private refreshBufferViewTurn() {
    for (let item of this.bufferItemCells) {
      item.refreshTurn();
    }
  }

  private removeAllBuffer() {
    this.comSelfBuff.removeChildren();
    this.bufferItemCells = [];
  }

  private get roleInfo(): HeroRoleInfo {
    return BattleManager.Instance.battleModel.selfHero;
  }

  public dispose() {
    this.removeEvent();
    this.removeAllBuffer();
  }
}
