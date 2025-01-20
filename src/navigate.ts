import _ from './variables';

export default function handleNavigate() {
  // @ts-ignore
  navigation.addEventListener('navigate', () => {
    (_.PANEL_WRAPPER as HTMLElement)?.classList.remove('tunkit_menu_active');
  });
}
