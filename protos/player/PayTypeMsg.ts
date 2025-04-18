// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.0
//   protoc               v3.21.12
// source: player/PayTypeMsg.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "com.road.yishi.proto.player";

export interface PayTypeMsg {
  payType: number;
  property1: number;
  property2: number;
  type: number;
}

function createBasePayTypeMsg(): PayTypeMsg {
  return { payType: 0, property1: 0, property2: 0, type: 0 };
}

export const PayTypeMsg: MessageFns<PayTypeMsg> = {
  encode(message: PayTypeMsg, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.payType !== 0) {
      writer.uint32(8).int32(message.payType);
    }
    if (message.property1 !== 0) {
      writer.uint32(16).int32(message.property1);
    }
    if (message.property2 !== 0) {
      writer.uint32(24).int32(message.property2);
    }
    if (message.type !== 0) {
      writer.uint32(32).int32(message.type);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): PayTypeMsg {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePayTypeMsg();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 8) {
            break;
          }

          message.payType = reader.int32();
          continue;
        }
        case 2: {
          if (tag !== 16) {
            break;
          }

          message.property1 = reader.int32();
          continue;
        }
        case 3: {
          if (tag !== 24) {
            break;
          }

          message.property2 = reader.int32();
          continue;
        }
        case 4: {
          if (tag !== 32) {
            break;
          }

          message.type = reader.int32();
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

  fromJSON(object: any): PayTypeMsg {
    return {
      payType: isSet(object.payType) ? globalThis.Number(object.payType) : 0,
      property1: isSet(object.property1) ? globalThis.Number(object.property1) : 0,
      property2: isSet(object.property2) ? globalThis.Number(object.property2) : 0,
      type: isSet(object.type) ? globalThis.Number(object.type) : 0,
    };
  },

  toJSON(message: PayTypeMsg): unknown {
    const obj: any = {};
    if (message.payType !== 0) {
      obj.payType = Math.round(message.payType);
    }
    if (message.property1 !== 0) {
      obj.property1 = Math.round(message.property1);
    }
    if (message.property2 !== 0) {
      obj.property2 = Math.round(message.property2);
    }
    if (message.type !== 0) {
      obj.type = Math.round(message.type);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<PayTypeMsg>, I>>(base?: I): PayTypeMsg {
    return PayTypeMsg.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<PayTypeMsg>, I>>(object: I): PayTypeMsg {
    const message = createBasePayTypeMsg();
    message.payType = object.payType ?? 0;
    message.property1 = object.property1 ?? 0;
    message.property2 = object.property2 ?? 0;
    message.type = object.type ?? 0;
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
