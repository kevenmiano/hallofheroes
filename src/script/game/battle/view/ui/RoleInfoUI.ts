//@ts-expect-error: External dependencies
/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2020-12-22 15:47:13
 * @LastEditTime: 2023-04-26 10:33:19
 * @LastEditors: jeremy.xu
 * @Description: 玩家信息
 */

export enum RoleInfoUIEnum {
  RoleName,
  RoleSeviceName,
  StripUIView,
  BufferContainer,
}

export class RoleInfoUI extends Laya.Sprite {
  addChildWithTag(node: Laya.Sprite, tag: RoleInfoUIEnum): Laya.Sprite {
    switch (tag) {
      case RoleInfoUIEnum.RoleName:
        this.addChild(node);
        node.y = 25;
        break;
      case RoleInfoUIEnum.BufferContainer:
        this.addChild(node);
        node.pos(-65, 0);
        break;
      case RoleInfoUIEnum.StripUIView:
        this.addChild(node);
        node.pos(-node.width / 2, node.height / 2);
        break;
      default:
        break;
    }
    return this;
  }
}
