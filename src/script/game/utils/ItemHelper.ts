import ItemInfoMsg = com.road.yishi.proto.item.ItemInfoMsg;
//@ts-expect-error: External dependencies
import SimpleItemInfoMsg = com.road.yishi.proto.simple.SimpleItemInfoMsg;
//@ts-expect-error: External dependencies
import ChatItemInfoMsg = com.road.yishi.proto.chat.ChatItemInfoMsg;
import { GoodsInfo } from "../datas/goods/GoodsInfo";
import { DateFormatter } from "../../core/utils/DateFormatter";

export class ItemHelper {
  constructor() {}

  public static readGoodsInfo(msg: ItemInfoMsg, goods: GoodsInfo): GoodsInfo {
    if (!msg) {
      return goods;
    }
    goods.userId = msg.userId;
    goods.id = msg.id;
    goods.templateId = msg.templateId;
    goods.pos = msg.pos;
    goods.isExist = msg.exist;
    goods.objectId = msg.objectId;
    goods.bagType = msg.bagType;
    goods.isBinds = msg.bind;
    goods.isUsed = msg.used;
    goods.validDate = msg.validDate;
    goods.beginDate = DateFormatter.parse(msg.beginDate, "YYYY-MM-DD hh:mm:ss");
    goods.count = msg.count;
    goods.strengthenGrade = msg.strengthenGrade;
    goods["attack"] = msg.attack;
    goods["defence"] = msg.defence;
    goods["agility"] = msg.agility;
    goods["intellect"] = msg.ability;
    goods["captain"] = msg.captain;
    goods.join1 = msg.join_1;
    goods.join2 = msg.join_2;
    goods.join3 = msg.join_3;
    goods.join4 = msg.join_4;
    goods.randomSkill1 = msg.randomSkill_1;
    goods.randomSkill2 = msg.randomSkill_2;
    goods.randomSkill3 = msg.randomSkill_3;
    goods.randomSkill4 = msg.randomSkill_4;
    goods.randomSkill5 = msg.randomSkill_5;
    goods.isNew = msg.isNew;
    goods.property1 = msg.property1;
    goods.appraisal_skill = msg.appraisalSkill;
    goods.isLock = msg.isLocked;
    goods.gp = msg.gp;
    goods.star = msg.star;
    goods.masterAttr = msg.masterAttr;
    goods.sonAttr = msg.sonAttr;
    goods.suitId = msg.suitId;
    goods.mouldGrade = msg.mouldGrade;
    goods.blessValue = msg.blessValue;
    return goods;
  }

  public static readGoodsInfo2(
    itemMsg: SimpleItemInfoMsg,
    goods: GoodsInfo,
  ): GoodsInfo {
    if (!itemMsg) {
      return goods;
    }
    goods.id = itemMsg.id;
    goods.userId = itemMsg.userId;
    goods.bagType = itemMsg.bagType;
    goods.objectId = itemMsg.objectId;
    goods.pos = itemMsg.pos;
    goods.templateId = itemMsg.templateId;
    goods.isBinds = itemMsg.bind;
    goods.count = itemMsg.count;
    goods.strengthenGrade = itemMsg.strengthenGrade;
    goods.join1 = itemMsg.join_1;
    goods.join2 = itemMsg.join_2;
    goods.join3 = itemMsg.join_3;
    goods.join4 = itemMsg.join_4;
    goods.randomSkill1 = itemMsg.randomSkill_1;
    goods.randomSkill2 = itemMsg.randomSkill_2;
    goods.randomSkill3 = itemMsg.randomSkill_3;
    goods.randomSkill4 = itemMsg.randomSkill_4;
    goods.randomSkill5 = itemMsg.randomSkill_5;
    goods.property1 = itemMsg.property1;
    goods.appraisal_skill = itemMsg.appraisalSkill;
    goods.isLock = itemMsg.isLocked;
    return goods;
  }

  public static createChatItemInfoMsg(
    goods: GoodsInfo,
    name: string,
  ): ChatItemInfoMsg {
    var itemMsg: ChatItemInfoMsg = new ChatItemInfoMsg();
    itemMsg.id = goods.id;
    itemMsg.templateId = goods.templateId;
    itemMsg.itemName = name;
    itemMsg.strengthenGrade = goods.strengthenGrade;
    itemMsg.bind = goods.isBinds;
    itemMsg.join_1 = goods.join1;
    itemMsg.join_2 = goods.join2;
    itemMsg.join_3 = goods.join3;
    itemMsg.join_4 = goods.join4;
    itemMsg.randomSkill_1 = goods.randomSkill1;
    itemMsg.randomSkill_2 = goods.randomSkill2;
    itemMsg.randomSkill_3 = goods.randomSkill3;
    itemMsg.randomSkill_4 = goods.randomSkill4;
    itemMsg.randomSkill_5 = goods.randomSkill5;
    itemMsg.property1 = goods.property1;
    itemMsg.appraisalSkill = goods.appraisal_skill;
    return itemMsg;
  }
}
