// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.0
//   protoc               v3.21.12
// source: login/registerRoleRsp.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "com.road.yishi.proto.login";

export interface registerRoleRsp {
  userName: string;
  site: string;
  value: boolean;
  type: number;
  message: string;
  gateIp: string;
  port: number;
  userId: number;
}

function createBaseregisterRoleRsp(): registerRoleRsp {
  return { userName: "", site: "", value: false, type: 0, message: "", gateIp: "", port: 0, userId: 0 };
}

export const registerRoleRsp: MessageFns<registerRoleRsp> = {
  encode(message: registerRoleRsp, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.userName !== "") {
      writer.uint32(10).string(message.userName);
    }
    if (message.site !== "") {
      writer.uint32(18).string(message.site);
    }
    if (message.value !== false) {
      writer.uint32(24).bool(message.value);
    }
    if (message.type !== 0) {
      writer.uint32(32).int32(message.type);
    }
    if (message.message !== "") {
      writer.uint32(42).string(message.message);
    }
    if (message.gateIp !== "") {
      writer.uint32(50).string(message.gateIp);
    }
    if (message.port !== 0) {
      writer.uint32(56).int32(message.port);
    }
    if (message.userId !== 0) {
      writer.uint32(64).int32(message.userId);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): registerRoleRsp {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseregisterRoleRsp();
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

          message.site = reader.string();
          continue;
        }
        case 3: {
          if (tag !== 24) {
            break;
          }

          message.value = reader.bool();
          continue;
        }
        case 4: {
          if (tag !== 32) {
            break;
          }

          message.type = reader.int32();
          continue;
        }
        case 5: {
          if (tag !== 42) {
            break;
          }

          message.message = reader.string();
          continue;
        }
        case 6: {
          if (tag !== 50) {
            break;
          }

          message.gateIp = reader.string();
          continue;
        }
        case 7: {
          if (tag !== 56) {
            break;
          }

          message.port = reader.int32();
          continue;
        }
        case 8: {
          if (tag !== 64) {
            break;
          }

          message.userId = reader.int32();
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

  fromJSON(object: any): registerRoleRsp {
    return {
      userName: isSet(object.userName) ? globalThis.String(object.userName) : "",
      site: isSet(object.site) ? globalThis.String(object.site) : "",
      value: isSet(object.value) ? globalThis.Boolean(object.value) : false,
      type: isSet(object.type) ? globalThis.Number(object.type) : 0,
      message: isSet(object.message) ? globalThis.String(object.message) : "",
      gateIp: isSet(object.gateIp) ? globalThis.String(object.gateIp) : "",
      port: isSet(object.port) ? globalThis.Number(object.port) : 0,
      userId: isSet(object.userId) ? globalThis.Number(object.userId) : 0,
    };
  },

  toJSON(message: registerRoleRsp): unknown {
    const obj: any = {};
    if (message.userName !== "") {
      obj.userName = message.userName;
    }
    if (message.site !== "") {
      obj.site = message.site;
    }
    if (message.value !== false) {
      obj.value = message.value;
    }
    if (message.type !== 0) {
      obj.type = Math.round(message.type);
    }
    if (message.message !== "") {
      obj.message = message.message;
    }
    if (message.gateIp !== "") {
      obj.gateIp = message.gateIp;
    }
    if (message.port !== 0) {
      obj.port = Math.round(message.port);
    }
    if (message.userId !== 0) {
      obj.userId = Math.round(message.userId);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<registerRoleRsp>, I>>(base?: I): registerRoleRsp {
    return registerRoleRsp.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<registerRoleRsp>, I>>(object: I): registerRoleRsp {
    const message = createBaseregisterRoleRsp();
    message.userName = object.userName ?? "";
    message.site = object.site ?? "";
    message.value = object.value ?? false;
    message.type = object.type ?? 0;
    message.message = object.message ?? "";
    message.gateIp = object.gateIp ?? "";
    message.port = object.port ?? 0;
    message.userId = object.userId ?? 0;
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
