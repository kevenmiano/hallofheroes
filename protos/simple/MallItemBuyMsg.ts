// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.0
//   protoc               v3.21.12
// source: simple/MallItemBuyMsg.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "com.road.yishi.proto.simple";

export interface MallItemBuyMsg {
  id: number;
  userId: number;
  mallItem: string;
  bidupPoint: number;
  buyTime: string;
}

function createBaseMallItemBuyMsg(): MallItemBuyMsg {
  return { id: 0, userId: 0, mallItem: "", bidupPoint: 0, buyTime: "" };
}

export const MallItemBuyMsg: MessageFns<MallItemBuyMsg> = {
  encode(message: MallItemBuyMsg, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.id !== 0) {
      writer.uint32(8).int32(message.id);
    }
    if (message.userId !== 0) {
      writer.uint32(16).int32(message.userId);
    }
    if (message.mallItem !== "") {
      writer.uint32(26).string(message.mallItem);
    }
    if (message.bidupPoint !== 0) {
      writer.uint32(32).int32(message.bidupPoint);
    }
    if (message.buyTime !== "") {
      writer.uint32(42).string(message.buyTime);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): MallItemBuyMsg {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMallItemBuyMsg();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 8) {
            break;
          }

          message.id = reader.int32();
          continue;
        }
        case 2: {
          if (tag !== 16) {
            break;
          }

          message.userId = reader.int32();
          continue;
        }
        case 3: {
          if (tag !== 26) {
            break;
          }

          message.mallItem = reader.string();
          continue;
        }
        case 4: {
          if (tag !== 32) {
            break;
          }

          message.bidupPoint = reader.int32();
          continue;
        }
        case 5: {
          if (tag !== 42) {
            break;
          }

          message.buyTime = reader.string();
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

  fromJSON(object: any): MallItemBuyMsg {
    return {
      id: isSet(object.id) ? globalThis.Number(object.id) : 0,
      userId: isSet(object.userId) ? globalThis.Number(object.userId) : 0,
      mallItem: isSet(object.mallItem) ? globalThis.String(object.mallItem) : "",
      bidupPoint: isSet(object.bidupPoint) ? globalThis.Number(object.bidupPoint) : 0,
      buyTime: isSet(object.buyTime) ? globalThis.String(object.buyTime) : "",
    };
  },

  toJSON(message: MallItemBuyMsg): unknown {
    const obj: any = {};
    if (message.id !== 0) {
      obj.id = Math.round(message.id);
    }
    if (message.userId !== 0) {
      obj.userId = Math.round(message.userId);
    }
    if (message.mallItem !== "") {
      obj.mallItem = message.mallItem;
    }
    if (message.bidupPoint !== 0) {
      obj.bidupPoint = Math.round(message.bidupPoint);
    }
    if (message.buyTime !== "") {
      obj.buyTime = message.buyTime;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MallItemBuyMsg>, I>>(base?: I): MallItemBuyMsg {
    return MallItemBuyMsg.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MallItemBuyMsg>, I>>(object: I): MallItemBuyMsg {
    const message = createBaseMallItemBuyMsg();
    message.id = object.id ?? 0;
    message.userId = object.userId ?? 0;
    message.mallItem = object.mallItem ?? "";
    message.bidupPoint = object.bidupPoint ?? 0;
    message.buyTime = object.buyTime ?? "";
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
