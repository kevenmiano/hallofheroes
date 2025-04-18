// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.0
//   protoc               v3.21.12
// source: item/ItemUseMsg.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "com.road.yishi.proto.item";

export interface ItemUseMsg {
  pos: number;
  count: number;
  bagType: number;
  battleId: string;
  friendId: number;
  selectItemInfos: number[];
}

function createBaseItemUseMsg(): ItemUseMsg {
  return { pos: 0, count: 0, bagType: 0, battleId: "", friendId: 0, selectItemInfos: [] };
}

export const ItemUseMsg: MessageFns<ItemUseMsg> = {
  encode(message: ItemUseMsg, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.pos !== 0) {
      writer.uint32(8).int32(message.pos);
    }
    if (message.count !== 0) {
      writer.uint32(16).int32(message.count);
    }
    if (message.bagType !== 0) {
      writer.uint32(24).int32(message.bagType);
    }
    if (message.battleId !== "") {
      writer.uint32(34).string(message.battleId);
    }
    if (message.friendId !== 0) {
      writer.uint32(40).int32(message.friendId);
    }
    writer.uint32(50).fork();
    for (const v of message.selectItemInfos) {
      writer.int32(v);
    }
    writer.join();
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): ItemUseMsg {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseItemUseMsg();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 8) {
            break;
          }

          message.pos = reader.int32();
          continue;
        }
        case 2: {
          if (tag !== 16) {
            break;
          }

          message.count = reader.int32();
          continue;
        }
        case 3: {
          if (tag !== 24) {
            break;
          }

          message.bagType = reader.int32();
          continue;
        }
        case 4: {
          if (tag !== 34) {
            break;
          }

          message.battleId = reader.string();
          continue;
        }
        case 5: {
          if (tag !== 40) {
            break;
          }

          message.friendId = reader.int32();
          continue;
        }
        case 6: {
          if (tag === 48) {
            message.selectItemInfos.push(reader.int32());

            continue;
          }

          if (tag === 50) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.selectItemInfos.push(reader.int32());
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

  fromJSON(object: any): ItemUseMsg {
    return {
      pos: isSet(object.pos) ? globalThis.Number(object.pos) : 0,
      count: isSet(object.count) ? globalThis.Number(object.count) : 0,
      bagType: isSet(object.bagType) ? globalThis.Number(object.bagType) : 0,
      battleId: isSet(object.battleId) ? globalThis.String(object.battleId) : "",
      friendId: isSet(object.friendId) ? globalThis.Number(object.friendId) : 0,
      selectItemInfos: globalThis.Array.isArray(object?.selectItemInfos)
        ? object.selectItemInfos.map((e: any) => globalThis.Number(e))
        : [],
    };
  },

  toJSON(message: ItemUseMsg): unknown {
    const obj: any = {};
    if (message.pos !== 0) {
      obj.pos = Math.round(message.pos);
    }
    if (message.count !== 0) {
      obj.count = Math.round(message.count);
    }
    if (message.bagType !== 0) {
      obj.bagType = Math.round(message.bagType);
    }
    if (message.battleId !== "") {
      obj.battleId = message.battleId;
    }
    if (message.friendId !== 0) {
      obj.friendId = Math.round(message.friendId);
    }
    if (message.selectItemInfos?.length) {
      obj.selectItemInfos = message.selectItemInfos.map((e) => Math.round(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ItemUseMsg>, I>>(base?: I): ItemUseMsg {
    return ItemUseMsg.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ItemUseMsg>, I>>(object: I): ItemUseMsg {
    const message = createBaseItemUseMsg();
    message.pos = object.pos ?? 0;
    message.count = object.count ?? 0;
    message.bagType = object.bagType ?? 0;
    message.battleId = object.battleId ?? "";
    message.friendId = object.friendId ?? 0;
    message.selectItemInfos = object.selectItemInfos?.map((e) => e) || [];
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
