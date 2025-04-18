// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.0
//   protoc               v3.21.12
// source: market/MarketItemPriceMsg.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "com.road.yishi.proto.market";

export interface MarketItemPriceMsg {
  top: number;
  point: number;
  count: string;
}

function createBaseMarketItemPriceMsg(): MarketItemPriceMsg {
  return { top: 0, point: 0, count: "" };
}

export const MarketItemPriceMsg: MessageFns<MarketItemPriceMsg> = {
  encode(message: MarketItemPriceMsg, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.top !== 0) {
      writer.uint32(8).int32(message.top);
    }
    if (message.point !== 0) {
      writer.uint32(16).int32(message.point);
    }
    if (message.count !== "") {
      writer.uint32(26).string(message.count);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): MarketItemPriceMsg {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMarketItemPriceMsg();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 8) {
            break;
          }

          message.top = reader.int32();
          continue;
        }
        case 2: {
          if (tag !== 16) {
            break;
          }

          message.point = reader.int32();
          continue;
        }
        case 3: {
          if (tag !== 26) {
            break;
          }

          message.count = reader.string();
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

  fromJSON(object: any): MarketItemPriceMsg {
    return {
      top: isSet(object.top) ? globalThis.Number(object.top) : 0,
      point: isSet(object.point) ? globalThis.Number(object.point) : 0,
      count: isSet(object.count) ? globalThis.String(object.count) : "",
    };
  },

  toJSON(message: MarketItemPriceMsg): unknown {
    const obj: any = {};
    if (message.top !== 0) {
      obj.top = Math.round(message.top);
    }
    if (message.point !== 0) {
      obj.point = Math.round(message.point);
    }
    if (message.count !== "") {
      obj.count = message.count;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MarketItemPriceMsg>, I>>(base?: I): MarketItemPriceMsg {
    return MarketItemPriceMsg.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MarketItemPriceMsg>, I>>(object: I): MarketItemPriceMsg {
    const message = createBaseMarketItemPriceMsg();
    message.top = object.top ?? 0;
    message.point = object.point ?? 0;
    message.count = object.count ?? "";
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
