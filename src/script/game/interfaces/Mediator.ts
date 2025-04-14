export interface IMediator {
  register(target: any): void;
  unregister(target: any): void;
}
