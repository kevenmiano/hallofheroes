import { PathManager } from "../../../manager/PathManager";
import { SharedManager } from "../../../manager/SharedManager";
import SiteZoneData, { ZONE_AREA } from "../model/SiteZoneData";

export enum SiteZoneKey {
  SITE_ZONE = "SITE_ZONE",
}

export function getZoneCount() {
  return PathManager.info.siteZoneCount;
}

export function saveZoneData(value: SiteZoneData) {
  SharedManager.Instance.setWindowItem(
    SiteZoneKey.SITE_ZONE,
    JSON.stringify(value),
  );
}

/**更新区服信息 */
export function updateZoneData(zoneListData: SiteZoneData[]) {
  let zoneData = getZoneData();
  if (!zoneData) return;
  for (let index = 0; index < zoneListData.length; index++) {
    let element = zoneListData[index];
    if (
      zoneData.siteID == element.siteID &&
      zoneData.area == zoneData.area &&
      !Object.is(zoneData, element)
    ) {
      saveZoneData(element);
      break;
    }
  }
}

export function getZoneData(): SiteZoneData {
  let last: any = SharedManager.Instance.getWindowItem(SiteZoneKey.SITE_ZONE);
  if (last != "" && last != undefined && last != "undefined") {
    last = JSON.parse(last) as SiteZoneData;
    return last;
  } else {
    return null;
  }
}

/**
 * 当前是否为海外
 * @returns
 */
export function isOversea(): boolean {
  let zoneData = getZoneData();
  if (zoneData && zoneData.area == ZONE_AREA.INLANG) {
    //地区区域为海外
    return false;
  }
  return true;
}
