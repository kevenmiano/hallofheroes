// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.0
//   protoc               v3.21.12
// source: login/SimpleUserInfo.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "com.road.yishi.proto.login";

export interface SimpleUserInfo {
  userId: number;
  userName: string;
  nickName: string;
  grade: number;
  repute: number;
  sex: number;
  rename: number;
  active: boolean;
  site: string;
  isOnline: boolean;
}

function createBaseSimpleUserInfo(): SimpleUserInfo {
  return {
    userId: 0,
    userName: "",
    nickName: "",
    grade: 0,
    repute: 0,
    sex: 0,
    rename: 0,
    active: false,
    site: "",
    isOnline: false,
  };
}

export const SimpleUserInfo: MessageFns<SimpleUserInfo> = {
  encode(message: SimpleUserInfo, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.userId !== 0) {
      writer.uint32(8).int32(message.userId);
    }
    if (message.userName !== "") {
      writer.uint32(18).string(message.userName);
    }
    if (message.nickName !== "") {
      writer.uint32(26).string(message.nickName);
    }
    if (message.grade !== 0) {
      writer.uint32(32).int32(message.grade);
    }
    if (message.repute !== 0) {
      writer.uint32(40).int32(message.repute);
    }
    if (message.sex !== 0) {
      writer.uint32(48).int32(message.sex);
    }
    if (message.rename !== 0) {
      writer.uint32(56).int32(message.rename);
    }
    if (message.active !== false) {
      writer.uint32(64).bool(message.active);
    }
    if (message.site !== "") {
      writer.uint32(74).string(message.site);
    }
    if (message.isOnline !== false) {
      writer.uint32(80).bool(message.isOnline);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): SimpleUserInfo {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSimpleUserInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 8) {
            break;
          }

          message.userId = reader.int32();
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.userName = reader.string();
          continue;
        }
        case 3: {
          if (tag !== 26) {
            break;
          }

          message.nickName = reader.string();
          continue;
        }
        case 4: {
          if (tag !== 32) {
            break;
          }

          message.grade = reader.int32();
          continue;
        }
        case 5: {
          if (tag !== 40) {
            break;
          }

          message.repute = reader.int32();
          continue;
        }
        case 6: {
          if (tag !== 48) {
            break;
          }

          message.sex = reader.int32();
          continue;
        }
        case 7: {
          if (tag !== 56) {
            break;
          }

          message.rename = reader.int32();
          continue;
        }
        case 8: {
          if (tag !== 64) {
            break;
          }

          message.active = reader.bool();
          continue;
        }
        case 9: {
          if (tag !== 74) {
            break;
          }

          message.site = reader.string();
          continue;
        }
        case 10: {
          if (tag !== 80) {
            break;
          }

          message.isOnline = reader.bool();
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

  fromJSON(object: any): SimpleUserInfo {
    return {
      userId: isSet(object.userId) ? globalThis.Number(object.userId) : 0,
      userName: isSet(object.userName) ? globalThis.String(object.userName) : "",
      nickName: isSet(object.nickName) ? globalThis.String(object.nickName) : "",
      grade: isSet(object.grade) ? globalThis.Number(object.grade) : 0,
      repute: isSet(object.repute) ? globalThis.Number(object.repute) : 0,
      sex: isSet(object.sex) ? globalThis.Number(object.sex) : 0,
      rename: isSet(object.rename) ? globalThis.Number(object.rename) : 0,
      active: isSet(object.active) ? globalThis.Boolean(object.active) : false,
      site: isSet(object.site) ? globalThis.String(object.site) : "",
      isOnline: isSet(object.isOnline) ? globalThis.Boolean(object.isOnline) : false,
    };
  },

  toJSON(message: SimpleUserInfo): unknown {
    const obj: any = {};
    if (message.userId !== 0) {
      obj.userId = Math.round(message.userId);
    }
    if (message.userName !== "") {
      obj.userName = message.userName;
    }
    if (message.nickName !== "") {
      obj.nickName = message.nickName;
    }
    if (message.grade !== 0) {
      obj.grade = Math.round(message.grade);
    }
    if (message.repute !== 0) {
      obj.repute = Math.round(message.repute);
    }
    if (message.sex !== 0) {
      obj.sex = Math.round(message.sex);
    }
    if (message.rename !== 0) {
      obj.rename = Math.round(message.rename);
    }
    if (message.active !== false) {
      obj.active = message.active;
    }
    if (message.site !== "") {
      obj.site = message.site;
    }
    if (message.isOnline !== false) {
      obj.isOnline = message.isOnline;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<SimpleUserInfo>, I>>(base?: I): SimpleUserInfo {
    return SimpleUserInfo.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<SimpleUserInfo>, I>>(object: I): SimpleUserInfo {
    const message = createBaseSimpleUserInfo();
    message.userId = object.userId ?? 0;
    message.userName = object.userName ?? "";
    message.nickName = object.nickName ?? "";
    message.grade = object.grade ?? 0;
    message.repute = object.repute ?? 0;
    message.sex = object.sex ?? 0;
    message.rename = object.rename ?? 0;
    message.active = object.active ?? false;
    message.site = object.site ?? "";
    message.isOnline = object.isOnline ?? false;
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
