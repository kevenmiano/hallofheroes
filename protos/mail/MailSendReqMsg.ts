// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.0
//   protoc               v3.21.12
// source: mail/MailSendReqMsg.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "com.road.yishi.proto.mail";

export interface MailSendReqMsg {
  receiverUserId: number[];
  title: string;
  contents: string;
  sendType: number;
  payType: number;
}

function createBaseMailSendReqMsg(): MailSendReqMsg {
  return { receiverUserId: [], title: "", contents: "", sendType: 0, payType: 0 };
}

export const MailSendReqMsg: MessageFns<MailSendReqMsg> = {
  encode(message: MailSendReqMsg, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    writer.uint32(10).fork();
    for (const v of message.receiverUserId) {
      writer.int32(v);
    }
    writer.join();
    if (message.title !== "") {
      writer.uint32(18).string(message.title);
    }
    if (message.contents !== "") {
      writer.uint32(26).string(message.contents);
    }
    if (message.sendType !== 0) {
      writer.uint32(32).int32(message.sendType);
    }
    if (message.payType !== 0) {
      writer.uint32(40).int32(message.payType);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): MailSendReqMsg {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMailSendReqMsg();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag === 8) {
            message.receiverUserId.push(reader.int32());

            continue;
          }

          if (tag === 10) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.receiverUserId.push(reader.int32());
            }

            continue;
          }

          break;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.title = reader.string();
          continue;
        }
        case 3: {
          if (tag !== 26) {
            break;
          }

          message.contents = reader.string();
          continue;
        }
        case 4: {
          if (tag !== 32) {
            break;
          }

          message.sendType = reader.int32();
          continue;
        }
        case 5: {
          if (tag !== 40) {
            break;
          }

          message.payType = reader.int32();
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

  fromJSON(object: any): MailSendReqMsg {
    return {
      receiverUserId: globalThis.Array.isArray(object?.receiverUserId)
        ? object.receiverUserId.map((e: any) => globalThis.Number(e))
        : [],
      title: isSet(object.title) ? globalThis.String(object.title) : "",
      contents: isSet(object.contents) ? globalThis.String(object.contents) : "",
      sendType: isSet(object.sendType) ? globalThis.Number(object.sendType) : 0,
      payType: isSet(object.payType) ? globalThis.Number(object.payType) : 0,
    };
  },

  toJSON(message: MailSendReqMsg): unknown {
    const obj: any = {};
    if (message.receiverUserId?.length) {
      obj.receiverUserId = message.receiverUserId.map((e) => Math.round(e));
    }
    if (message.title !== "") {
      obj.title = message.title;
    }
    if (message.contents !== "") {
      obj.contents = message.contents;
    }
    if (message.sendType !== 0) {
      obj.sendType = Math.round(message.sendType);
    }
    if (message.payType !== 0) {
      obj.payType = Math.round(message.payType);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MailSendReqMsg>, I>>(base?: I): MailSendReqMsg {
    return MailSendReqMsg.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MailSendReqMsg>, I>>(object: I): MailSendReqMsg {
    const message = createBaseMailSendReqMsg();
    message.receiverUserId = object.receiverUserId?.map((e) => e) || [];
    message.title = object.title ?? "";
    message.contents = object.contents ?? "";
    message.sendType = object.sendType ?? 0;
    message.payType = object.payType ?? 0;
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
