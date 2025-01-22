import { handelTogglePanel, insertComponent, insertMenuPanel, insertToggleIconMenu } from './init';
import handleNavigate from './navigate';
import { handleChangeViewPanel, handleToggleMenuSwitcherIcon } from './panels/panel';
import { handleCreateTemplatePanel } from './panels/panel_template';

(() => {
  new MutationObserver(async (mutationsList, observer) => {
    if (
      document.readyState === 'complete' &&
      !document.querySelector('#tunkit_interactive_button') &&
      document.querySelector('.ytp-subtitles-button.ytp-button')
    ) {
      insertToggleIconMenu();
      await insertComponent();

      insertMenuPanel();
      handleToggleMenuSwitcherIcon();
      handelTogglePanel();
      handleChangeViewPanel();

      handleCreateTemplatePanel();
      handleNavigate();
      observer.disconnect();
    }
  }).observe(document, { childList: true, subtree: true });
})();
