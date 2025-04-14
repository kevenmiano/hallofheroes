/*
 * @Author: jeremy.xu
 * @Date: 2022-11-07 14:46:31
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2022-11-15 10:27:54
 * @Description:
 */

import { ClollectActionEvent } from "../constant/event/NotificationEvent";
import { CampaignManager } from "../manager/CampaignManager";
import { NotificationManager } from "../manager/NotificationManager";
import { SceneManager } from "../map/scene/SceneManager";
import SceneType from "../map/scene/SceneType";
import SpaceManager from "../map/space/SpaceManager";

export class ActionUtils {
  public static cancelClollectActionDetection() {
    if (SceneManager.Instance.currentType == SceneType.CAMPAIGN_MAP_SCENE) {
      let mapModel = CampaignManager.Instance.mapModel;
      if (mapModel) {
        // if (mapModel.onCollectionId != 0) {
        NotificationManager.Instance.dispatchEvent(
          ClollectActionEvent.CANCEL_CLOLLECT,
        );
        // }
      }
    }
    if (SceneManager.Instance.currentType == SceneType.SPACE_SCENE) {
      let mapModel = SpaceManager.Instance.model;
      if (mapModel) {
        // if (mapModel.onCollectionId != 0) {
        NotificationManager.Instance.dispatchEvent(
          ClollectActionEvent.CANCEL_CLOLLECT,
        );
        // }
      }
    }
  }
}
