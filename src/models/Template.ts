import { OptionalTemplateType, TemplateType } from '../types';
import { getTitleYoutube, randomString } from '../utils';
import _ from '../variables';

export default class Template {
  static from(youtubeID: string) {
    return {
      getAll(): Promise<{ [key: string]: TemplateType }> {
        const title = getTitleYoutube();
        return chrome.runtime.sendMessage({ type: 'GET_ALL_TEMPLATE', youtubeID, title });
      },
      get(id: string): Promise<TemplateType> {
        return chrome.runtime.sendMessage({ type: 'GET_TEMPLATE', youtubeID, id });
      },
      insert(data: TemplateType): Promise<{ status: 'success' | 'failed'; id: string }> {
        _.TEMP_REFERENCE_ACTION_ELEMENT = null;
        const id = randomString();
        return chrome.runtime.sendMessage({ type: 'INSERT_TEMPLATE', youtubeID, id, data }).then(() => {
          return {
            status: 'success',
            id,
          };
        });
      },
      remove(id: string): Promise<{ status: 'success' | 'failed' }> {
        _.TEMP_REFERENCE_ACTION_ELEMENT = null;
        return chrome.runtime.sendMessage({ type: 'REMOVE_TEMPLATE', youtubeID, id });
      },
      update(id: string, data: OptionalTemplateType): Promise<{ status: 'success' | 'failed' }> {
        _.TEMP_REFERENCE_ACTION_ELEMENT = null;
        return chrome.runtime.sendMessage({ type: 'UPDATE_TEMPLATE', youtubeID, id, data });
      },
    };
  }
}
