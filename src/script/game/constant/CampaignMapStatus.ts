/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-02-25 15:29:08
 * @LastEditTime: 2021-02-25 17:51:39
 * @LastEditors: jeremy.xu
 * @Description: 副本状态
 * 本地维护（0不可进, 1, 已完成, 2, 曾经进行, 未完成, 3, 新战场）
 */

export class CampaignMapStatus {
  public static NO_ACCEPT_CAMPAIGN: number = 0;
  public static OVER_CAMPAIGN: number = 1;
  public static OPEN_CAMPAIGN: number = 2;
  public static NEW_CAMPAIGN: number = 3;
}
