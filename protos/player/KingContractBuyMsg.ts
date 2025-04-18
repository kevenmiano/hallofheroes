// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.0
//   protoc               v3.21.12
// source: player/KingContractBuyMsg.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "com.road.yishi.proto.player";

export interface KingContractBuyMsg {
  ids: number[];
  use: boolean;
  friendId: number;
  friendname: string;
}

function createBaseKingContractBuyMsg(): KingContractBuyMsg {
  return { ids: [], use: false, friendId: 0, friendname: "" };
}

export const KingContractBuyMsg: MessageFns<KingContractBuyMsg> = {
  encode(message: KingContractBuyMsg, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    writer.uint32(10).fork();
    for (const v of message.ids) {
      writer.int32(v);
    }
    writer.join();
    if (message.use !== false) {
      writer.uint32(16).bool(message.use);
    }
    if (message.friendId !== 0) {
      writer.uint32(24).int32(message.friendId);
    }
    if (message.friendname !== "") {
      writer.uint32(34).string(message.friendname);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): KingContractBuyMsg {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseKingContractBuyMsg();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag === 8) {
            message.ids.push(reader.int32());

            continue;
          }

          if (tag === 10) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.ids.push(reader.int32());
            }

            continue;
          }

          break;
        }
        case 2: {
          if (tag !== 16) {
            break;
          }

          message.use = reader.bool();
          continue;
        }
        case 3: {
          if (tag !== 24) {
            break;
          }

          message.friendId = reader.int32();
          continue;
        }
        case 4: {
          if (tag !== 34) {
            break;
          }

          message.friendname = reader.string();
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

  fromJSON(object: any): KingContractBuyMsg {
    return {
      ids: globalThis.Array.isArray(object?.ids) ? object.ids.map((e: any) => globalThis.Number(e)) : [],
      use: isSet(object.use) ? globalThis.Boolean(object.use) : false,
      friendId: isSet(object.friendId) ? globalThis.Number(object.friendId) : 0,
      friendname: isSet(object.friendname) ? globalThis.String(object.friendname) : "",
    };
  },

  toJSON(message: KingContractBuyMsg): unknown {
    const obj: any = {};
    if (message.ids?.length) {
      obj.ids = message.ids.map((e) => Math.round(e));
    }
    if (message.use !== false) {
      obj.use = message.use;
    }
    if (message.friendId !== 0) {
      obj.friendId = Math.round(message.friendId);
    }
    if (message.friendname !== "") {
      obj.friendname = message.friendname;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<KingContractBuyMsg>, I>>(base?: I): KingContractBuyMsg {
    return KingContractBuyMsg.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<KingContractBuyMsg>, I>>(object: I): KingContractBuyMsg {
    const message = createBaseKingContractBuyMsg();
    message.ids = object.ids?.map((e) => e) || [];
    message.use = object.use ?? false;
    message.friendId = object.friendId ?? 0;
    message.friendname = object.friendname ?? "";
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
