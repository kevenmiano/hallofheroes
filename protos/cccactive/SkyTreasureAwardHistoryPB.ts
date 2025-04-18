// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.0
//   protoc               v3.21.12
// source: cccactive/SkyTreasureAwardHistoryPB.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "com.road.yishi.proto.cccactive";

export interface SkyTreasureAwardHistoryPB {
  desc: string;
  ranks: number[];
  self: string;
  activeId: string;
}

function createBaseSkyTreasureAwardHistoryPB(): SkyTreasureAwardHistoryPB {
  return { desc: "", ranks: [], self: "", activeId: "" };
}

export const SkyTreasureAwardHistoryPB: MessageFns<SkyTreasureAwardHistoryPB> = {
  encode(message: SkyTreasureAwardHistoryPB, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.desc !== "") {
      writer.uint32(10).string(message.desc);
    }
    writer.uint32(18).fork();
    for (const v of message.ranks) {
      writer.int32(v);
    }
    writer.join();
    if (message.self !== "") {
      writer.uint32(26).string(message.self);
    }
    if (message.activeId !== "") {
      writer.uint32(34).string(message.activeId);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): SkyTreasureAwardHistoryPB {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSkyTreasureAwardHistoryPB();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.desc = reader.string();
          continue;
        }
        case 2: {
          if (tag === 16) {
            message.ranks.push(reader.int32());

            continue;
          }

          if (tag === 18) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.ranks.push(reader.int32());
            }

            continue;
          }

          break;
        }
        case 3: {
          if (tag !== 26) {
            break;
          }

          message.self = reader.string();
          continue;
        }
        case 4: {
          if (tag !== 34) {
            break;
          }

          message.activeId = reader.string();
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

  fromJSON(object: any): SkyTreasureAwardHistoryPB {
    return {
      desc: isSet(object.desc) ? globalThis.String(object.desc) : "",
      ranks: globalThis.Array.isArray(object?.ranks) ? object.ranks.map((e: any) => globalThis.Number(e)) : [],
      self: isSet(object.self) ? globalThis.String(object.self) : "",
      activeId: isSet(object.activeId) ? globalThis.String(object.activeId) : "",
    };
  },

  toJSON(message: SkyTreasureAwardHistoryPB): unknown {
    const obj: any = {};
    if (message.desc !== "") {
      obj.desc = message.desc;
    }
    if (message.ranks?.length) {
      obj.ranks = message.ranks.map((e) => Math.round(e));
    }
    if (message.self !== "") {
      obj.self = message.self;
    }
    if (message.activeId !== "") {
      obj.activeId = message.activeId;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<SkyTreasureAwardHistoryPB>, I>>(base?: I): SkyTreasureAwardHistoryPB {
    return SkyTreasureAwardHistoryPB.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<SkyTreasureAwardHistoryPB>, I>>(object: I): SkyTreasureAwardHistoryPB {
    const message = createBaseSkyTreasureAwardHistoryPB();
    message.desc = object.desc ?? "";
    message.ranks = object.ranks?.map((e) => e) || [];
    message.self = object.self ?? "";
    message.activeId = object.activeId ?? "";
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
