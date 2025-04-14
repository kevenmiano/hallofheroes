import LangManager from "../../core/lang/LangManager";
export class RoomState {
  public static STATE_UNUSE: number = 0; // 未使用
  public static STATE_USEING: number = 1; // 使用中
  public static STATE_COMPETEING: number = 2; // 撮合中
  public static STATE_PLAYING: number = 3; // 游戏中

  public static getStateName(state: number): string {
    switch (state) {
      case RoomState.STATE_UNUSE:
        return LangManager.Instance.GetTranslation(
          "room.datas.RoomState.UNUSE",
        );
      case RoomState.STATE_USEING:
        return LangManager.Instance.GetTranslation(
          "room.datas.RoomState.USEING",
        );
      case RoomState.STATE_PLAYING:
        return LangManager.Instance.GetTranslation(
          "room.datas.RoomState.PLAYING",
        );
      case RoomState.STATE_COMPETEING:
        return LangManager.Instance.GetTranslation(
          "room.datas.RoomState.COMPETEING",
        );
    }
    return "";
  }
  public static getStateNameTips(state: number): string {
    switch (state) {
      case RoomState.STATE_UNUSE:
        return LangManager.Instance.GetTranslation(
          "room.datas.RoomState.UNUSE01",
        );
      case RoomState.STATE_USEING:
        return LangManager.Instance.GetTranslation(
          "room.datas.RoomState.USEING01",
        );
      case RoomState.STATE_PLAYING:
        return LangManager.Instance.GetTranslation(
          "room.datas.RoomState.PLAYING01",
        );
      case RoomState.STATE_COMPETEING:
        return LangManager.Instance.GetTranslation(
          "room.datas.RoomState.COMPETEING01",
        );
    }
    return "";
  }
}
