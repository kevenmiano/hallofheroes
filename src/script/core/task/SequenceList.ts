import { Status, Sequence } from "./Sequence";

export enum ActionsExecutionMode {
  RunInSequence, //顺序执行
  RunInParallel, //并行执行
}

export class SequenceList extends Sequence {
  public actions = new Array<Sequence>();
  public finished = new Array<number>();
  public executionMode = ActionsExecutionMode.RunInSequence;
  private mCurIndex: number;

  public get progress() {
    let cur = 0;
    for (let i = 0; i < this.actions.length; i++) {
      cur += this.actions[i].progress;
    }
    let v = cur / this.actions.length;
    v = isNaN(v) ? 0 : v;
    if (this.actions.length == 0) v = 1;
    return v;
  }

  protected onExecute() {
    this.mCurIndex = 0;
    this.finished.splice(0, this.finished.length);
    this.mProgress = 0;
  }

  protected onUpdate() {
    super.onUpdate();
    if (this.actions.length == 0) {
      this.endAction();
      return;
    }
    switch (this.executionMode) {
      case ActionsExecutionMode.RunInParallel:
        this.checkParallelTask();
        break;
      case ActionsExecutionMode.RunInSequence:
        this.checkInSequenceTask();
        break;
    }
  }

  private checkParallelTask() {
    for (let i = 0; i < this.actions.length; i++) {
      if (this.finished.findIndex((a) => a == i) != -1) continue;
      let status = this.actions[i].tick(this.mOwnerSystem);
      if (status == Status.Failure) {
        this.mErr = this.actions[i].errInfo;
        this.endAction(false);
        if (this.actions[i].onFinish != null)
          this.actions[i].onFinish.runWith(true);
        return;
      }

      if (status == Status.Success) {
        this.finished.push(i);
        if (this.actions[i].onFinish != null)
          this.actions[i].onFinish.runWith(true);
      }
    }
    if (this.finished.length == this.actions.length) this.endAction();
  }

  private checkInSequenceTask() {
    for (let i = this.mCurIndex; i < this.actions.length; i++) {
      let status = this.actions[i].tick(this.mOwnerSystem);

      if (status == Status.Failure) {
        this.endAction(false);
        if (this.actions[i].onFinish != null)
          this.actions[i].onFinish.runWith(false);
        return;
      }

      if (status == Status.Running) {
        this.mCurIndex = i;
        return;
      } else {
        if (this.actions[i].onFinish != null)
          this.actions[i].onFinish.runWith(true);
      }
    }
    this.endAction();
  }

  protected onReset() {
    for (let i = 0; i < this.actions.length; i++) {
      this.actions[i].reset();
    }

    this.mCurIndex = 0;
    this.finished.splice(0, this.finished.length);
  }

  public addTask(task: Sequence): SequenceList {
    this.actions.push(task);
    return this;
  }

  constructor(executionMode: ActionsExecutionMode) {
    super();
    this.executionMode = executionMode;
  }

  public clear() {
    this.reset();
    this.onForcedStop();
    this.actions.splice(0, this.actions.length);
  }
}
