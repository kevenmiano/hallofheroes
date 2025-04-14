/**
 *  根据不同的类型组合不同url路径
 */
export class AvatarResourceType {
  public static PLAYER_ARMY: number = 1;
  public static NPC: number = 2;
  public static MINERAL_CAR: number = 3;
}

/**
 * 形象的一行多少帧图片
 */
export class AvatarTotalFrameX {
  public static DEFAULT: number = 6;
  public static NPC: number = 6;
  public static MINERAL_CAR: number = 6; //??
  public static PLAYER_ARMY: number = 8;
}

export class AvatarStandTotalFrameX {
  public static DEFAULT: number = 5;
}
