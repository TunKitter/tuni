import { getFlashcardTimelineDialog } from '../dialogs/flashcard_timeline_dialog';
import { getMessageTimelineDialog } from '../dialogs/message_timeline_dialog';
import { getPointerTimelineDialog } from '../dialogs/pointer_timeline_dialog';
import { getTypingTimelineDialog } from '../dialogs/typing_timeline_dialog';
import { TimelineType } from '../types';

export function DialogTimelineTypeNavigator(type: TimelineType) {
  switch (type) {
    case 'message':
      return getMessageTimelineDialog();
    case 'flashcard':
      return getFlashcardTimelineDialog();
    case 'typing':
      return getTypingTimelineDialog();
    case 'pointer':
      return getPointerTimelineDialog();
  }
}
