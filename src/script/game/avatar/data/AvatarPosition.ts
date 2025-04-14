/**
 *    AVATAR部位
 */
export class AvatarPosition {
  public static ARMY: string = "army"; //武器
  public static BODY: string = "body"; //身体
  public static HAIR_UP: string = "hairup"; //头发上
  public static HAIR_DOWN: string = "hairdown"; //头发下
  public static CLOAK: string = "cloak"; //斗蓬
  public static WING: string = "wing"; //翅膀
  public static MOUNT: string = "mount"; //坐骑
  public static MOUNT_WING: string = "mountWing"; //坐骑翅膀
  public static PET: string = "pet"; //英灵
  public static TRANSLUCENCE: string = "translucence"; //半透明替代模型

  private static _avatarId: number;
  public static get avatarId(): number {
    return ++this._avatarId;
  }
  public static get avatarList(): string[] {
    return [
      AvatarPosition.ARMY,
      AvatarPosition.BODY,
      AvatarPosition.HAIR_UP,
      AvatarPosition.HAIR_DOWN,
      AvatarPosition.CLOAK,
      AvatarPosition.WING,
      AvatarPosition.MOUNT,
      AvatarPosition.MOUNT_WING,
      AvatarPosition.PET,
      AvatarPosition.TRANSLUCENCE,
    ];
  }
}

export class AvatarPositionAddSign {
  public static BODY_DEFAULT: string = "BODY_DEFAULT"; //正常的身体
  public static BODY_MORPH: string = "BODY_MORPH"; //变身的身体
}
