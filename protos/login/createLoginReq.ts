// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.0
//   protoc               v3.21.12
// source: login/createLoginReq.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "com.road.yishi.proto.login";

export interface createLoginReq {
  userName: string;
  pass: string;
  site: string;
  from: string;
  appId: number;
  packageId: number;
  channelId: string;
  channelName: string;
  token: string;
  deviceId: string;
  clientVersion: string;
  systemSoftware: string;
  systemHardware: string;
  telecomOper: string;
  network: string;
  screenWidth: number;
  screenHight: number;
  density: number;
  cpuHardware: string;
  memory: number;
  glRender: string;
  glVersion: string;
  platId: number;
  siteId: number;
  clientIp: string;
  medium: string;
  serverName: string;
  clientLan: number;
  area: number;
}

function createBasecreateLoginReq(): createLoginReq {
  return {
    userName: "",
    pass: "",
    site: "",
    from: "",
    appId: 0,
    packageId: 0,
    channelId: "",
    channelName: "",
    token: "",
    deviceId: "",
    clientVersion: "",
    systemSoftware: "",
    systemHardware: "",
    telecomOper: "",
    network: "",
    screenWidth: 0,
    screenHight: 0,
    density: 0,
    cpuHardware: "",
    memory: 0,
    glRender: "",
    glVersion: "",
    platId: 0,
    siteId: 0,
    clientIp: "",
    medium: "",
    serverName: "",
    clientLan: 0,
    area: 0,
  };
}

