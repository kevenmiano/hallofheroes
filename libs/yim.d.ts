// yim.d.ts

declare namespace YIM {
  interface YIMConfig {
    appKey: string;
    userId?: string;
    token?: string;
    roomId?: string;
    useMessageType?: (typeof TextMessage | typeof VoiceMessage)[];
  }

  interface RoomEvent {
    name: string;
    roomId: string;
  }

  interface MessageEvent {
    name: string;
    message: any;
    from: string;
    to: string;
    time: number;
  }

  type EventHandler = (event: any) => void;

  class YIM {
    constructor(config: YIMConfig);

    login(userId: string, token: string): Promise<void>;
    joinRoom(roomId: string): Promise<void>;
    leaveRoom(roomId: string): Promise<void>;

    on(event: string, handler: EventHandler): void;

    getMyUserId(): string;

    registerMessageType(
      types: (typeof TextMessage | typeof VoiceMessage)[],
    ): void;
  }

  class TextMessage {
    constructor(content: string);
    content: string;
  }

  class VoiceMessage {
    constructor(extraText?: string);

    static registerRecorder(
      recorders: (
        | typeof MP3Recorder
        | typeof AMRRecorder
        | typeof WAVRecorder
      )[],
    ): void;
    static initRecorder(): Promise<void>;

    startRecord(): void;
    stopRecord(): void;
    cancelRecord(): void;
  }

  class MP3Recorder {}
  class AMRRecorder {}
  class WAVRecorder {}
}
