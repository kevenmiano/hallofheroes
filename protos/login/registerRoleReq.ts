// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.0
//   protoc               v3.21.12
// source: login/registerRoleReq.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "com.road.yishi.proto.login";

export interface registerRoleReq {
  userId: number;
  userName: string;
  nickName: string;
  sex: number;
  camp: number;
  icon: number;
  site: string;
  md5Password: string;
}

function createBaseregisterRoleReq(): registerRoleReq {
  return { userId: 0, userName: "", nickName: "", sex: 0, camp: 0, icon: 0, site: "", md5Password: "" };
}

export const registerRoleReq: MessageFns<registerRoleReq> = {
  encode(message: registerRoleReq, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.userId !== 0) {
      writer.uint32(8).int32(message.userId);
    }
    if (message.userName !== "") {
      writer.uint32(18).string(message.userName);
    }
    if (message.nickName !== "") {
      writer.uint32(26).string(message.nickName);
    }
    if (message.sex !== 0) {
      writer.uint32(32).int32(message.sex);
    }
    if (message.camp !== 0) {
      writer.uint32(40).int32(message.camp);
    }
    if (message.icon !== 0) {
      writer.uint32(48).int32(message.icon);
    }
    if (message.site !== "") {
      writer.uint32(58).string(message.site);
    }
    if (message.md5Password !== "") {
      writer.uint32(66).string(message.md5Password);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): registerRoleReq {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseregisterRoleReq();
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

          message.sex = reader.int32();
          continue;
        }
        case 5: {
          if (tag !== 40) {
            break;
          }

          message.camp = reader.int32();
          continue;
        }
        case 6: {
          if (tag !== 48) {
            break;
          }

          message.icon = reader.int32();
          continue;
        }
        case 7: {
          if (tag !== 58) {
            break;
          }

          message.site = reader.string();
          continue;
        }
        case 8: {
          if (tag !== 66) {
            break;
          }

          message.md5Password = reader.string();
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

  fromJSON(object: any): registerRoleReq {
    return {
      userId: isSet(object.userId) ? globalThis.Number(object.userId) : 0,
      userName: isSet(object.userName) ? globalThis.String(object.userName) : "",
      nickName: isSet(object.nickName) ? globalThis.String(object.nickName) : "",
      sex: isSet(object.sex) ? globalThis.Number(object.sex) : 0,
      camp: isSet(object.camp) ? globalThis.Number(object.camp) : 0,
      icon: isSet(object.icon) ? globalThis.Number(object.icon) : 0,
      site: isSet(object.site) ? globalThis.String(object.site) : "",
      md5Password: isSet(object.md5Password) ? globalThis.String(object.md5Password) : "",
    };
  },

  toJSON(message: registerRoleReq): unknown {
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
    if (message.sex !== 0) {
      obj.sex = Math.round(message.sex);
    }
    if (message.camp !== 0) {
      obj.camp = Math.round(message.camp);
    }
    if (message.icon !== 0) {
      obj.icon = Math.round(message.icon);
    }
    if (message.site !== "") {
      obj.site = message.site;
    }
    if (message.md5Password !== "") {
      obj.md5Password = message.md5Password;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<registerRoleReq>, I>>(base?: I): registerRoleReq {
    return registerRoleReq.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<registerRoleReq>, I>>(object: I): registerRoleReq {
    const message = createBaseregisterRoleReq();
    message.userId = object.userId ?? 0;
    message.userName = object.userName ?? "";
    message.nickName = object.nickName ?? "";
    message.sex = object.sex ?? 0;
    message.camp = object.camp ?? 0;
    message.icon = object.icon ?? 0;
    message.site = object.site ?? "";
    message.md5Password = object.md5Password ?? "";
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
