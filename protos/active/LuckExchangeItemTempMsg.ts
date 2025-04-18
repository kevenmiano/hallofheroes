// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.0
//   protoc               v3.21.12
// source: active/LuckExchangeItemTempMsg.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "com.road.yishi.proto.active";

export interface LuckExchangeItemTempMsg {
  itemId: number;
  itemCount: number;
  rare: boolean;
  dropType: number;
}

function createBaseLuckExchangeItemTempMsg(): LuckExchangeItemTempMsg {
  return { itemId: 0, itemCount: 0, rare: false, dropType: 0 };
}

export const LuckExchangeItemTempMsg: MessageFns<LuckExchangeItemTempMsg> = {
  encode(message: LuckExchangeItemTempMsg, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.itemId !== 0) {
      writer.uint32(8).int32(message.itemId);
    }
    if (message.itemCount !== 0) {
      writer.uint32(16).int32(message.itemCount);
    }
    if (message.rare !== false) {
      writer.uint32(24).bool(message.rare);
    }
    if (message.dropType !== 0) {
      writer.uint32(32).int32(message.dropType);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): LuckExchangeItemTempMsg {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLuckExchangeItemTempMsg();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 8) {
            break;
          }

          message.itemId = reader.int32();
          continue;
        }
        case 2: {
          if (tag !== 16) {
            break;
          }

          message.itemCount = reader.int32();
          continue;
        }
        case 3: {
          if (tag !== 24) {
            break;
          }

          message.rare = reader.bool();
          continue;
        }
        case 4: {
          if (tag !== 32) {
            break;
          }

          message.dropType = reader.int32();
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

  fromJSON(object: any): LuckExchangeItemTempMsg {
    return {
      itemId: isSet(object.itemId) ? globalThis.Number(object.itemId) : 0,
      itemCount: isSet(object.itemCount) ? globalThis.Number(object.itemCount) : 0,
      rare: isSet(object.rare) ? globalThis.Boolean(object.rare) : false,
      dropType: isSet(object.dropType) ? globalThis.Number(object.dropType) : 0,
    };
  },

  toJSON(message: LuckExchangeItemTempMsg): unknown {
    const obj: any = {};
    if (message.itemId !== 0) {
      obj.itemId = Math.round(message.itemId);
    }
    if (message.itemCount !== 0) {
      obj.itemCount = Math.round(message.itemCount);
    }
    if (message.rare !== false) {
      obj.rare = message.rare;
    }
    if (message.dropType !== 0) {
      obj.dropType = Math.round(message.dropType);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<LuckExchangeItemTempMsg>, I>>(base?: I): LuckExchangeItemTempMsg {
    return LuckExchangeItemTempMsg.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<LuckExchangeItemTempMsg>, I>>(object: I): LuckExchangeItemTempMsg {
    const message = createBaseLuckExchangeItemTempMsg();
    message.itemId = object.itemId ?? 0;
    message.itemCount = object.itemCount ?? 0;
    message.rare = object.rare ?? false;
    message.dropType = object.dropType ?? 0;
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
