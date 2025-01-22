export default class Youtube {
  static from(youtubeID: string) {
    return {
      getTitle() {
        return chrome.runtime.sendMessage({ type: 'GET_TITLE_YOUTUBE', youtubeID });
      },
      setTitle(title: string): Promise<{ status: 'success' | 'failed' }> {
        return chrome.runtime.sendMessage({ type: 'SET_TITLE_YOUTUBE', youtubeID, title });
      },
    };
  }
}
