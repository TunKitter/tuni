import MessageTimelineInterface from '../interface/MessageTimelineInterface';
import { TimelineDataType, TimelineType } from '../types';

export default function TimelineInterfaceElementNavigator(type: TimelineType, value: TimelineDataType): any {
  switch (type) {
    case 'message':
      return new MessageTimelineInterface(value);
    case 'flashcard':
      return 'flashcard';
    case 'typing':
      return 'typing';
    case 'pointer':
      return 'pointer';
  }
}
