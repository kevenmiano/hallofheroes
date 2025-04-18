// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.0
//   protoc               v3.21.12
// source: consortia/ConsortiaAltarInfoMsg.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "com.road.yishi.proto.consortia";

export interface ConsortiaAltarInfoMsg {
  op: number;
  type: number;
  altarItemList: number[];
  altarCount: number;
  freshCount: number;
}

function createBaseConsortiaAltarInfoMsg(): ConsortiaAltarInfoMsg {
  return { op: 0, type: 0, altarItemList: [], altarCount: 0, freshCount: 0 };
}

export const ConsortiaAltarInfoMsg: MessageFns<ConsortiaAltarInfoMsg> = {
  encode(message: ConsortiaAltarInfoMsg, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.op !== 0) {
      writer.uint32(8).int32(message.op);
    }
    if (message.type !== 0) {
      writer.uint32(16).int32(message.type);
    }
    writer.uint32(26).fork();
    for (const v of message.altarItemList) {
      writer.int32(v);
    }
    writer.join();
    if (message.altarCount !== 0) {
      writer.uint32(32).int32(message.altarCount);
    }
    if (message.freshCount !== 0) {
      writer.uint32(40).int32(message.freshCount);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): ConsortiaAltarInfoMsg {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseConsortiaAltarInfoMsg();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 8) {
            break;
          }

          message.op = reader.int32();
          continue;
        }
        case 2: {
          if (tag !== 16) {
            break;
          }

          message.type = reader.int32();
          continue;
        }
        case 3: {
          if (tag === 24) {
            message.altarItemList.push(reader.int32());

            continue;
          }

          if (tag === 26) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.altarItemList.push(reader.int32());
            }

            continue;
          }

          break;
        }
        case 4: {
          if (tag !== 32) {
            break;
          }

          message.altarCount = reader.int32();
          continue;
        }
        case 5: {
          if (tag !== 40) {
            break;
          }

          message.freshCount = reader.int32();
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

  fromJSON(object: any): ConsortiaAltarInfoMsg {
    return {
      op: isSet(object.op) ? globalThis.Number(object.op) : 0,
      type: isSet(object.type) ? globalThis.Number(object.type) : 0,
      altarItemList: globalThis.Array.isArray(object?.altarItemList)
        ? object.altarItemList.map((e: any) => globalThis.Number(e))
        : [],
      altarCount: isSet(object.altarCount) ? globalThis.Number(object.altarCount) : 0,
      freshCount: isSet(object.freshCount) ? globalThis.Number(object.freshCount) : 0,
    };
  },

  toJSON(message: ConsortiaAltarInfoMsg): unknown {
    const obj: any = {};
    if (message.op !== 0) {
      obj.op = Math.round(message.op);
    }
    if (message.type !== 0) {
      obj.type = Math.round(message.type);
    }
    if (message.altarItemList?.length) {
      obj.altarItemList = message.altarItemList.map((e) => Math.round(e));
    }
    if (message.altarCount !== 0) {
      obj.altarCount = Math.round(message.altarCount);
    }
    if (message.freshCount !== 0) {
      obj.freshCount = Math.round(message.freshCount);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ConsortiaAltarInfoMsg>, I>>(base?: I): ConsortiaAltarInfoMsg {
    return ConsortiaAltarInfoMsg.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ConsortiaAltarInfoMsg>, I>>(object: I): ConsortiaAltarInfoMsg {
    const message = createBaseConsortiaAltarInfoMsg();
    message.op = object.op ?? 0;
    message.type = object.type ?? 0;
    message.altarItemList = object.altarItemList?.map((e) => e) || [];
    message.altarCount = object.altarCount ?? 0;
    message.freshCount = object.freshCount ?? 0;
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
