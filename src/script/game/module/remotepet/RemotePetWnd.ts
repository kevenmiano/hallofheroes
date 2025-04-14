//@ts-expect-error: External dependencies
import BaseWindow from "../../../core/ui/Base/BaseWindow";

import { RemotePetOption } from "./Component/RemotePetOption";
import { RemotePetManager } from "../../manager/RemotePetManager";
import { RemotePetModel } from "../../mvc/model/remotepet/RemotePetModel";
import { RemotePetEvent } from "../../../core/event/RemotePetEvent";
import { RemotePetMap } from "./Component/RemotePetMap";
import { RemotePetController } from "./RemotePetController";
import { RemotePetTurnInfo } from "../../mvc/model/remotepet/RemotePetTurnInfo";
import FUIHelper from "../../utils/FUIHelper";
import { RemotePetChapterItem } from "./Component/RemotePetChapterItem";
import { RemotePetChapterFold } from "./Component/RemotePetChapterFold";
import { RemotePetTurnItemInfo } from "../../mvc/model/remotepet/RemotePetTurnItemInfo";
import LangManager from "../../../core/lang/LangManager";
import UIManager from "../../../core/ui/UIManager";
import { EmWindow } from "../../constant/UIDefine";
import Utils from "../../../core/utils/Utils";
import Logger from "../../../core/logger/Logger";
import { ArmyManager } from "../../manager/ArmyManager";
import { PlayerManager } from "../../manager/PlayerManager";
import { PlayerEvent } from "../../constant/event/PlayerEvent";

export class RemotePetWnd extends BaseWindow {
  public mapCom: RemotePetMap;
  public optionCom: RemotePetOption;
  public chaptertTree: fgui.GTree;
  public frame: fgui.GLabel;
  public powerLab: fgui.GTextField;
  public resizeContent = true;
  public setOptimize = true;

  protected setSceneVisibleOpen: boolean = true;

  public OnInitWind() {
    this.addEvent();
    Utils.setDrawCallOptimize(this.chaptertTree);
    this.chaptertTree.displayObject["dyna"] = true;
    Utils.setDrawCallOptimize(this.mapCom);
    Utils.setDrawCallOptimize(this.optionCom);
    RemotePetController.Instance.initTurnsData();
    RemotePetManager.sendRemotePetInfo();
    this.updatePower();
  }

  private addEvent() {
    this.chaptertTree.treeNodeRender = Laya.Handler.create(
      this,
      this.onTreeRenderer,
      null,
      false,
    );
    this.chaptertTree.on(fgui.Events.CLICK_ITEM, this, this.onClickTreeItem);
    this.model.addEventListener(
      RemotePetEvent.COMMIT,
      this.onCommitHandler,
      this,
    );
    PlayerManager.Instance.currentPlayerModel.playerInfo.addEventListener(
      PlayerEvent.WEARY_CHANGE,
      this.updatePower,
      this,
    );
  }

  private removeEvent() {
    this.model.removeEventListener(
      RemotePetEvent.COMMIT,
      this.onCommitHandler,
      this,
    );
    PlayerManager.Instance.currentPlayerModel.playerInfo.removeEventListener(
      PlayerEvent.WEARY_CHANGE,
      this.updatePower,
      this,
    );
  }

  //不知道如何刷新, 每次重建。
  private initTree(curChater: number = 0) {
    let turnList = this.model.turnInfo.remotePetTurnList;
    let treeNode: fairygui.GTreeNode;
    let hasChild = false;
    let foldRes = FUIHelper.getItemURL("RemotePet", "RemotePetChapterFold");
    let itemRes = FUIHelper.getItemURL("RemotePet", "RemotePetChapterItem");
    let topNode: fairygui.GTreeNode;
    let chapterIndex = 1;
    for (let i = 0; i < turnList.length; i++) {
      hasChild = chapterIndex == turnList[i].tempInfo.Type;
      treeNode = new fairygui.GTreeNode(hasChild, hasChild ? foldRes : itemRes);
      if (hasChild) {
        topNode = treeNode;
        topNode.data = LangManager.Instance.GetTranslation(
          "remotepet.chapter" + chapterIndex,
        );

        this.chaptertTree.rootNode.addChild(topNode);
        treeNode = new fairygui.GTreeNode(false, itemRes);
        topNode._cell.enabled = curChater >= chapterIndex;
        chapterIndex++;
      }
      treeNode.data = turnList[i];
      topNode.addChild(treeNode);
    }
  }

  private onTreeRenderer(
    node: fgui.GTreeNode,
    item: RemotePetChapterFold | RemotePetChapterItem,
  ) {
    item.info = node.data;
    if (item instanceof RemotePetChapterItem) {
      let itemInfo = node.data as RemotePetTurnItemInfo;
      let turnInfo = this.model.turnInfo;
      let complate = turnInfo.currTurn > itemInfo.tempInfo.Index;
      let challenging = turnInfo.currTurn == itemInfo.tempInfo.Index;
      item.complate = complate;
      item.fighting = challenging;
    }
  }

  private onCommitHandler() {
    this.mapCom.updateView();
    this.optionCom.updateView();
    let turnInfo = this.model.turnInfo.curTurnItemInfo;
    let curTurn = this.model.turnInfo.currTurn - 1;
    let pageNum = (curTurn / RemotePetTurnInfo.MAX_TURN_NUM) >> 0;
    this.optionCom.setTurnInfo(turnInfo);
    this.mapCom.setTurnInfo(turnInfo);
    this.chaptertTree.rootNode.removeChildren();
    this.initTree(pageNum + 1);
    let topNode = this.chaptertTree.rootNode.getChildAt(pageNum);
    this.chaptertTree.collapseAll();
    if (topNode) {
      let selectedIndex = curTurn % RemotePetTurnInfo.MAX_TURN_NUM;
      // this.chaptertTree.expandAll(topNode);
      let selectNode = topNode.getChildAt(selectedIndex);
      selectNode && this.chaptertTree.selectNode(selectNode);
      this.chaptertTree.scrollToView(selectedIndex);
    }
  }

  private onClickTreeItem(itemObject: fgui.GObject) {
    let treeNode: fgui.GTreeNode = itemObject.treeNode;
    if (treeNode.isFolder) {
      let expanded = treeNode.expanded;
      this.chaptertTree.collapseAll();
      expanded && this.chaptertTree.expandAll(treeNode);
      return;
    }
    let turnInfo = treeNode.data as RemotePetTurnItemInfo;
    this.optionCom.setTurnInfo(turnInfo);
    this.mapCom.setTurnInfo(turnInfo);
  }

  private helpBtnClick() {
    // let title = LangManager.Instance.GetTranslation("public.help");
    // let content = LangManager.Instance.GetTranslation("remotepet.help");
    // UIManager.Instance.ShowWind(EmWindow.Help, { title: title, content: content });
  }

  private updatePower() {
    let text = "0/200";
    if (ArmyManager.Instance.army) {
      text =
        PlayerManager.Instance.currentPlayerModel.playerInfo.weary + "/200";
    }
    this.powerLab.setVar("cost", text).flushVars();
  }

  public OnHideWind(): void {
    this.removeEvent();
    super.OnHideWind();
  }

  public get model(): RemotePetModel {
    return RemotePetManager.Instance.model;
  }

  onDestroy(): void {
    this.removeEvent();
  }
}
