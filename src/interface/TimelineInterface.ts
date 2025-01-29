import { TimelineDataType } from '../types';

export default abstract class TimelineInterface {
  protected data: TimelineDataType;
  protected is_prevent_show: boolean = false;
  protected is_showing: boolean = false;
  constructor(value: TimelineDataType) {
    this.data = value;
  }
  abstract render(): void;
  abstract show(): void;
  abstract hide(): void;
  abstract removeElement(): void;
  isShow() {
    return this.is_showing;
  }
  isPreventShow() {
    return this.is_prevent_show;
  }
  setPreventShow(value: boolean) {
    this.is_prevent_show = value;
  }
}
