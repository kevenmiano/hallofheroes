// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.0
//   protoc               v3.21.12
// source: outcitywar/OutCityWarDeclearReq.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "com.road.yishi.proto.outcitywar";

export interface OutCityWarDeclearReq {
  nodeId: number;
  buildId: number;
  orderId: number;
}

function createBaseOutCityWarDeclearReq(): OutCityWarDeclearReq {
  return { nodeId: 0, buildId: 0, orderId: 0 };
}

export const OutCityWarDeclearReq: MessageFns<OutCityWarDeclearReq> = {
  encode(message: OutCityWarDeclearReq, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.nodeId !== 0) {
      writer.uint32(8).int32(message.nodeId);
    }
    if (message.buildId !== 0) {
      writer.uint32(16).int32(message.buildId);
    }
    if (message.orderId !== 0) {
      writer.uint32(24).int32(message.orderId);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): OutCityWarDeclearReq {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseOutCityWarDeclearReq();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 8) {
            break;
          }

          message.nodeId = reader.int32();
          continue;
        }
        case 2: {
          if (tag !== 16) {
            break;
          }

          message.buildId = reader.int32();
          continue;
        }
        case 3: {
          if (tag !== 24) {
            break;
          }

          message.orderId = reader.int32();
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

  fromJSON(object: any): OutCityWarDeclearReq {
    return {
      nodeId: isSet(object.nodeId) ? globalThis.Number(object.nodeId) : 0,
      buildId: isSet(object.buildId) ? globalThis.Number(object.buildId) : 0,
      orderId: isSet(object.orderId) ? globalThis.Number(object.orderId) : 0,
    };
  },

  toJSON(message: OutCityWarDeclearReq): unknown {
    const obj: any = {};
    if (message.nodeId !== 0) {
      obj.nodeId = Math.round(message.nodeId);
    }
    if (message.buildId !== 0) {
      obj.buildId = Math.round(message.buildId);
    }
    if (message.orderId !== 0) {
      obj.orderId = Math.round(message.orderId);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<OutCityWarDeclearReq>, I>>(base?: I): OutCityWarDeclearReq {
    return OutCityWarDeclearReq.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<OutCityWarDeclearReq>, I>>(object: I): OutCityWarDeclearReq {
    const message = createBaseOutCityWarDeclearReq();
    message.nodeId = object.nodeId ?? 0;
    message.buildId = object.buildId ?? 0;
    message.orderId = object.orderId ?? 0;
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
