export type TemplateType = {
  name: string;
  description: string;
  timelineNotes: {};
};
export type OptionalTemplateType = {
  name?: string;
  description?: string;
  timelineNotes?: {};
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
export type TemplateItemComponent = {
  render: () => void;
  getName: () => string;
  getDescription: () => string;
  getTimelineNotes: () => { [key: string]: TimelineDataType };
  setName: (name: string) => void;
  setDescription: (description: string) => void;
  setTimelineNote: (timelineNotes: {}) => void;
  getElement: () => HTMLElement;
  onClickDetail: (callback: () => void) => void;
  onClick: (callback: () => void) => void;
};
