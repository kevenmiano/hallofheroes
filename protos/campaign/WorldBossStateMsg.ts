// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.0
//   protoc               v3.21.12
// source: campaign/WorldBossStateMsg.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "com.road.yishi.proto.campaign";

export interface WorldBossStateMsg {
  worldBossInfo: number[];
}

function createBaseWorldBossStateMsg(): WorldBossStateMsg {
  return { worldBossInfo: [] };
}

export const WorldBossStateMsg: MessageFns<WorldBossStateMsg> = {
  encode(message: WorldBossStateMsg, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    writer.uint32(10).fork();
    for (const v of message.worldBossInfo) {
      writer.int32(v);
    }
    writer.join();
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): WorldBossStateMsg {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseWorldBossStateMsg();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag === 8) {
            message.worldBossInfo.push(reader.int32());

            continue;
          }

          if (tag === 10) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.worldBossInfo.push(reader.int32());
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

  fromJSON(object: any): WorldBossStateMsg {
    return {
      worldBossInfo: globalThis.Array.isArray(object?.worldBossInfo)
        ? object.worldBossInfo.map((e: any) => globalThis.Number(e))
        : [],
    };
  },

  toJSON(message: WorldBossStateMsg): unknown {
    const obj: any = {};
    if (message.worldBossInfo?.length) {
      obj.worldBossInfo = message.worldBossInfo.map((e) => Math.round(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<WorldBossStateMsg>, I>>(base?: I): WorldBossStateMsg {
    return WorldBossStateMsg.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<WorldBossStateMsg>, I>>(object: I): WorldBossStateMsg {
    const message = createBaseWorldBossStateMsg();
    message.worldBossInfo = object.worldBossInfo?.map((e) => e) || [];
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
