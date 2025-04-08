// 从地址栏获取url参数
var utils = {
  // 按字段从url中获取参数base64值, str->key值, searchUrl->query
  getUrlParameter: function (str, searchUrl) {
    var search =
      searchUrl === undefined ? location.search.substring(1) : searchUrl;
    // 去除锚点
    var query = search.split("#")[0];
    var pairs = query.split("&");
    for (var i = 0; i < pairs.length; i++) {
      var key = pairs[i].split("=")[0];
      if (key == str) {
        return pairs[i].split("=")[1];
      }
    }
  },
  getUrlSid: function () {
    var serchPath = location.pathname;

    // var serchPath = 'http://127.0.0.1:5500/Tpl/Template_www1/game_play'
    // 获取sid
    var sidArr = serchPath.split("/");
    var sidstr = sidArr[sidArr.length - 1].split(".");
    return sidstr[0];
  },
  // base64解码为字符串
  base64Decode: function (base64Params) {
    $.base64.utf8decode = true;
    var str = $.base64.decode(base64Params);
    console.log("base64解码", str);
    return str;
  },
  // 参数字符串形式转为对象形式
  paramsToObject: function (str) {
    var str = str || location.href;
    var params = str.split("&");
    var obj = {};
    // params.forEach(function(elem) {
    //   let pair = elem.split('=')
    //   obj[pair[0]] = pair[1]
    // })
    for (var i = 0; i < params.length; i++) {
      var pair = params[i].split("=");
      obj[pair[0]] = pair[1];
    }
    return obj;
  },
  // 获取路径参数 对象集合
  getParam: function () {
    var obj = {};
    var url = decodeURI(window.location.href);
    if (url.indexOf("?") == -1) {
      return {};
    }
    var param = url.slice(url.indexOf("?") + 1);
    // console.log(url.indexOf("?"),param)
    var kv = param.split("&");
    for (var i = 0, len = kv.length; i < len; i++) {
      var o = kv[i].split("=");
      obj[o[0]] = o[1];
    }
    return obj;
  },
  // 调用前三个方法一步返回(从base64参数返回未加密的对象形式)
  getPageParams: function () {
    var base64Params = this.getUrlParameter("param");
    // console.log('url中取出base64值', base64Params)
    var strParams = this.base64Decode(base64Params);
    console.log("base64解码参数字符串形式", strParams);
    var objParams = this.paramsToObject(strParams);
    console.log("base64解码参数对象形式", JSON.stringify(objParams));
    return objParams;
  },
  // 从游戏内获取传参
  getParamsFromGm: function (params) {
    var base64Params = params.replace(/\s*/g, "");
    console.log("游戏中取出base64值", base64Params);

    var strParams = this.base64Decode(base64Params);
    console.log("base64解码参数字符串形式", strParams);
    var objParams = this.paramsToObject(strParams);
    console.log("base64解码参数对象形式", JSON.stringify(objParams));
    return objParams;
  },
  // 给定obj，返回拼接的md5操作后sign
  getSign: function (params, key) {
    console.log("传入的appkey===>", key);
    console.log("获取sign值得过程：");
    console.log("1.获取url去掉sign后的参数", JSON.stringify(params));
    var paramsArr = Object.keys(params).sort();
    console.log("2.key值升序排列", paramsArr);
    var sign = "";
    // paramsArr.forEach(function(item) {
    //   sign += params[item]
    // })
    for (var i = 0; i < paramsArr.length; i++) {
      sign += params[paramsArr[i]];
    }
    sign += key;
    console.log("3.对象拼接的字符串", sign);
    sign = $.md5(sign);
    console.log("4.md5操作得出sign值", sign);
    return sign;
  },

  // 比较sign值判断数据是否变更
  checkSign: function (obj, key) {
    var originSign = obj.sign;
    delete obj.sign;

    var sign = "";
    var paramsArr = Object.keys(obj).sort();
    // paramsArr.forEach(function(item) {
    //   sign += obj[item]
    // })
    for (var i = 0; i < paramsArr.length; i++) {
      sign += obj[paramsArr[i]];
    }
    sign += key;
    console.log("sign值校验(不一致则提示非法篡改数据)：");
    console.log("从url直接传递的sign参数", originSign);
    console.log("根据url参数生成的md5操作前sign值", sign);
    sign = $.md5(sign);
    console.log("从url传递的参数生成的sign值", sign);
    if (sign == originSign) {
      console.log("成功获取参数，sign值通过验证");
      return true;
    } else {
      return false;
    }
  },

  // 对象排序
  objSort: function (obj) {
    var newObj = {};
    var key = Object.keys(obj).sort();
    // key.forEach(item => {
    //   newObj[item] = obj[item]
    // })
    for (var i = 0; i < key.length; i++) {
      newObj[key[i]] = obj[key[i]];
    }
    return newObj;
  },

  // 生成唯一标识uuid
  uuid: function () {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";
    var uuid = s.join("");
    return uuid;
  },

  // 根据code返回错误码
  getError: function (code) {
    return errTip[code] || "未知错误";
  },

  getVerifiedError: function (code) {
    if (errVerifiedTip[code]) {
      return errVerifiedTip[code];
    } else {
      return "未知错误";
    }
  },

  // 防抖，超过delay时间间隔才执行(连续点击仅一次)
  debounce: function (fn, interval) {
    var timeout = null;
    return function () {
      clearTimeout(timeout);
      timeout = setTimeout(function () {
        fn.apply(this, arguments);
      }, interval);
    };
  },

  // 节流，delay时间间隔内只执行一次(连续点击可能多次)
  throttle: function (fn, delay) {
    var flag = false;
    return function () {
      if (flag) return;
      flag = true;
      fn.apply(this, arguments); //放在外面可以立即执行一次
      setTimeout(function () {
        flag = false;
      }, delay);
    };
  },
};

