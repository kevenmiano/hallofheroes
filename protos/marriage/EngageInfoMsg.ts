// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.0
//   protoc               v3.21.12
// source: marriage/EngageInfoMsg.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "com.road.yishi.proto.marriage";

export interface EngageInfoMsg {
  tarUserId: number;
  isGetMarry: boolean;
  nickName: string;
  consortiaName: string;
  grade: number;
  headId: number;
}

function createBaseEngageInfoMsg(): EngageInfoMsg {
  return { tarUserId: 0, isGetMarry: false, nickName: "", consortiaName: "", grade: 0, headId: 0 };
}

export const EngageInfoMsg: MessageFns<EngageInfoMsg> = {
  encode(message: EngageInfoMsg, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.tarUserId !== 0) {
      writer.uint32(8).int32(message.tarUserId);
    }
    if (message.isGetMarry !== false) {
      writer.uint32(16).bool(message.isGetMarry);
    }
    if (message.nickName !== "") {
      writer.uint32(26).string(message.nickName);
    }
    if (message.consortiaName !== "") {
      writer.uint32(34).string(message.consortiaName);
    }
    if (message.grade !== 0) {
      writer.uint32(40).int32(message.grade);
    }
    if (message.headId !== 0) {
      writer.uint32(48).int32(message.headId);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): EngageInfoMsg {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseEngageInfoMsg();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 8) {
            break;
          }

          message.tarUserId = reader.int32();
          continue;
        }
        case 2: {
          if (tag !== 16) {
            break;
          }

          message.isGetMarry = reader.bool();
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
          if (tag !== 34) {
            break;
          }

          message.consortiaName = reader.string();
          continue;
        }
        case 5: {
          if (tag !== 40) {
            break;
          }

          message.grade = reader.int32();
          continue;
        }
        case 6: {
          if (tag !== 48) {
            break;
          }

          message.headId = reader.int32();
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

  fromJSON(object: any): EngageInfoMsg {
    return {
      tarUserId: isSet(object.tarUserId) ? globalThis.Number(object.tarUserId) : 0,
      isGetMarry: isSet(object.isGetMarry) ? globalThis.Boolean(object.isGetMarry) : false,
      nickName: isSet(object.nickName) ? globalThis.String(object.nickName) : "",
      consortiaName: isSet(object.consortiaName) ? globalThis.String(object.consortiaName) : "",
      grade: isSet(object.grade) ? globalThis.Number(object.grade) : 0,
      headId: isSet(object.headId) ? globalThis.Number(object.headId) : 0,
    };
  },

  toJSON(message: EngageInfoMsg): unknown {
    const obj: any = {};
    if (message.tarUserId !== 0) {
      obj.tarUserId = Math.round(message.tarUserId);
    }
    if (message.isGetMarry !== false) {
      obj.isGetMarry = message.isGetMarry;
    }
    if (message.nickName !== "") {
      obj.nickName = message.nickName;
    }
    if (message.consortiaName !== "") {
      obj.consortiaName = message.consortiaName;
    }
    if (message.grade !== 0) {
      obj.grade = Math.round(message.grade);
    }
    if (message.headId !== 0) {
      obj.headId = Math.round(message.headId);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<EngageInfoMsg>, I>>(base?: I): EngageInfoMsg {
    return EngageInfoMsg.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<EngageInfoMsg>, I>>(object: I): EngageInfoMsg {
    const message = createBaseEngageInfoMsg();
    message.tarUserId = object.tarUserId ?? 0;
    message.isGetMarry = object.isGetMarry ?? false;
    message.nickName = object.nickName ?? "";
    message.consortiaName = object.consortiaName ?? "";
    message.grade = object.grade ?? 0;
    message.headId = object.headId ?? 0;
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
