// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.0
//   protoc               v3.21.12
// source: player/PlayerSignReqMsg.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "com.road.yishi.proto.player";

export interface PlayerSignReqMsg {
  optType: number;
  prizeSite: number;
  payType: number;
  index: number;
}

function createBasePlayerSignReqMsg(): PlayerSignReqMsg {
  return { optType: 0, prizeSite: 0, payType: 0, index: 0 };
}

export const PlayerSignReqMsg: MessageFns<PlayerSignReqMsg> = {
  encode(message: PlayerSignReqMsg, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.optType !== 0) {
      writer.uint32(8).int32(message.optType);
    }
    if (message.prizeSite !== 0) {
      writer.uint32(16).int32(message.prizeSite);
    }
    if (message.payType !== 0) {
      writer.uint32(24).int32(message.payType);
    }
    if (message.index !== 0) {
      writer.uint32(32).int32(message.index);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): PlayerSignReqMsg {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePlayerSignReqMsg();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 8) {
            break;
          }

          message.optType = reader.int32();
          continue;
        }
        case 2: {
          if (tag !== 16) {
            break;
          }

          message.prizeSite = reader.int32();
          continue;
        }
        case 3: {
          if (tag !== 24) {
            break;
          }

          message.payType = reader.int32();
          continue;
        }
        case 4: {
          if (tag !== 32) {
            break;
          }

          message.index = reader.int32();
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

  fromJSON(object: any): PlayerSignReqMsg {
    return {
      optType: isSet(object.optType) ? globalThis.Number(object.optType) : 0,
      prizeSite: isSet(object.prizeSite) ? globalThis.Number(object.prizeSite) : 0,
      payType: isSet(object.payType) ? globalThis.Number(object.payType) : 0,
      index: isSet(object.index) ? globalThis.Number(object.index) : 0,
    };
  },

  toJSON(message: PlayerSignReqMsg): unknown {
    const obj: any = {};
    if (message.optType !== 0) {
      obj.optType = Math.round(message.optType);
    }
    if (message.prizeSite !== 0) {
      obj.prizeSite = Math.round(message.prizeSite);
    }
    if (message.payType !== 0) {
      obj.payType = Math.round(message.payType);
    }
    if (message.index !== 0) {
      obj.index = Math.round(message.index);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<PlayerSignReqMsg>, I>>(base?: I): PlayerSignReqMsg {
    return PlayerSignReqMsg.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<PlayerSignReqMsg>, I>>(object: I): PlayerSignReqMsg {
    const message = createBasePlayerSignReqMsg();
    message.optType = object.optType ?? 0;
    message.prizeSite = object.prizeSite ?? 0;
    message.payType = object.payType ?? 0;
    message.index = object.index ?? 0;
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
