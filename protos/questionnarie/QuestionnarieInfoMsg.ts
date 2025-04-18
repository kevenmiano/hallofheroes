// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.0
//   protoc               v3.21.12
// source: questionnarie/QuestionnarieInfoMsg.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "com.road.yishi.proto.questionnarie";

export interface QuestionnarieInfoMsg {
  id: number;
  title: string;
  content: string;
  starTime: string;
  endTime: string;
}

function createBaseQuestionnarieInfoMsg(): QuestionnarieInfoMsg {
  return { id: 0, title: "", content: "", starTime: "", endTime: "" };
}

export const QuestionnarieInfoMsg: MessageFns<QuestionnarieInfoMsg> = {
  encode(message: QuestionnarieInfoMsg, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.id !== 0) {
      writer.uint32(8).int32(message.id);
    }
    if (message.title !== "") {
      writer.uint32(18).string(message.title);
    }
    if (message.content !== "") {
      writer.uint32(26).string(message.content);
    }
    if (message.starTime !== "") {
      writer.uint32(34).string(message.starTime);
    }
    if (message.endTime !== "") {
      writer.uint32(42).string(message.endTime);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): QuestionnarieInfoMsg {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQuestionnarieInfoMsg();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 8) {
            break;
          }

          message.id = reader.int32();
          continue;
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

          message.content = reader.string();
          continue;
        }
        case 4: {
          if (tag !== 34) {
            break;
          }

          message.starTime = reader.string();
          continue;
        }
        case 5: {
          if (tag !== 42) {
            break;
          }

          message.endTime = reader.string();
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

  fromJSON(object: any): QuestionnarieInfoMsg {
    return {
      id: isSet(object.id) ? globalThis.Number(object.id) : 0,
      title: isSet(object.title) ? globalThis.String(object.title) : "",
      content: isSet(object.content) ? globalThis.String(object.content) : "",
      starTime: isSet(object.starTime) ? globalThis.String(object.starTime) : "",
      endTime: isSet(object.endTime) ? globalThis.String(object.endTime) : "",
    };
  },

  toJSON(message: QuestionnarieInfoMsg): unknown {
    const obj: any = {};
    if (message.id !== 0) {
      obj.id = Math.round(message.id);
    }
    if (message.title !== "") {
      obj.title = message.title;
    }
    if (message.content !== "") {
      obj.content = message.content;
    }
    if (message.starTime !== "") {
      obj.starTime = message.starTime;
    }
    if (message.endTime !== "") {
      obj.endTime = message.endTime;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<QuestionnarieInfoMsg>, I>>(base?: I): QuestionnarieInfoMsg {
    return QuestionnarieInfoMsg.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<QuestionnarieInfoMsg>, I>>(object: I): QuestionnarieInfoMsg {
    const message = createBaseQuestionnarieInfoMsg();
    message.id = object.id ?? 0;
    message.title = object.title ?? "";
    message.content = object.content ?? "";
    message.starTime = object.starTime ?? "";
    message.endTime = object.endTime ?? "";
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
