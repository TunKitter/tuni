import { TimelineDataType } from '../types';
import { randomString } from '../utils';
import Template from './Template';

export default class Timeline {
  static GETNAME = {
    message: 'Message',
    flashcard: 'Flashcard',
    typing: 'Typing',
    pointer: 'Pointer',
  };
  static from(youtubeID: string) {
    return {
      withTemplate(templateID: string) {
        return {
          insert(data: TimelineDataType) {
            const timeline_id = randomString();
            return Template.from(youtubeID)
              .get(templateID)
              .then(template => {
                //@ts-ignore
                template.timelineNotes[timeline_id] = data;
                const _now = Date.now();
                //@ts-ignore
                template.timelineNotes[timeline_id].created_at = _now;
                //@ts-ignore
                template.timelineNotes[timeline_id].updated_at = _now;
                return Template.from(youtubeID)
                  .update(templateID, {
                    timelineNotes: template.timelineNotes,
                  })
                  .then(function (result) {
                    return {
                      status: result.status,
                      id: timeline_id,
                    };
                  });
              });
          },
          update(id: string, data: TimelineDataType) {
            return Template.from(youtubeID)
              .get(templateID)
              .then(template => {
                //@ts-ignore
                if (template?.timelineNotes?.[id] == undefined) throw new Error('Timeline not found');
                template.timelineNotes[id] = data;
                //@ts-ignore
                template.timelineNotes[id].updated_at = Date.now();
                return Template.from(youtubeID)
                  .update(templateID, {
                    timelineNotes: template.timelineNotes,
                  })
                  .then(function (result) {
                    return {
                      status: result.status,
                    };
                  });
              });
          },
          remove(id: string) {
            return Template.from(youtubeID)
              .get(templateID)
              .then(template => {
                //@ts-ignore
                if (template?.timelineNotes?.[id] == undefined) throw new Error('Timeline not found');
                delete template.timelineNotes[id];
                return Template.from(youtubeID)
                  .update(templateID, {
                    timelineNotes: template.timelineNotes,
                  })
                  .then(function (result) {
                    return {
                      status: result.status,
                    };
                  });
              });
          },
        };
      },
    };
  }
}
