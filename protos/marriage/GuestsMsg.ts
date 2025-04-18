// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.0
//   protoc               v3.21.12
// source: marriage/GuestsMsg.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "com.road.yishi.proto.marriage";

export interface GuestsMsg {
  guestsId: number;
  guestsJob: number;
  guestsNick: string;
  isEnter: boolean;
  isViper: boolean;
}

function createBaseGuestsMsg(): GuestsMsg {
  return { guestsId: 0, guestsJob: 0, guestsNick: "", isEnter: false, isViper: false };
}

export const GuestsMsg: MessageFns<GuestsMsg> = {
  encode(message: GuestsMsg, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.guestsId !== 0) {
      writer.uint32(8).int32(message.guestsId);
    }
    if (message.guestsJob !== 0) {
      writer.uint32(16).int32(message.guestsJob);
    }
    if (message.guestsNick !== "") {
      writer.uint32(26).string(message.guestsNick);
    }
    if (message.isEnter !== false) {
      writer.uint32(32).bool(message.isEnter);
    }
    if (message.isViper !== false) {
      writer.uint32(40).bool(message.isViper);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): GuestsMsg {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGuestsMsg();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 8) {
            break;
          }

          message.guestsId = reader.int32();
          continue;
        }
        case 2: {
          if (tag !== 16) {
            break;
          }

          message.guestsJob = reader.int32();
          continue;
        }
        case 3: {
          if (tag !== 26) {
            break;
          }

          message.guestsNick = reader.string();
          continue;
        }
        case 4: {
          if (tag !== 32) {
            break;
          }

          message.isEnter = reader.bool();
          continue;
        }
        case 5: {
          if (tag !== 40) {
            break;
          }

          message.isViper = reader.bool();
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

  fromJSON(object: any): GuestsMsg {
    return {
      guestsId: isSet(object.guestsId) ? globalThis.Number(object.guestsId) : 0,
      guestsJob: isSet(object.guestsJob) ? globalThis.Number(object.guestsJob) : 0,
      guestsNick: isSet(object.guestsNick) ? globalThis.String(object.guestsNick) : "",
      isEnter: isSet(object.isEnter) ? globalThis.Boolean(object.isEnter) : false,
      isViper: isSet(object.isViper) ? globalThis.Boolean(object.isViper) : false,
    };
  },

  toJSON(message: GuestsMsg): unknown {
    const obj: any = {};
    if (message.guestsId !== 0) {
      obj.guestsId = Math.round(message.guestsId);
    }
    if (message.guestsJob !== 0) {
      obj.guestsJob = Math.round(message.guestsJob);
    }
    if (message.guestsNick !== "") {
      obj.guestsNick = message.guestsNick;
    }
    if (message.isEnter !== false) {
      obj.isEnter = message.isEnter;
    }
    if (message.isViper !== false) {
      obj.isViper = message.isViper;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GuestsMsg>, I>>(base?: I): GuestsMsg {
    return GuestsMsg.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GuestsMsg>, I>>(object: I): GuestsMsg {
    const message = createBaseGuestsMsg();
    message.guestsId = object.guestsId ?? 0;
    message.guestsJob = object.guestsJob ?? 0;
    message.guestsNick = object.guestsNick ?? "";
    message.isEnter = object.isEnter ?? false;
    message.isViper = object.isViper ?? false;
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
