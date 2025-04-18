// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.0
//   protoc               v3.21.12
// source: simple/PlayerStateListMsg.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "com.road.yishi.proto.simple";

export interface PlayerStateListMsg {
  playerState: number[];
  userId: number[];
}

function createBasePlayerStateListMsg(): PlayerStateListMsg {
  return { playerState: [], userId: [] };
}

export const PlayerStateListMsg: MessageFns<PlayerStateListMsg> = {
  encode(message: PlayerStateListMsg, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    writer.uint32(10).fork();
    for (const v of message.playerState) {
      writer.int32(v);
    }
    writer.join();
    writer.uint32(18).fork();
    for (const v of message.userId) {
      writer.int32(v);
    }
    writer.join();
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): PlayerStateListMsg {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePlayerStateListMsg();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag === 8) {
            message.playerState.push(reader.int32());

            continue;
          }

          if (tag === 10) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.playerState.push(reader.int32());
            }

            continue;
          }

          break;
        }
        case 2: {
          if (tag === 16) {
            message.userId.push(reader.int32());

            continue;
          }

          if (tag === 18) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.userId.push(reader.int32());
            }

            continue;
          }

          break;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): PlayerStateListMsg {
    return {
      playerState: globalThis.Array.isArray(object?.playerState)
        ? object.playerState.map((e: any) => globalThis.Number(e))
        : [],
      userId: globalThis.Array.isArray(object?.userId) ? object.userId.map((e: any) => globalThis.Number(e)) : [],
    };
  },

  toJSON(message: PlayerStateListMsg): unknown {
    const obj: any = {};
    if (message.playerState?.length) {
      obj.playerState = message.playerState.map((e) => Math.round(e));
    }
    if (message.userId?.length) {
      obj.userId = message.userId.map((e) => Math.round(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<PlayerStateListMsg>, I>>(base?: I): PlayerStateListMsg {
    return PlayerStateListMsg.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<PlayerStateListMsg>, I>>(object: I): PlayerStateListMsg {
    const message = createBasePlayerStateListMsg();
    message.playerState = object.playerState?.map((e) => e) || [];
    message.userId = object.userId?.map((e) => e) || [];
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

export interface MessageFns<T> {
  encode(message: T, writer?: BinaryWriter): BinaryWriter;
  decode(input: BinaryReader | Uint8Array, length?: number): T;
  fromJSON(object: any): T;
  toJSON(message: T): unknown;
  create<I extends Exact<DeepPartial<T>, I>>(base?: I): T;
  fromPartial<I extends Exact<DeepPartial<T>, I>>(object: I): T;
}
