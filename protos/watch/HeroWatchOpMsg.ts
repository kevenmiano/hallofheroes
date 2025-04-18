// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.0
//   protoc               v3.21.12
// source: watch/HeroWatchOpMsg.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "com.road.yishi.proto.watch";

export interface HeroWatchOpMsg {
  opType: number;
  gridType: number;
  gridPos: number;
  jionPos: number;
  itemPos: number;
}

function createBaseHeroWatchOpMsg(): HeroWatchOpMsg {
  return { opType: 0, gridType: 0, gridPos: 0, jionPos: 0, itemPos: 0 };
}

export const HeroWatchOpMsg: MessageFns<HeroWatchOpMsg> = {
  encode(message: HeroWatchOpMsg, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.opType !== 0) {
      writer.uint32(8).int32(message.opType);
    }
    if (message.gridType !== 0) {
      writer.uint32(16).int32(message.gridType);
    }
    if (message.gridPos !== 0) {
      writer.uint32(24).int32(message.gridPos);
    }
    if (message.jionPos !== 0) {
      writer.uint32(32).int32(message.jionPos);
    }
    if (message.itemPos !== 0) {
      writer.uint32(40).int32(message.itemPos);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): HeroWatchOpMsg {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseHeroWatchOpMsg();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 8) {
            break;
          }

          message.opType = reader.int32();
          continue;
        }
        case 2: {
          if (tag !== 16) {
            break;
          }

          message.gridType = reader.int32();
          continue;
        }
        case 3: {
          if (tag !== 24) {
            break;
          }

          message.gridPos = reader.int32();
          continue;
        }
        case 4: {
          if (tag !== 32) {
            break;
          }

          message.jionPos = reader.int32();
          continue;
        }
        case 5: {
          if (tag !== 40) {
            break;
          }

          message.itemPos = reader.int32();
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

  fromJSON(object: any): HeroWatchOpMsg {
    return {
      opType: isSet(object.opType) ? globalThis.Number(object.opType) : 0,
      gridType: isSet(object.gridType) ? globalThis.Number(object.gridType) : 0,
      gridPos: isSet(object.gridPos) ? globalThis.Number(object.gridPos) : 0,
      jionPos: isSet(object.jionPos) ? globalThis.Number(object.jionPos) : 0,
      itemPos: isSet(object.itemPos) ? globalThis.Number(object.itemPos) : 0,
    };
  },

  toJSON(message: HeroWatchOpMsg): unknown {
    const obj: any = {};
    if (message.opType !== 0) {
      obj.opType = Math.round(message.opType);
    }
    if (message.gridType !== 0) {
      obj.gridType = Math.round(message.gridType);
    }
    if (message.gridPos !== 0) {
      obj.gridPos = Math.round(message.gridPos);
    }
    if (message.jionPos !== 0) {
      obj.jionPos = Math.round(message.jionPos);
    }
    if (message.itemPos !== 0) {
      obj.itemPos = Math.round(message.itemPos);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<HeroWatchOpMsg>, I>>(base?: I): HeroWatchOpMsg {
    return HeroWatchOpMsg.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<HeroWatchOpMsg>, I>>(object: I): HeroWatchOpMsg {
    const message = createBaseHeroWatchOpMsg();
    message.opType = object.opType ?? 0;
    message.gridType = object.gridType ?? 0;
    message.gridPos = object.gridPos ?? 0;
    message.jionPos = object.jionPos ?? 0;
    message.itemPos = object.itemPos ?? 0;
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
