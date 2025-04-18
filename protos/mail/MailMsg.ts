// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.0
//   protoc               v3.21.12
// source: mail/MailMsg.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "com.road.yishi.proto.mail";

export interface MailMsg {
  playerId: number;
  mailId: number;
  position: number[];
  mailsIdArray: number[];
  reqType: number;
}

function createBaseMailMsg(): MailMsg {
  return { playerId: 0, mailId: 0, position: [], mailsIdArray: [], reqType: 0 };
}

export const MailMsg: MessageFns<MailMsg> = {
  encode(message: MailMsg, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.playerId !== 0) {
      writer.uint32(8).int32(message.playerId);
    }
    if (message.mailId !== 0) {
      writer.uint32(16).int32(message.mailId);
    }
    writer.uint32(26).fork();
    for (const v of message.position) {
      writer.int32(v);
    }
    writer.join();
    writer.uint32(34).fork();
    for (const v of message.mailsIdArray) {
      writer.int32(v);
    }
    writer.join();
    if (message.reqType !== 0) {
      writer.uint32(40).int32(message.reqType);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): MailMsg {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMailMsg();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 8) {
            break;
          }

          message.playerId = reader.int32();
          continue;
        }
        case 2: {
          if (tag !== 16) {
            break;
          }

          message.mailId = reader.int32();
          continue;
        }
        case 3: {
          if (tag === 24) {
            message.position.push(reader.int32());

            continue;
          }

          if (tag === 26) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.position.push(reader.int32());
            }

            continue;
          }

          break;
        }
        case 4: {
          if (tag === 32) {
            message.mailsIdArray.push(reader.int32());

            continue;
          }

          if (tag === 34) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.mailsIdArray.push(reader.int32());
            }

            continue;
          }

          break;
        }
        case 5: {
          if (tag !== 40) {
            break;
          }

          message.reqType = reader.int32();
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

  fromJSON(object: any): MailMsg {
    return {
      playerId: isSet(object.playerId) ? globalThis.Number(object.playerId) : 0,
      mailId: isSet(object.mailId) ? globalThis.Number(object.mailId) : 0,
      position: globalThis.Array.isArray(object?.position) ? object.position.map((e: any) => globalThis.Number(e)) : [],
      mailsIdArray: globalThis.Array.isArray(object?.mailsIdArray)
        ? object.mailsIdArray.map((e: any) => globalThis.Number(e))
        : [],
      reqType: isSet(object.reqType) ? globalThis.Number(object.reqType) : 0,
    };
  },

  toJSON(message: MailMsg): unknown {
    const obj: any = {};
    if (message.playerId !== 0) {
      obj.playerId = Math.round(message.playerId);
    }
    if (message.mailId !== 0) {
      obj.mailId = Math.round(message.mailId);
    }
    if (message.position?.length) {
      obj.position = message.position.map((e) => Math.round(e));
    }
    if (message.mailsIdArray?.length) {
      obj.mailsIdArray = message.mailsIdArray.map((e) => Math.round(e));
    }
    if (message.reqType !== 0) {
      obj.reqType = Math.round(message.reqType);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MailMsg>, I>>(base?: I): MailMsg {
    return MailMsg.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MailMsg>, I>>(object: I): MailMsg {
    const message = createBaseMailMsg();
    message.playerId = object.playerId ?? 0;
    message.mailId = object.mailId ?? 0;
    message.position = object.position?.map((e) => e) || [];
    message.mailsIdArray = object.mailsIdArray?.map((e) => e) || [];
    message.reqType = object.reqType ?? 0;
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
