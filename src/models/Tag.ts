import { randomString } from '../utils';

export default class Tags {
  static DATA = {
    GET_ALL: function (option: { include_key: boolean }) {
      return chrome.runtime.sendMessage({ type: 'GET_TAGS_DATA', option });
    },
    SET: function (payload: { key: string; data: string }[]): Promise<{ status: 'success' | 'failed' }> {
      return chrome.runtime.sendMessage({ type: 'SET_TAGS_DATA', data: payload });
    },
    GET_TAGS_VALUES: function (data: string[]) {
      return this.GET_ALL({ include_key: true }).then(tags => {
        return data.map(key => tags[key]);
      });
    },
    GET_TAGS_KEYS: function (data: string[]) {
      return this.GET_ALL({ include_key: true }).then(tags => {
        const data_tags = [] as string[];
        const new_tags = [] as { key: string; data: string }[];
        data.map(text => {
          let key = Object.keys(tags).find(key => tags[key] == text);
          if (!key) {
            key = randomString();
            new_tags.push({ key, data: text });
          }
          data_tags.push(key);
        });
        if (new_tags.length > 0) this.SET(new_tags);
        return data_tags;
      });
    },
  };
}
