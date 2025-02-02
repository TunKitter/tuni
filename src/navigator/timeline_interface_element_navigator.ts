import FlashcardTimelineInterface from '../interface/FlashcardTimelineInterface';
import MessageTimelineInterface from '../interface/MessageTimelineInterface';
import PointerTimelineInterfaceHandler from '../interface/PointerTimelineInterfaceHandler';
import TypingTimelineInterface from '../interface/TypingTimelineInterface';
import { TimelineDataType, TimelineType } from '../types';

export default function TimelineInterfaceElementNavigator(type: TimelineType, value: TimelineDataType): any {
  switch (type) {
    case 'message':
      return new MessageTimelineInterface(value);
    case 'flashcard':
      return new FlashcardTimelineInterface(value);
    case 'typing':
      return new TypingTimelineInterface(value);
    case 'pointer':
      return new PointerTimelineInterfaceHandler(value);
  }
}
