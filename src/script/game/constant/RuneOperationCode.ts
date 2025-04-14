/**
 * 符文相关该操作的操作码
 * @author alan
 *
 */
export class RuneOperationCode {
  /**
   * 符文学习 optype,runeId
   */
  public static RUNE_STUDY: number = 1;

  /**
   * 符文升级  optype,runeItemPos, runeItemCount, runeId
   */
  public static RUNE_UPGRADE: number = 2;

  /**
   * 符文携带 optype, runeId
   */
  public static RUNE_TAKE: number = 3;
  /**
   * 符孔激活
   */
  public static RUNE_HOLE_ACTIVE: number = 4;
  /**
   * 符孔雕刻
   */
  public static RUNE_HOLE_CARVE: number = 5;
  /**
   * 替换符孔
   */
  public static RUNE_HOLE_REPLACE: number = 6;

  constructor() {}
}
