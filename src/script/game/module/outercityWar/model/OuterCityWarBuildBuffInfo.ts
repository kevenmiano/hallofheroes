//@ts-expect-error: External dependencies
export class OuterCityWarBuildBuffInfo {
  buildId?: number;
  buffId?: number;
  /** buff 主类型 101 士兵 102职业 201 英灵 */
  buffType?: number;
  /**buff 随机出的子类型
   * 士兵：1,2,3,5|4,6,7|8,9,10,11（数字对应pawn的mastertype）
   * 职业：1|2|3
   * 英灵：直接配置，101~106（对应pet的pettype，火水电风暗光）
   */
  buffCondition?: number;
  constructor(
    buildId: number,
    buffId: number,
    buffType: number,
    buffCondition: number,
  ) {
    this.buildId = buildId;
    this.buffId = buffId;
    this.buffType = buffType;
    this.buffCondition = buffCondition;
  }
}
