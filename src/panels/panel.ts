import _ from '../variables';
import { handleLoadTemplate } from './panel_template';

export function handleShowPanel(wrapper: HTMLElement, callback: Function | undefined = undefined) {
  wrapper.querySelectorAll('*[data-tunkit-panel]').forEach(element => {
    element.addEventListener('click', function () {
      if (callback !== undefined) {
        callback(element, function show() {
          // @ts-ignore
          showPanel('.tunkit_panel.panel_' + element.dataset.tunkitPanel, element.dataset.tunkitType);
        });
      }
    });
  });
}
export function handleChangeViewPanel() {
  handleShowPanel(_.PANEL_WRAPPER as HTMLElement, function (element: HTMLElement, show: Function) {
    if (getActivePanel() == false) return;
    switch (element.dataset.tunkitPanel) {
      case 'main': {
        show();
        break;
      }
      case 'template': {
        show();
        if (_.IS_GET_TEMPLATE) break;
        handleLoadTemplate();
        _.IS_GET_TEMPLATE = true;
        break;
      }
      case 'create_message_timeline': {
        break;
      }
    }
  });
}
export function showPanel(className: string, active_class: string, wrapper: HTMLElement | Document = document) {
  wrapper.querySelector('.' + active_class)?.classList?.remove(active_class);
  wrapper.querySelector(className)?.classList?.add(active_class);
}
export function handleToggleMenuSwitcherIcon() {
  (_.PANEL_WRAPPER?.querySelector('#tunkit_toggle_interactive_video') as HTMLElement)?.addEventListener(
    'click',
    function () {
      setActivePanel(!getActivePanel());
    }
  );
}
export function setActivePanel(status: boolean) {
  (_.PANEL_WRAPPER?.querySelector('#tunkit_toggle_interactive_video') as HTMLElement).setAttribute(
    'aria-checked',
    status ? 'true' : 'false'
  );
  (_.PANEL_WRAPPER?.querySelector('.tunkit_content') as HTMLElement).style.opacity = status ? '1' : '0.5';
}
export function getActivePanel(): boolean {
  return (
    (_.PANEL_WRAPPER?.querySelector('#tunkit_toggle_interactive_video') as HTMLElement).getAttribute('aria-checked') ==
    'true'
  );
}
export function setDisableItems(wrapper: HTMLElement, class_name: string, is_remove: boolean) {
  wrapper.querySelectorAll(class_name).forEach(element => {
    // @ts-ignore
    element.style.opacity = is_remove ? '0.5' : '1';
  });
}
export function setCurrentTemplate(text: string) {
  //@ts-ignore
  _.PANEL_WRAPPER?.querySelector('.tunkit_current_template').textContent = text;
}
