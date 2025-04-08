/**
 * 莅丞舟LayaNative絮鎶��劫��鐚����臀�札筝���
 * landscape           罔��
 * portrait            腴�絮�
 * sensor_landscape    罔��(���劫��)
 * sensor_portrait     腴�絮�(���劫��)
 */
window.screenOrientation = "sensor_landscape";

//-----libs-begin-----
loadLib("/public/7road/libs/laya.core.js");
loadLib("/public/7road/libs/laya.ani.js");
loadLib("/public/7road/libs/laya.html.js");
loadLib("/public/7road/libs/laya.ui.js");
loadLib("/public/7road/libs/domparserinone.js");
loadLib("/public/7road/libs/jszip.js");
loadLib("/public/7road/libs/crypto-js.js");
loadLib("/public/7road/libs/bytebuffer.js");
loadLib("/public/7road/libs/md5.js");
loadLib("/public/7road/libs/promise.js");
loadLib("/public/7road/libs/querystring.js");
loadLib("/public/7road/libs/zlib.min.js");
loadLib("/public/7road/libs/TweenMax.js");
loadLib("/public/7road/libs/fairygui.js");
//-----libs-end-------

var releaseLibs = [
  "/public/7road/libs/min/release/protobuf-library.min.js",
  "/public/7road/libs/min/release/protobuf-bundles.min.js",
  "js/bundle_release.js",
];
var betaLibs = [
  "/public/7road/libs/min/beta/protobuf-library.min.js",
  "/public/7road/libs/min/beta/protobuf-bundles.min.js",
  "js/bundle_beta.js",
];
var VersionList = {
  release: { jsVersion: releaseLibs },
  beta: { jsVersion: betaLibs },
};

var curVersionType = localStorage.getItem("versionType");

if (!VersionList[curVersionType]) {
  curVersionType = "release";
}

var curJsVersion = VersionList[curVersionType].jsVersion;
var curReVersion = VersionList[curVersionType].reVersion;

for (let lib of curJsVersion) {
  loadLib(lib);
}

function checkNeedReload(versionType) {
  if (versionType == curVersionType) return false;
  if (!VersionList[versionType]) return false;
  if (VersionList[versionType].reVersion != curReVersion) return true;
  let jsLibs = VersionList[versionType].jsVersion;
  for (let lb of jsLibs) {
    if (curJsVersion.indexOf(lb) < 0) {
      return true;
    }
  }
  return false;
}

function gotoVersionAndReload(versionType, siteData) {
  localStorage.setItem("versionType", versionType);
  localStorage.setItem("siteData", siteData);
  localStorage.setItem("isSwitchSite", "true");
  window.location.reload();
}
