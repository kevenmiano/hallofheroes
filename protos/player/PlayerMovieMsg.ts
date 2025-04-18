// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.0
//   protoc               v3.21.12
// source: player/PlayerMovieMsg.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "com.road.yishi.proto.player";

export interface PlayerMovieMsg {
  movieTargetType: number;
  targetId: number;
  movieType: string;
  delay: number;
  mapId: number;
}

function createBasePlayerMovieMsg(): PlayerMovieMsg {
  return { movieTargetType: 0, targetId: 0, movieType: "", delay: 0, mapId: 0 };
}

export const PlayerMovieMsg: MessageFns<PlayerMovieMsg> = {
  encode(message: PlayerMovieMsg, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.movieTargetType !== 0) {
      writer.uint32(8).int32(message.movieTargetType);
    }
    if (message.targetId !== 0) {
      writer.uint32(16).int32(message.targetId);
    }
    if (message.movieType !== "") {
      writer.uint32(26).string(message.movieType);
    }
    if (message.delay !== 0) {
      writer.uint32(32).int32(message.delay);
    }
    if (message.mapId !== 0) {
      writer.uint32(40).int32(message.mapId);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): PlayerMovieMsg {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePlayerMovieMsg();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 8) {
            break;
          }

          message.movieTargetType = reader.int32();
          continue;
        }
        case 2: {
          if (tag !== 16) {
            break;
          }

          message.targetId = reader.int32();
          continue;
        }
        case 3: {
          if (tag !== 26) {
            break;
          }

          message.movieType = reader.string();
          continue;
        }
        case 4: {
          if (tag !== 32) {
            break;
          }

          message.delay = reader.int32();
          continue;
        }
        case 5: {
          if (tag !== 40) {
            break;
          }

          message.mapId = reader.int32();
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

  fromJSON(object: any): PlayerMovieMsg {
    return {
      movieTargetType: isSet(object.movieTargetType) ? globalThis.Number(object.movieTargetType) : 0,
      targetId: isSet(object.targetId) ? globalThis.Number(object.targetId) : 0,
      movieType: isSet(object.movieType) ? globalThis.String(object.movieType) : "",
      delay: isSet(object.delay) ? globalThis.Number(object.delay) : 0,
      mapId: isSet(object.mapId) ? globalThis.Number(object.mapId) : 0,
    };
  },

  toJSON(message: PlayerMovieMsg): unknown {
    const obj: any = {};
    if (message.movieTargetType !== 0) {
      obj.movieTargetType = Math.round(message.movieTargetType);
    }
    if (message.targetId !== 0) {
      obj.targetId = Math.round(message.targetId);
    }
    if (message.movieType !== "") {
      obj.movieType = message.movieType;
    }
    if (message.delay !== 0) {
      obj.delay = Math.round(message.delay);
    }
    if (message.mapId !== 0) {
      obj.mapId = Math.round(message.mapId);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<PlayerMovieMsg>, I>>(base?: I): PlayerMovieMsg {
    return PlayerMovieMsg.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<PlayerMovieMsg>, I>>(object: I): PlayerMovieMsg {
    const message = createBasePlayerMovieMsg();
    message.movieTargetType = object.movieTargetType ?? 0;
    message.targetId = object.targetId ?? 0;
    message.movieType = object.movieType ?? "";
    message.delay = object.delay ?? 0;
    message.mapId = object.mapId ?? 0;
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
