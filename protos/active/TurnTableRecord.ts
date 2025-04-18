// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.0
//   protoc               v3.21.12
// source: active/TurnTableRecord.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "com.road.yishi.proto.active";

export interface TurnTableRecord {
  consumeType: number;
  consumeItemId: number;
  consumeCount: number;
  rewardId: number;
  rewardCount: number;
  magnification: number;
  TurnTime: number;
}

function createBaseTurnTableRecord(): TurnTableRecord {
  return {
    consumeType: 0,
    consumeItemId: 0,
    consumeCount: 0,
    rewardId: 0,
    rewardCount: 0,
    magnification: 0,
    TurnTime: 0,
  };
}

export const TurnTableRecord: MessageFns<TurnTableRecord> = {
  encode(message: TurnTableRecord, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.consumeType !== 0) {
      writer.uint32(8).int32(message.consumeType);
    }
    if (message.consumeItemId !== 0) {
      writer.uint32(16).int32(message.consumeItemId);
    }
    if (message.consumeCount !== 0) {
      writer.uint32(24).int32(message.consumeCount);
    }
    if (message.rewardId !== 0) {
      writer.uint32(32).int32(message.rewardId);
    }
    if (message.rewardCount !== 0) {
      writer.uint32(40).int32(message.rewardCount);
    }
    if (message.magnification !== 0) {
      writer.uint32(48).int32(message.magnification);
    }
    if (message.TurnTime !== 0) {
      writer.uint32(56).int32(message.TurnTime);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): TurnTableRecord {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTurnTableRecord();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 8) {
            break;
          }

          message.consumeType = reader.int32();
          continue;
        }
        case 2: {
          if (tag !== 16) {
            break;
          }

          message.consumeItemId = reader.int32();
          continue;
        }
        case 3: {
          if (tag !== 24) {
            break;
          }

          message.consumeCount = reader.int32();
          continue;
        }
        case 4: {
          if (tag !== 32) {
            break;
          }

          message.rewardId = reader.int32();
          continue;
        }
        case 5: {
          if (tag !== 40) {
            break;
          }

          message.rewardCount = reader.int32();
          continue;
        }
        case 6: {
          if (tag !== 48) {
            break;
          }

          message.magnification = reader.int32();
          continue;
        }
        case 7: {
          if (tag !== 56) {
            break;
          }

          message.TurnTime = reader.int32();
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

  fromJSON(object: any): TurnTableRecord {
    return {
      consumeType: isSet(object.consumeType) ? globalThis.Number(object.consumeType) : 0,
      consumeItemId: isSet(object.consumeItemId) ? globalThis.Number(object.consumeItemId) : 0,
      consumeCount: isSet(object.consumeCount) ? globalThis.Number(object.consumeCount) : 0,
      rewardId: isSet(object.rewardId) ? globalThis.Number(object.rewardId) : 0,
      rewardCount: isSet(object.rewardCount) ? globalThis.Number(object.rewardCount) : 0,
      magnification: isSet(object.magnification) ? globalThis.Number(object.magnification) : 0,
      TurnTime: isSet(object.TurnTime) ? globalThis.Number(object.TurnTime) : 0,
    };
  },

  toJSON(message: TurnTableRecord): unknown {
    const obj: any = {};
    if (message.consumeType !== 0) {
      obj.consumeType = Math.round(message.consumeType);
    }
    if (message.consumeItemId !== 0) {
      obj.consumeItemId = Math.round(message.consumeItemId);
    }
    if (message.consumeCount !== 0) {
      obj.consumeCount = Math.round(message.consumeCount);
    }
    if (message.rewardId !== 0) {
      obj.rewardId = Math.round(message.rewardId);
    }
    if (message.rewardCount !== 0) {
      obj.rewardCount = Math.round(message.rewardCount);
    }
    if (message.magnification !== 0) {
      obj.magnification = Math.round(message.magnification);
    }
    if (message.TurnTime !== 0) {
      obj.TurnTime = Math.round(message.TurnTime);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<TurnTableRecord>, I>>(base?: I): TurnTableRecord {
    return TurnTableRecord.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<TurnTableRecord>, I>>(object: I): TurnTableRecord {
    const message = createBaseTurnTableRecord();
    message.consumeType = object.consumeType ?? 0;
    message.consumeItemId = object.consumeItemId ?? 0;
    message.consumeCount = object.consumeCount ?? 0;
    message.rewardId = object.rewardId ?? 0;
    message.rewardCount = object.rewardCount ?? 0;
    message.magnification = object.magnification ?? 0;
    message.TurnTime = object.TurnTime ?? 0;
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