export const createLoginReq: MessageFns<createLoginReq> = {
  encode(message: createLoginReq, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.userName !== "") {
      writer.uint32(10).string(message.userName);
    }
    if (message.pass !== "") {
      writer.uint32(18).string(message.pass);
    }
    if (message.site !== "") {
      writer.uint32(26).string(message.site);
    }
    if (message.from !== "") {
      writer.uint32(34).string(message.from);
    }
    if (message.appId !== 0) {
      writer.uint32(40).int32(message.appId);
    }
    if (message.packageId !== 0) {
      writer.uint32(48).int32(message.packageId);
    }
    if (message.channelId !== "") {
      writer.uint32(58).string(message.channelId);
    }
    if (message.channelName !== "") {
      writer.uint32(66).string(message.channelName);
    }
    if (message.token !== "") {
      writer.uint32(74).string(message.token);
    }
    if (message.deviceId !== "") {
      writer.uint32(82).string(message.deviceId);
    }
    if (message.clientVersion !== "") {
      writer.uint32(90).string(message.clientVersion);
    }
    if (message.systemSoftware !== "") {
      writer.uint32(98).string(message.systemSoftware);
    }
    if (message.systemHardware !== "") {
      writer.uint32(106).string(message.systemHardware);
    }
    if (message.telecomOper !== "") {
      writer.uint32(114).string(message.telecomOper);
    }
    if (message.network !== "") {
      writer.uint32(122).string(message.network);
    }
    if (message.screenWidth !== 0) {
      writer.uint32(128).int32(message.screenWidth);
    }
    if (message.screenHight !== 0) {
      writer.uint32(136).int32(message.screenHight);
    }
    if (message.density !== 0) {
      writer.uint32(144).int32(message.density);
    }
    if (message.cpuHardware !== "") {
      writer.uint32(154).string(message.cpuHardware);
    }
    if (message.memory !== 0) {
      writer.uint32(160).int32(message.memory);
    }
    if (message.glRender !== "") {
      writer.uint32(170).string(message.glRender);
    }
    if (message.glVersion !== "") {
      writer.uint32(178).string(message.glVersion);
    }
    if (message.platId !== 0) {
      writer.uint32(184).int32(message.platId);
    }
    if (message.siteId !== 0) {
      writer.uint32(192).int32(message.siteId);
    }
    if (message.clientIp !== "") {
      writer.uint32(202).string(message.clientIp);
    }
    if (message.medium !== "") {
      writer.uint32(210).string(message.medium);
    }
    if (message.serverName !== "") {
      writer.uint32(218).string(message.serverName);
    }
    if (message.clientLan !== 0) {
      writer.uint32(224).int32(message.clientLan);
    }
    if (message.area !== 0) {
      writer.uint32(232).int32(message.area);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): createLoginReq {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasecreateLoginReq();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.userName = reader.string();
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.pass = reader.string();
          continue;
        }
        case 3: {
          if (tag !== 26) {
            break;
          }

          message.site = reader.string();
          continue;
        }
        case 4: {
          if (tag !== 34) {
            break;
          }

          message.from = reader.string();
          continue;
        }
        case 5: {
          if (tag !== 40) {
            break;
          }

          message.appId = reader.int32();
          continue;
        }
        case 6: {
          if (tag !== 48) {
            break;
          }

          message.packageId = reader.int32();
          continue;
        }
        case 7: {
          if (tag !== 58) {
            break;
          }

          message.channelId = reader.string();
          continue;
        }
        case 8: {
          if (tag !== 66) {
            break;
          }

          message.channelName = reader.string();
          continue;
        }
        case 9: {
          if (tag !== 74) {
            break;
          }

          message.token = reader.string();
          continue;
        }
        case 10: {
          if (tag !== 82) {
            break;
          }

          message.deviceId = reader.string();
          continue;
        }
        case 11: {
          if (tag !== 90) {
            break;
          }

          message.clientVersion = reader.string();
          continue;
        }
        case 12: {
          if (tag !== 98) {
            break;
          }

          message.systemSoftware = reader.string();
          continue;
        }
        case 13: {
          if (tag !== 106) {
            break;
          }

          message.systemHardware = reader.string();
          continue;
        }
        case 14: {
          if (tag !== 114) {
            break;
          }

          message.telecomOper = reader.string();
          continue;
        }
        case 15: {
          if (tag !== 122) {
            break;
          }

          message.network = reader.string();
          continue;
        }
        case 16: {
          if (tag !== 128) {
            break;
          }

          message.screenWidth = reader.int32();
          continue;
        }
        case 17: {
          if (tag !== 136) {
            break;
          }

          message.screenHight = reader.int32();
          continue;
        }
        case 18: {
          if (tag !== 144) {
            break;
          }

          message.density = reader.int32();
          continue;
        }
        case 19: {
          if (tag !== 154) {
            break;
          }

          message.cpuHardware = reader.string();
          continue;
        }
        case 20: {
          if (tag !== 160) {
            break;
          }

          message.memory = reader.int32();
          continue;
        }
        case 21: {
          if (tag !== 170) {
            break;
          }

          message.glRender = reader.string();
          continue;
        }
        case 22: {
          if (tag !== 178) {
            break;
          }

          message.glVersion = reader.string();
          continue;
        }
        case 23: {
          if (tag !== 184) {
            break;
          }

          message.platId = reader.int32();
          continue;
        }
        case 24: {
          if (tag !== 192) {
            break;
          }

          message.siteId = reader.int32();
          continue;
        }
        case 25: {
          if (tag !== 202) {
            break;
          }

          message.clientIp = reader.string();
          continue;
        }
        case 26: {
          if (tag !== 210) {
            break;
          }

          message.medium = reader.string();
          continue;
        }
        case 27: {
          if (tag !== 218) {
            break;
          }

          message.serverName = reader.string();
          continue;
        }
        case 28: {
          if (tag !== 224) {
            break;
          }

          message.clientLan = reader.int32();
          continue;
        }
        case 29: {
          if (tag !== 232) {
            break;
          }

          message.area = reader.int32();
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): createLoginReq {
    return {
      userName: isSet(object.userName) ? globalThis.String(object.userName) : "",
      pass: isSet(object.pass) ? globalThis.String(object.pass) : "",
      site: isSet(object.site) ? globalThis.String(object.site) : "",
      from: isSet(object.from) ? globalThis.String(object.from) : "",
      appId: isSet(object.appId) ? globalThis.Number(object.appId) : 0,
      packageId: isSet(object.packageId) ? globalThis.Number(object.packageId) : 0,
      channelId: isSet(object.channelId) ? globalThis.String(object.channelId) : "",
      channelName: isSet(object.channelName) ? globalThis.String(object.channelName) : "",
      token: isSet(object.token) ? globalThis.String(object.token) : "",
      deviceId: isSet(object.deviceId) ? globalThis.String(object.deviceId) : "",
      clientVersion: isSet(object.clientVersion) ? globalThis.String(object.clientVersion) : "",
      systemSoftware: isSet(object.systemSoftware) ? globalThis.String(object.systemSoftware) : "",
      systemHardware: isSet(object.systemHardware) ? globalThis.String(object.systemHardware) : "",
      telecomOper: isSet(object.telecomOper) ? globalThis.String(object.telecomOper) : "",
      network: isSet(object.network) ? globalThis.String(object.network) : "",
      screenWidth: isSet(object.screenWidth) ? globalThis.Number(object.screenWidth) : 0,
      screenHight: isSet(object.screenHight) ? globalThis.Number(object.screenHight) : 0,
      density: isSet(object.density) ? globalThis.Number(object.density) : 0,
      cpuHardware: isSet(object.cpuHardware) ? globalThis.String(object.cpuHardware) : "",
      memory: isSet(object.memory) ? globalThis.Number(object.memory) : 0,
      glRender: isSet(object.glRender) ? globalThis.String(object.glRender) : "",
      glVersion: isSet(object.glVersion) ? globalThis.String(object.glVersion) : "",
      platId: isSet(object.platId) ? globalThis.Number(object.platId) : 0,
      siteId: isSet(object.siteId) ? globalThis.Number(object.siteId) : 0,
      clientIp: isSet(object.clientIp) ? globalThis.String(object.clientIp) : "",
      medium: isSet(object.medium) ? globalThis.String(object.medium) : "",
      serverName: isSet(object.serverName) ? globalThis.String(object.serverName) : "",
      clientLan: isSet(object.clientLan) ? globalThis.Number(object.clientLan) : 0,
      area: isSet(object.area) ? globalThis.Number(object.area) : 0,
    };
  },

  toJSON(message: createLoginReq): unknown {
    const obj: any = {};
    if (message.userName !== "") {
      obj.userName = message.userName;
    }
    if (message.pass !== "") {
      obj.pass = message.pass;
    }
    if (message.site !== "") {
      obj.site = message.site;
    }
    if (message.from !== "") {
      obj.from = message.from;
    }
    if (message.appId !== 0) {
      obj.appId = Math.round(message.appId);
    }
    if (message.packageId !== 0) {
      obj.packageId = Math.round(message.packageId);
    }
    if (message.channelId !== "") {
      obj.channelId = message.channelId;
    }
    if (message.channelName !== "") {
      obj.channelName = message.channelName;
    }
    if (message.token !== "") {
      obj.token = message.token;
    }
    if (message.deviceId !== "") {
      obj.deviceId = message.deviceId;
    }
    if (message.clientVersion !== "") {
      obj.clientVersion = message.clientVersion;
    }
    if (message.systemSoftware !== "") {
      obj.systemSoftware = message.systemSoftware;
    }
    if (message.systemHardware !== "") {
      obj.systemHardware = message.systemHardware;
    }
    if (message.telecomOper !== "") {
      obj.telecomOper = message.telecomOper;
    }
    if (message.network !== "") {
      obj.network = message.network;
    }
    if (message.screenWidth !== 0) {
      obj.screenWidth = Math.round(message.screenWidth);
    }
    if (message.screenHight !== 0) {
      obj.screenHight = Math.round(message.screenHight);
    }
    if (message.density !== 0) {
      obj.density = Math.round(message.density);
    }
    if (message.cpuHardware !== "") {
      obj.cpuHardware = message.cpuHardware;
    }
    if (message.memory !== 0) {
      obj.memory = Math.round(message.memory);
    }
    if (message.glRender !== "") {
      obj.glRender = message.glRender;
    }
    if (message.glVersion !== "") {
      obj.glVersion = message.glVersion;
    }
    if (message.platId !== 0) {
      obj.platId = Math.round(message.platId);
    }
    if (message.siteId !== 0) {
      obj.siteId = Math.round(message.siteId);
    }
    if (message.clientIp !== "") {
      obj.clientIp = message.clientIp;
    }
    if (message.medium !== "") {
      obj.medium = message.medium;
    }
    if (message.serverName !== "") {
      obj.serverName = message.serverName;
    }
    if (message.clientLan !== 0) {
      obj.clientLan = Math.round(message.clientLan);
    }
    if (message.area !== 0) {
      obj.area = Math.round(message.area);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<createLoginReq>, I>>(base?: I): createLoginReq {
    return createLoginReq.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<createLoginReq>, I>>(object: I): createLoginReq {
    const message = createBasecreateLoginReq();
    message.userName = object.userName ?? "";
    message.pass = object.pass ?? "";
    message.site = object.site ?? "";
    message.from = object.from ?? "";
    message.appId = object.appId ?? 0;
    message.packageId = object.packageId ?? 0;
    message.channelId = object.channelId ?? "";
    message.channelName = object.channelName ?? "";
    message.token = object.token ?? "";
    message.deviceId = object.deviceId ?? "";
    message.clientVersion = object.clientVersion ?? "";
    message.systemSoftware = object.systemSoftware ?? "";
    message.systemHardware = object.systemHardware ?? "";
    message.telecomOper = object.telecomOper ?? "";
    message.network = object.network ?? "";
    message.screenWidth = object.screenWidth ?? 0;
    message.screenHight = object.screenHight ?? 0;
    message.density = object.density ?? 0;
    message.cpuHardware = object.cpuHardware ?? "";
    message.memory = object.memory ?? 0;
    message.glRender = object.glRender ?? "";
    message.glVersion = object.glVersion ?? "";
    message.platId = object.platId ?? 0;
    message.siteId = object.siteId ?? 0;
    message.clientIp = object.clientIp ?? "";
    message.medium = object.medium ?? "";
    message.serverName = object.serverName ?? "";
    message.clientLan = object.clientLan ?? 0;
    message.area = object.area ?? 0;
    return message;
  },
};

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}

export interface MessageFns<T> {
  encode(message: T, writer?: BinaryWriter): BinaryWriter;
  decode(input: BinaryReader | Uint8Array, length?: number): T;
  fromJSON(object: any): T;
  toJSON(message: T): unknown;
  create<I extends Exact<DeepPartial<T>, I>>(base?: I): T;
  fromPartial<I extends Exact<DeepPartial<T>, I>>(object: I): T;
}
