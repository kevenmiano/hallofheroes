// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.0
//   protoc               v3.21.12
// source: player/PlayerOpMsg.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "com.road.yishi.proto.player";

export interface PlayerOpMsg {
  op: number;
  type: number;
  payType: number;
  count: number;
  id: number;
  index: number;
  userId: number;
  templateId: number;
  campaignId: number;
  nodeId: number;
  chapterId: number;
  uuid: string;
  value1: number;
  value2: number;
  param1: string;
  param2: string;
  flag1: boolean;
  flag2: boolean;
  pos: number;
  ids: number[];
}

function createBasePlayerOpMsg(): PlayerOpMsg {
  return {
    op: 0,
    type: 0,
    payType: 0,
    count: 0,
    id: 0,
    index: 0,
    userId: 0,
    templateId: 0,
    campaignId: 0,
    nodeId: 0,
    chapterId: 0,
    uuid: "",
    value1: 0,
    value2: 0,
    param1: "",
    param2: "",
    flag1: false,
    flag2: false,
    pos: 0,
    ids: [],
  };
}

export const PlayerOpMsg: MessageFns<PlayerOpMsg> = {
  encode(message: PlayerOpMsg, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.op !== 0) {
      writer.uint32(8).int32(message.op);
    }
    if (message.type !== 0) {
      writer.uint32(16).int32(message.type);
    }
    if (message.payType !== 0) {
      writer.uint32(24).int32(message.payType);
    }
    if (message.count !== 0) {
      writer.uint32(32).int32(message.count);
    }
    if (message.id !== 0) {
      writer.uint32(40).int32(message.id);
    }
    if (message.index !== 0) {
      writer.uint32(48).int32(message.index);
    }
    if (message.userId !== 0) {
      writer.uint32(56).int32(message.userId);
    }
    if (message.templateId !== 0) {
      writer.uint32(64).int32(message.templateId);
    }
    if (message.campaignId !== 0) {
      writer.uint32(72).int32(message.campaignId);
    }
    if (message.nodeId !== 0) {
      writer.uint32(80).int32(message.nodeId);
    }
    if (message.chapterId !== 0) {
      writer.uint32(88).int32(message.chapterId);
    }
    if (message.uuid !== "") {
      writer.uint32(98).string(message.uuid);
    }
    if (message.value1 !== 0) {
      writer.uint32(104).int32(message.value1);
    }
    if (message.value2 !== 0) {
      writer.uint32(112).int32(message.value2);
    }
    if (message.param1 !== "") {
      writer.uint32(122).string(message.param1);
    }
    if (message.param2 !== "") {
      writer.uint32(130).string(message.param2);
    }
    if (message.flag1 !== false) {
      writer.uint32(136).bool(message.flag1);
    }
    if (message.flag2 !== false) {
      writer.uint32(144).bool(message.flag2);
    }
    if (message.pos !== 0) {
      writer.uint32(152).int32(message.pos);
    }
    writer.uint32(162).fork();
    for (const v of message.ids) {
      writer.int32(v);
    }
    writer.join();
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): PlayerOpMsg {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePlayerOpMsg();
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

          message.type = reader.int32();
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

          message.count = reader.int32();
          continue;
        }
        case 5: {
          if (tag !== 40) {
            break;
          }

          message.id = reader.int32();
          continue;
        }
        case 6: {
          if (tag !== 48) {
            break;
          }

          message.index = reader.int32();
          continue;
        }
        case 7: {
          if (tag !== 56) {
            break;
          }

          message.userId = reader.int32();
          continue;
        }
        case 8: {
          if (tag !== 64) {
            break;
          }

          message.templateId = reader.int32();
          continue;
        }
        case 9: {
          if (tag !== 72) {
            break;
          }

          message.campaignId = reader.int32();
          continue;
        }
        case 10: {
          if (tag !== 80) {
            break;
          }

          message.nodeId = reader.int32();
          continue;
        }
        case 11: {
          if (tag !== 88) {
            break;
          }

          message.chapterId = reader.int32();
          continue;
        }
        case 12: {
          if (tag !== 98) {
            break;
          }

          message.uuid = reader.string();
          continue;
        }
        case 13: {
          if (tag !== 104) {
            break;
          }

          message.value1 = reader.int32();
          continue;
        }
        case 14: {
          if (tag !== 112) {
            break;
          }

          message.value2 = reader.int32();
          continue;
        }
        case 15: {
          if (tag !== 122) {
            break;
          }

          message.param1 = reader.string();
          continue;
        }
        case 16: {
          if (tag !== 130) {
            break;
          }

          message.param2 = reader.string();
          continue;
        }
        case 17: {
          if (tag !== 136) {
            break;
          }

          message.flag1 = reader.bool();
          continue;
        }
        case 18: {
          if (tag !== 144) {
            break;
          }

          message.flag2 = reader.bool();
          continue;
        }
        case 19: {
          if (tag !== 152) {
            break;
          }

          message.pos = reader.int32();
          continue;
        }
        case 20: {
          if (tag === 160) {
            message.ids.push(reader.int32());

            continue;
          }

          if (tag === 162) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.ids.push(reader.int32());
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

  fromJSON(object: any): PlayerOpMsg {
    return {
      op: isSet(object.op) ? globalThis.Number(object.op) : 0,
      type: isSet(object.type) ? globalThis.Number(object.type) : 0,
      payType: isSet(object.payType) ? globalThis.Number(object.payType) : 0,
      count: isSet(object.count) ? globalThis.Number(object.count) : 0,
      id: isSet(object.id) ? globalThis.Number(object.id) : 0,
      index: isSet(object.index) ? globalThis.Number(object.index) : 0,
      userId: isSet(object.userId) ? globalThis.Number(object.userId) : 0,
      templateId: isSet(object.templateId) ? globalThis.Number(object.templateId) : 0,
      campaignId: isSet(object.campaignId) ? globalThis.Number(object.campaignId) : 0,
      nodeId: isSet(object.nodeId) ? globalThis.Number(object.nodeId) : 0,
      chapterId: isSet(object.chapterId) ? globalThis.Number(object.chapterId) : 0,
      uuid: isSet(object.uuid) ? globalThis.String(object.uuid) : "",
      value1: isSet(object.value1) ? globalThis.Number(object.value1) : 0,
      value2: isSet(object.value2) ? globalThis.Number(object.value2) : 0,
      param1: isSet(object.param1) ? globalThis.String(object.param1) : "",
      param2: isSet(object.param2) ? globalThis.String(object.param2) : "",
      flag1: isSet(object.flag1) ? globalThis.Boolean(object.flag1) : false,
      flag2: isSet(object.flag2) ? globalThis.Boolean(object.flag2) : false,
      pos: isSet(object.pos) ? globalThis.Number(object.pos) : 0,
      ids: globalThis.Array.isArray(object?.ids) ? object.ids.map((e: any) => globalThis.Number(e)) : [],
    };
  },

  toJSON(message: PlayerOpMsg): unknown {
    const obj: any = {};
    if (message.op !== 0) {
      obj.op = Math.round(message.op);
    }
    if (message.type !== 0) {
      obj.type = Math.round(message.type);
    }
    if (message.payType !== 0) {
      obj.payType = Math.round(message.payType);
    }
    if (message.count !== 0) {
      obj.count = Math.round(message.count);
    }
    if (message.id !== 0) {
      obj.id = Math.round(message.id);
    }
    if (message.index !== 0) {
      obj.index = Math.round(message.index);
    }
    if (message.userId !== 0) {
      obj.userId = Math.round(message.userId);
    }
    if (message.templateId !== 0) {
      obj.templateId = Math.round(message.templateId);
    }
    if (message.campaignId !== 0) {
      obj.campaignId = Math.round(message.campaignId);
    }
    if (message.nodeId !== 0) {
      obj.nodeId = Math.round(message.nodeId);
    }
    if (message.chapterId !== 0) {
      obj.chapterId = Math.round(message.chapterId);
    }
    if (message.uuid !== "") {
      obj.uuid = message.uuid;
    }
    if (message.value1 !== 0) {
      obj.value1 = Math.round(message.value1);
    }
    if (message.value2 !== 0) {
      obj.value2 = Math.round(message.value2);
    }
    if (message.param1 !== "") {
      obj.param1 = message.param1;
    }
    if (message.param2 !== "") {
      obj.param2 = message.param2;
    }
    if (message.flag1 !== false) {
      obj.flag1 = message.flag1;
    }
    if (message.flag2 !== false) {
      obj.flag2 = message.flag2;
    }
    if (message.pos !== 0) {
      obj.pos = Math.round(message.pos);
    }
    if (message.ids?.length) {
      obj.ids = message.ids.map((e) => Math.round(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<PlayerOpMsg>, I>>(base?: I): PlayerOpMsg {
    return PlayerOpMsg.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<PlayerOpMsg>, I>>(object: I): PlayerOpMsg {
    const message = createBasePlayerOpMsg();
    message.op = object.op ?? 0;
    message.type = object.type ?? 0;
    message.payType = object.payType ?? 0;
    message.count = object.count ?? 0;
    message.id = object.id ?? 0;
    message.index = object.index ?? 0;
    message.userId = object.userId ?? 0;
    message.templateId = object.templateId ?? 0;
    message.campaignId = object.campaignId ?? 0;
    message.nodeId = object.nodeId ?? 0;
    message.chapterId = object.chapterId ?? 0;
    message.uuid = object.uuid ?? "";
    message.value1 = object.value1 ?? 0;
    message.value2 = object.value2 ?? 0;
    message.param1 = object.param1 ?? "";
    message.param2 = object.param2 ?? "";
    message.flag1 = object.flag1 ?? false;
    message.flag2 = object.flag2 ?? false;
    message.pos = object.pos ?? 0;
    message.ids = object.ids?.map((e) => e) || [];
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
