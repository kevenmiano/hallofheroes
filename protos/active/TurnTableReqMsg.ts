// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.0
//   protoc               v3.21.12
// source: active/TurnTableReqMsg.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "com.road.yishi.proto.active";

export interface TurnTableReqMsg {
  opType: number;
  turntableId: number;
  drawType: number;
  payType: number;
}

function createBaseTurnTableReqMsg(): TurnTableReqMsg {
  return { opType: 0, turntableId: 0, drawType: 0, payType: 0 };
}

export const TurnTableReqMsg: MessageFns<TurnTableReqMsg> = {
  encode(message: TurnTableReqMsg, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.opType !== 0) {
      writer.uint32(8).int32(message.opType);
    }
    if (message.turntableId !== 0) {
      writer.uint32(16).int32(message.turntableId);
    }
    if (message.drawType !== 0) {
      writer.uint32(24).int32(message.drawType);
    }
    if (message.payType !== 0) {
      writer.uint32(32).int32(message.payType);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): TurnTableReqMsg {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTurnTableReqMsg();
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

          message.turntableId = reader.int32();
          continue;
        }
        case 3: {
          if (tag !== 24) {
            break;
          }

          message.drawType = reader.int32();
          continue;
        }
        case 4: {
          if (tag !== 32) {
            break;
          }

          message.payType = reader.int32();
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

  fromJSON(object: any): TurnTableReqMsg {
    return {
      opType: isSet(object.opType) ? globalThis.Number(object.opType) : 0,
      turntableId: isSet(object.turntableId) ? globalThis.Number(object.turntableId) : 0,
      drawType: isSet(object.drawType) ? globalThis.Number(object.drawType) : 0,
      payType: isSet(object.payType) ? globalThis.Number(object.payType) : 0,
    };
  },

  toJSON(message: TurnTableReqMsg): unknown {
    const obj: any = {};
    if (message.opType !== 0) {
      obj.opType = Math.round(message.opType);
    }
    if (message.turntableId !== 0) {
      obj.turntableId = Math.round(message.turntableId);
    }
    if (message.drawType !== 0) {
      obj.drawType = Math.round(message.drawType);
    }
    if (message.payType !== 0) {
      obj.payType = Math.round(message.payType);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<TurnTableReqMsg>, I>>(base?: I): TurnTableReqMsg {
    return TurnTableReqMsg.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<TurnTableReqMsg>, I>>(object: I): TurnTableReqMsg {
    const message = createBaseTurnTableReqMsg();
    message.opType = object.opType ?? 0;
    message.turntableId = object.turntableId ?? 0;
    message.drawType = object.drawType ?? 0;
    message.payType = object.payType ?? 0;
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
