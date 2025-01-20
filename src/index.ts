import { insertToggleIconMenu } from './init';

(() => {
  new MutationObserver(async (mutationsList, observer) => {
    if (
      document.readyState === 'complete' &&
      !document.querySelector('#tunkit_interactive_button') &&
      document.querySelector('.ytp-subtitles-button.ytp-button')
    ) {
      insertToggleIconMenu();
      observer.disconnect();
    }
  }).observe(document, { childList: true, subtree: true });
})();
