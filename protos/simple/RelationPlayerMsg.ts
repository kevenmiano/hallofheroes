// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.0
//   protoc               v3.21.12
// source: simple/RelationPlayerMsg.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "com.road.yishi.proto.simple";

export interface RelationPlayerMsg {
  relation: number;
  friendRp: number;
  friendGrade: number;
  groupId: number;
  player: string;
  snsInfo: string;
  from: number;
  isVip: number;
  tarRelation: number;
}

function createBaseRelationPlayerMsg(): RelationPlayerMsg {
  return {
    relation: 0,
    friendRp: 0,
    friendGrade: 0,
    groupId: 0,
    player: "",
    snsInfo: "",
    from: 0,
    isVip: 0,
    tarRelation: 0,
  };
}

export const RelationPlayerMsg: MessageFns<RelationPlayerMsg> = {
  encode(message: RelationPlayerMsg, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.relation !== 0) {
      writer.uint32(8).int32(message.relation);
    }
    if (message.friendRp !== 0) {
      writer.uint32(16).int32(message.friendRp);
    }
    if (message.friendGrade !== 0) {
      writer.uint32(24).int32(message.friendGrade);
    }
    if (message.groupId !== 0) {
      writer.uint32(32).int32(message.groupId);
    }
    if (message.player !== "") {
      writer.uint32(42).string(message.player);
    }
    if (message.snsInfo !== "") {
      writer.uint32(50).string(message.snsInfo);
    }
    if (message.from !== 0) {
      writer.uint32(56).int32(message.from);
    }
    if (message.isVip !== 0) {
      writer.uint32(64).int32(message.isVip);
    }
    if (message.tarRelation !== 0) {
      writer.uint32(72).int32(message.tarRelation);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): RelationPlayerMsg {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRelationPlayerMsg();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 8) {
            break;
          }

          message.relation = reader.int32();
          continue;
        }
        case 2: {
          if (tag !== 16) {
            break;
          }

          message.friendRp = reader.int32();
          continue;
        }
        case 3: {
          if (tag !== 24) {
            break;
          }

          message.friendGrade = reader.int32();
          continue;
        }
        case 4: {
          if (tag !== 32) {
            break;
          }

          message.groupId = reader.int32();
          continue;
        }
        case 5: {
          if (tag !== 42) {
            break;
          }

          message.player = reader.string();
          continue;
        }
        case 6: {
          if (tag !== 50) {
            break;
          }

          message.snsInfo = reader.string();
          continue;
        }
        case 7: {
          if (tag !== 56) {
            break;
          }

          message.from = reader.int32();
          continue;
        }
        case 8: {
          if (tag !== 64) {
            break;
          }

          message.isVip = reader.int32();
          continue;
        }
        case 9: {
          if (tag !== 72) {
            break;
          }

          message.tarRelation = reader.int32();
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

  fromJSON(object: any): RelationPlayerMsg {
    return {
      relation: isSet(object.relation) ? globalThis.Number(object.relation) : 0,
      friendRp: isSet(object.friendRp) ? globalThis.Number(object.friendRp) : 0,
      friendGrade: isSet(object.friendGrade) ? globalThis.Number(object.friendGrade) : 0,
      groupId: isSet(object.groupId) ? globalThis.Number(object.groupId) : 0,
      player: isSet(object.player) ? globalThis.String(object.player) : "",
      snsInfo: isSet(object.snsInfo) ? globalThis.String(object.snsInfo) : "",
      from: isSet(object.from) ? globalThis.Number(object.from) : 0,
      isVip: isSet(object.isVip) ? globalThis.Number(object.isVip) : 0,
      tarRelation: isSet(object.tarRelation) ? globalThis.Number(object.tarRelation) : 0,
    };
  },

  toJSON(message: RelationPlayerMsg): unknown {
    const obj: any = {};
    if (message.relation !== 0) {
      obj.relation = Math.round(message.relation);
    }
    if (message.friendRp !== 0) {
      obj.friendRp = Math.round(message.friendRp);
    }
    if (message.friendGrade !== 0) {
      obj.friendGrade = Math.round(message.friendGrade);
    }
    if (message.groupId !== 0) {
      obj.groupId = Math.round(message.groupId);
    }
    if (message.player !== "") {
      obj.player = message.player;
    }
    if (message.snsInfo !== "") {
      obj.snsInfo = message.snsInfo;
    }
    if (message.from !== 0) {
      obj.from = Math.round(message.from);
    }
    if (message.isVip !== 0) {
      obj.isVip = Math.round(message.isVip);
    }
    if (message.tarRelation !== 0) {
      obj.tarRelation = Math.round(message.tarRelation);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<RelationPlayerMsg>, I>>(base?: I): RelationPlayerMsg {
    return RelationPlayerMsg.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<RelationPlayerMsg>, I>>(object: I): RelationPlayerMsg {
    const message = createBaseRelationPlayerMsg();
    message.relation = object.relation ?? 0;
    message.friendRp = object.friendRp ?? 0;
    message.friendGrade = object.friendGrade ?? 0;
    message.groupId = object.groupId ?? 0;
    message.player = object.player ?? "";
    message.snsInfo = object.snsInfo ?? "";
    message.from = object.from ?? 0;
    message.isVip = object.isVip ?? 0;
    message.tarRelation = object.tarRelation ?? 0;
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