var errTip = {
  200: "成功",
  101: "用户已存在",
  102: "输入的帐号或者密码有误",
  103: "用户输入的格式有误",
  104: "token不存在或者失效",
  105: "该用户名不存在",
  106: "该用户没有绑定安全邮箱",
  107: "该密码和原密码不匹配",
  108: "该用户已绑定账户",
  109: "用户绑定区服信息失败",
  110: "链接不完整，请重新生成",
  111: "链接已经过期，请重新申请",
  112: "重置密码失败，请重新申请",
  113: "手机号码已达绑定上限",
  114: "验证码失败",
  115: "当前帐号已列入登录黑名单",
  116: "当前帐号已列入注册黑名单",
  117: "当前帐号不存在",
  118: "绑定失败",
  119: "被绑定帐号需先绑定平台帐号",
  120: "当前帐号已封停",
  121: "用户SESSION已过期",
  122: "验证码格式错误",
  123: "注册已关闭",
  124: "身份证号码格式不合法",
  125: "用户未绑定手机号码",
  127: "不可重复绑定",
  201: "订单不存在",
  202: "重复游戏订单",
  203: "订单校验失败",
  204: "该交易凭据已存在",
  205: "订单校验超时",
  206: "不支持该类型",
  207: "商品ID不存在",
  208: "不支持该货币类型",
  209: "黑名单用户不支持充值",
  210: "小额支付超过上限",
  211: "该商品已经购买",
  212: "卡被使用或不存在",
  213: "卡的序列号或PIN有错误",
  214: "卡格式有误",
  215: "订单处理中",
  216: "其他未知错误",
  217: "支付失败",
  218: "订单已过期",
  219: "订单未支付",
  500: "服务器异常",
  501: "提交必须是Post方式",
  502: "请检查传入的api_key参数是否正确",
  503: "MD5验证失败",
  504: "缺少参数",
  505: "无效请求参数",
};

var errVerifiedTip = {
  502: "应用不存在",
  503: "验签错误",
  203: "实名认证已关闭",
  105: "游戏角色Id错误",
  126: "此身份证已绑定账号，无法绑定其他账号",
  136: "该账号已实名认证",
  103: "身份号不合法",
  124: "实名认证失败",
  220: "实名认证中",
  500: "服务器错误",
};
