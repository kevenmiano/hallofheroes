// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.0
//   protoc               v3.21.12
// source: uiplay/UiPlayChallengeMsg.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "com.road.yishi.proto.uiplay";

export interface UiPlayChallengeMsg {
  op: number;
  playId: number;
  levelID: number;
}

function createBaseUiPlayChallengeMsg(): UiPlayChallengeMsg {
  return { op: 0, playId: 0, levelID: 0 };
}

export const UiPlayChallengeMsg: MessageFns<UiPlayChallengeMsg> = {
  encode(message: UiPlayChallengeMsg, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.op !== 0) {
      writer.uint32(8).int32(message.op);
    }
    if (message.playId !== 0) {
      writer.uint32(16).int32(message.playId);
    }
    if (message.levelID !== 0) {
      writer.uint32(24).int32(message.levelID);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): UiPlayChallengeMsg {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUiPlayChallengeMsg();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 8) {
            break;
          }

          message.op = reader.int32();
          continue;
        }
        case 2: {
          if (tag !== 16) {
            break;
          }

          message.playId = reader.int32();
          continue;
        }
        case 3: {
          if (tag !== 24) {
            break;
          }

          message.levelID = reader.int32();
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

  fromJSON(object: any): UiPlayChallengeMsg {
    return {
      op: isSet(object.op) ? globalThis.Number(object.op) : 0,
      playId: isSet(object.playId) ? globalThis.Number(object.playId) : 0,
      levelID: isSet(object.levelID) ? globalThis.Number(object.levelID) : 0,
    };
  },

  toJSON(message: UiPlayChallengeMsg): unknown {
    const obj: any = {};
    if (message.op !== 0) {
      obj.op = Math.round(message.op);
    }
    if (message.playId !== 0) {
      obj.playId = Math.round(message.playId);
    }
    if (message.levelID !== 0) {
      obj.levelID = Math.round(message.levelID);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<UiPlayChallengeMsg>, I>>(base?: I): UiPlayChallengeMsg {
    return UiPlayChallengeMsg.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<UiPlayChallengeMsg>, I>>(object: I): UiPlayChallengeMsg {
    const message = createBaseUiPlayChallengeMsg();
    message.op = object.op ?? 0;
    message.playId = object.playId ?? 0;
    message.levelID = object.levelID ?? 0;
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
