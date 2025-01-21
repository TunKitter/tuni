import Template from '../models/Template';
import { TemplateType } from '../types';
import { getComponent, getCurrentYoutubeId } from '../utils';
import _ from '../variables';

export async function handleLoadTemplate() {
  const loader = _.PANEL_WRAPPER?.querySelector('#tunkit_loader.loader_template') as HTMLElement;
  loader.style.display = 'block';
  _.TEMPLATE_PANEL_WRAPPER!.innerHTML = '';
  const templates = await Template.from(getCurrentYoutubeId()).getAll();
  loader.style.display = 'none';
}
export function getTemplateItemComponent() {
  const template_component = getComponent('.tunkit_template_panel_item', false);
}
