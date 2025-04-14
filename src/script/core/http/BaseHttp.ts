/*
 *ClassName:BaseHttp
 *Description:http请求
 */

import Logger from "../logger/Logger";

export function HttpRequest(
  host,
  uri,
  params,
  method = "post",
  responseType: string = "text",
  errorFunc: Function = null,
  headers?: any[],
) {
  return new Promise<boolean>((resolve) => {
    let url = `${host}${uri}`;
    // params = params || {};
    // let paramsObject = {
    //     method: method,
    //     data: params
    // }

    let xhr = new Laya.HttpRequest();
    xhr.http.timeout = 10000; //设置超时时间；

    xhr.http.ontimeout = () => {
      Logger.error("ontimeout:");
      if (errorFunc) {
        errorFunc();
      }
    };

    //请求进度改变时调度, 通常用于文件上传等
    function processHandler(data) {
      Logger.log("请求进行中: " + data);
    }
    //请求出错时调度
    function errorHandler(data) {
      Logger.log("请求错误: " + data);
      if (errorFunc) {
        errorFunc();
      }
    }
    //请求结束后调度 ———— 其中的参数就是服务器放的数据
    function completeHandler(data) {
      Logger.log("请求成功..." + data);
      //json对象取值, 两种方式 Obj.property、Obj[property]
      Logger.log("返回数据: " + data);
      if (data.length) {
        resolve(data);
      } else {
        resolve(data);
      }
    }

    //once: 使用 EventDispatcher 对象注册指定类型的事件侦听器对象, 以使侦听器能够接收事件通知, 此侦听事件响应一次后自动移除
    //on: 使用 EventDispatcher 对象注册指定类型的事件侦听器对象, 以使侦听器能够接收事件通知。两者参数是完全一样的
    //注意默认情况下必须是Laya.Event.COMPLETE的形式, 而不能是Event.COMPLETE, 否则会触发不了回电函数
    xhr.on(Laya.Event.PROGRESS, this, processHandler);
    xhr.once(Laya.Event.ERROR, this, errorHandler);
    xhr.once(Laya.Event.COMPLETE, this, completeHandler);

    //发送http请求——get请求时参数必须带在路径中, 此时第二个参数空着即可
    //如果是 post请求, 则参数必须放在第二个参数中, 格式同样是: a=xxxx&b=xxx, 通常项目中都会采用json格式进行数据传递
    // xhr.send(url, paramsObject, method, "arraybuffer");
    xhr.send(url, params, method, responseType, headers);
  });
}

export function HttpFetch(
  host,
  uri,
  params,
  method = "POST",
  responseType: string = "text",
  errorFunc: Function = null,
) {
  let url = `${host}${uri}`;

  params = params || {};
  let options: any = {
    method: method,
  };
  let temp =
    typeof params === "string" ? params : querystring.stringify(params);
  switch (method.toUpperCase()) {
    case "GET":
      url += "?" + temp;
      break;
    case "POST":
      options.data = params;
      break;
  }

  return fetch(url, options)
    .then((response) =>
      response.arrayBuffer().then((buffer) => {
        let data;
        try {
          data = buffer;
        } catch (e) {
          if (errorFunc) {
            errorFunc();
          }
          return Promise.reject(new Error("error"));
        }
        if (data) {
          return data;
        } else {
          if (errorFunc) {
            errorFunc();
          }
          return Promise.reject(new Error("error"));
        }
      }),
    )
    .then((response) => {
      let data;
      try {
        data = response;
      } catch (e) {
        if (errorFunc) {
          errorFunc();
        }
        return Promise.reject(new Error("error"));
      }
      if (data) {
        return data;
      } else {
        if (errorFunc) {
          errorFunc();
        }
        return Promise.reject(new Error("error"));
      }
    })
    .catch((error) => {
      if (errorFunc) {
        errorFunc();
      }
      throw new Error(error.message);
    });
}
