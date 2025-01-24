export type TemplateType = {
  name: string;
  description: string;
  timelineNotes: { [key: string]: TimelineDataType };
};
export type OptionalTemplateType = {
  name?: string;
  description?: string;
  timelineNotes?: { [key: string]: TimelineDataType };
};
export type TimelineType = 'message' | 'flashcard' | 'typing' | 'pointer';
export type TimelineDataType = {
  name: string;
  startTime: number;
  endTime: number;
  timeline: string;
  tags: string[];
  type: TimelineType;
  data: any;
  action: { [key: string]: ActionDataType };
};
export type OptionalTimelineDataType = {
  name?: string;
  startTime?: number;
  endTime?: number;
  timeline?: string;
  tags?: string[];
  type?: TimelineType;
  data?: any;
  action?: { [key: string]: ActionDataType };
};
export type ActionDataType = {
  name: string;
  type: 'notification' | 'jump_timeline' | 'reference_note' | 'mark_correct' | 'mark_incorrect';
  data: any;
};
export type ActionTypingDataType = {
  name: string;
  type: 'notification' | 'jump_timeline' | 'reference_note' | 'mark_correct' | 'mark_incorrect';
  data: any;
  select_type: 'equal' | 'otherwise';
  include: string[];
};

export type TemplateItemComponent = {
  render: () => void;
  setName: (name: string) => void;
  setTotalNotes: (num: number) => void;
  getElement: () => HTMLElement;
  onClickDetail: (callback: () => void) => void;
  onClick: (callback: () => void) => void;
};
export type ActionType = 'notification' | 'jump_timeline' | 'reference_note' | 'mark_correct' | 'mark_incorrect';
export type ActionButtonAdderItemType = {
  getElement: () => HTMLElement;
  onClick: (callback: Function) => void;
  setName: (name: string) => void;
  setIcon: (icon: ActionType) => void;
};
export type ActionButtonAdderComponentType = {
  addNewAction: () => ActionButtonAdderItemType;
  getElement: () => HTMLElement;
  onAddNewAction: (callback: Function) => void;
};
