const s7road = {
  data: {
    userName0: "60000_1882510423710654464",
    userDate0: "2025-04-08T19:24:32.798Z",
    isFirstPay98: true,
    autoReplyList98: { 4: "", 7: "" },
    headIconClickDic98: {},
    foisonHornClick0: false,
    isShowMonthCardRedPoint98: true,
    FollowUs_DayKey98: 4,
    emailReceiveTipCheckDate98: "2025-04-08T12:22:56.868Z",
  },
};

const s7RoadSizeZone = {
  area: 1,
  siteID: 1,
  siteURL: "",
  platformID: "4",
  siteName: {
    zhcn: "美洲",
    en: "Americas",
    de: "Amerika",
    es: "Américas",
    pt: "Américas",
    tr: "Amerika",
    fr: "Amérique",
  },
  siteOrder: "https://sqh5hwna-order.wan.com/order/",
  baseUrl: "https://bm-wan-abstract-sdk.wan.com/",
  appId: 10180,
  packageId: 455,
  android_packageId: 455,
  official_packageId: 505,
  iOS_packageId: 465,
  YOUME: "YOUMED0360EB2D54A2AFFB105335CE6DF3BB23771B383",
  localCDN: "/public/7road/na",
};

localStorage.setItem("7Road_undefined", JSON.stringify(s7road.data));

localStorage.setItem(
  "7Road_undefined-SITE_ZONE",
  JSON.stringify(s7RoadSizeZone)
);

var zoneStr = localStorage.getItem("7Road_undefined-SITE_ZONE");
console.log("siteId===>", zoneStr);
if (!zoneStr) {
  loadLib("/public/7road/na/gameindex.js?timestamp=" + new Date().getTime());
} else {
  var oldarea = JSON.parse(zoneStr);
  if (oldarea != null && [1, 2, 13].indexOf(oldarea.area) != -1) {
    if (
      oldarea.localCDN != "" &&
      oldarea.localCDN != null &&
      oldarea.localCDN != "undefined"
    ) {
      if (oldarea.localCDN == "forbidden") {
        loadLib("gameindex.js?timestamp=" + new Date().getTime());
      } else {
        loadLib(
          oldarea.localCDN + "/gameindex.js?timestamp=" + new Date().getTime()
        );
      }
    } else {
      localStorage.removeItem("7Road_undefined-SITE_ZONE");
      loadLib("gameindex.js?timestamp=" + new Date().getTime());
    }
  } else {
    loadLib("gameindex.js?timestamp=" + new Date().getTime());
  }
}
