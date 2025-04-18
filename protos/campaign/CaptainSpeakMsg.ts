// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.0
//   protoc               v3.21.12
// source: campaign/CaptainSpeakMsg.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "com.road.yishi.proto.campaign";

export interface CaptainSpeakMsg {
  cmapaignName: string;
  roomId: number;
  isLock: number;
  inviteContent: number[];
}

function createBaseCaptainSpeakMsg(): CaptainSpeakMsg {
  return { cmapaignName: "", roomId: 0, isLock: 0, inviteContent: [] };
}

export const CaptainSpeakMsg: MessageFns<CaptainSpeakMsg> = {
  encode(message: CaptainSpeakMsg, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.cmapaignName !== "") {
      writer.uint32(10).string(message.cmapaignName);
    }
    if (message.roomId !== 0) {
      writer.uint32(16).int32(message.roomId);
    }
    if (message.isLock !== 0) {
      writer.uint32(24).int32(message.isLock);
    }
    writer.uint32(34).fork();
    for (const v of message.inviteContent) {
      writer.int32(v);
    }
    writer.join();
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): CaptainSpeakMsg {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCaptainSpeakMsg();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.cmapaignName = reader.string();
          continue;
        }
        case 2: {
          if (tag !== 16) {
            break;
          }

          message.roomId = reader.int32();
          continue;
        }
        case 3: {
          if (tag !== 24) {
            break;
          }

          message.isLock = reader.int32();
          continue;
        }
        case 4: {
          if (tag === 32) {
            message.inviteContent.push(reader.int32());

            continue;
          }

          if (tag === 34) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.inviteContent.push(reader.int32());
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

  fromJSON(object: any): CaptainSpeakMsg {
    return {
      cmapaignName: isSet(object.cmapaignName) ? globalThis.String(object.cmapaignName) : "",
      roomId: isSet(object.roomId) ? globalThis.Number(object.roomId) : 0,
      isLock: isSet(object.isLock) ? globalThis.Number(object.isLock) : 0,
      inviteContent: globalThis.Array.isArray(object?.inviteContent)
        ? object.inviteContent.map((e: any) => globalThis.Number(e))
        : [],
    };
  },

  toJSON(message: CaptainSpeakMsg): unknown {
    const obj: any = {};
    if (message.cmapaignName !== "") {
      obj.cmapaignName = message.cmapaignName;
    }
    if (message.roomId !== 0) {
      obj.roomId = Math.round(message.roomId);
    }
    if (message.isLock !== 0) {
      obj.isLock = Math.round(message.isLock);
    }
    if (message.inviteContent?.length) {
      obj.inviteContent = message.inviteContent.map((e) => Math.round(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<CaptainSpeakMsg>, I>>(base?: I): CaptainSpeakMsg {
    return CaptainSpeakMsg.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<CaptainSpeakMsg>, I>>(object: I): CaptainSpeakMsg {
    const message = createBaseCaptainSpeakMsg();
    message.cmapaignName = object.cmapaignName ?? "";
    message.roomId = object.roomId ?? 0;
    message.isLock = object.isLock ?? 0;
    message.inviteContent = object.inviteContent?.map((e) => e) || [];
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
