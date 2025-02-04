import { getTemplateDialogComponent } from '../dialogs/template_dialog';
import { DialogWithOverlayFlow } from '../flows/dialog_with_overlay';
import Template from '../models/Template';
import { removeAllInteractionElements } from '../navigate';
import { TemplateItemComponent } from '../types';
import { getComponent, getCurrentYoutubeId } from '../utils';
import _ from '../variables';
import { activeTimelineInVideo } from '../video';
import {
  getStateActiveTimelineInVideo,
  setCurrentTemplate,
  setCurrentTotalNotes,
  setDisableItems,
  showPanel,
} from './panel';
import { resetPanelScore } from './panel_track';

export async function handleLoadTemplate() {
  const loader = _.PANEL_WRAPPER?.querySelector('#tunkit_loader.loader_template') as HTMLElement;
  loader.style.display = 'block';
  _.TEMPLATE_PANEL_WRAPPER!.innerHTML = '';
  const templates = await Template.from(getCurrentYoutubeId()).getAll();
  _.TIMELINE_NOTE = templates;
  Object.keys(templates).forEach((key: string) => {
    const template_component = getTemplateItemComponent();
    template_component.setName(_.TIMELINE_NOTE[key].name);
    template_component.setTotalNotes(Object.keys(_.TIMELINE_NOTE[key].timelineNotes).length);
    handleClickDetailTemplate(key, template_component);
    template_component.render();
  });
  loader.style.display = 'none';
}
export function getTemplateItemComponent(): TemplateItemComponent {
  const template_component = getComponent('.tunkit_template_panel_item', false);
  const template_name = template_component.querySelector('.tunkit_template_panel_item_name')!;
  const template_total_notes = template_component.querySelector('.tunkit_template_panel_item_total_note')!;
  return {
    render() {
      _.TEMPLATE_PANEL_WRAPPER!.appendChild(template_component);
    },
    setName(name: string) {
      template_name.textContent = name;
    },
    setTotalNotes(num: number) {
      template_total_notes.textContent = `${num} note${num > 1 ? 's' : ''}`;
    },
    getElement: () => template_component,
    onClickDetail(callback: Function) {
      // @ts-ignore
      template_component.querySelector('.tunkit_template_icon_detail').onclick = function (e) {
        e.stopPropagation();
        callback();
      };
    },
    onClick(callback: Function) {
      // @ts-ignore
      template_component.onclick = () => callback();
    },
  };
}
export function handleCreateTemplatePanel() {
  //@ts-ignore
  _.PANEL_WRAPPER.querySelector('.create_new_template_btn').onclick = function () {
    const template_dialog = getTemplateDialogComponent();
    const dialog_flow = DialogWithOverlayFlow(template_dialog.getElement(), {
      close_selector: ['.tunkit_close_template'],
      overlay_z_index: 2201,
    });
    //@ts-ignore
    template_dialog.getElement().querySelector('.tunkit_title_template_dialog')?.innerText = 'Create Template';
    template_dialog.getElement().querySelector('.tunkit_delete_template')!.remove();
    template_dialog.render();
    template_dialog.onClickSubmit(function () {
      const name = template_dialog.getName();
      const description = template_dialog.getDescription();
      const payload = { name, description, timelineNotes: {} };
      Template.from(getCurrentYoutubeId())
        .insert(payload)
        .then(data => {
          if (data.status == 'success' && data.id) {
            _.TIMELINE_NOTE[data.id] = payload;
            const template_component = getTemplateItemComponent();
            template_component.setName(payload.name);
            template_component.setTotalNotes(0);
            handleClickDetailTemplate(data.id, template_component);
            template_component
              .getElement()
              .querySelector('.ytp-menuitem-label')!.innerHTML += ` <sup class="tunkit_new_template">new</sup>`;
            template_component.getElement().addEventListener(
              'click',
              function () {
                template_component.setName(payload.name);
              },
              { once: true }
            );
            _.TEMPLATE_PANEL_WRAPPER!.prepend(template_component.getElement());
            dialog_flow.removeDialog();
            dialog_flow.removeOverlay();
          }
        });
    });
  };
}
function handleClickDetailTemplate(key: string, template_component: TemplateItemComponent) {
  template_component.onClickDetail(function () {
    const template_dialog = getTemplateDialogComponent();
    template_dialog.setName(_.TIMELINE_NOTE[key].name);
    template_dialog.setDescription(_.TIMELINE_NOTE[key].description);
    template_dialog.render();
    const dialog_flow = DialogWithOverlayFlow(template_dialog.getElement(), {
      close_selector: ['.tunkit_close_template'],
      overlay_z_index: 2201,
    });
    template_dialog.onClickSubmit(function () {
      Template.from(getCurrentYoutubeId())
        .update(key, {
          name: template_dialog.getName(),
          description: template_dialog.getDescription(),
        })
        .then(data => {
          if (data.status == 'success') {
            _.TIMELINE_NOTE[key].name = template_dialog.getName();
            _.TIMELINE_NOTE[key].description = template_dialog.getDescription();
            template_component.setName(template_dialog.getName());
            if (_.CURRENT_TEMPLATE_ID == key) setCurrentTemplate(template_dialog.getName());
            dialog_flow.removeOverlay();
            dialog_flow.removeDialog();
          }
        });
    });
    template_dialog.onClickDelete(() => {
      if (_.CURRENT_TEMPLATE_ID == key) {
        alert('Please select another template before deleting');
        return;
      }
      if (confirm('Are you sure you want to delete this template?')) {
        Template.from(getCurrentYoutubeId())
          .remove(key)
          .then(data => {
            if (data.status == 'success') {
              delete _.TIMELINE_NOTE[key];
              dialog_flow.removeOverlay();
              dialog_flow.removeDialog();
              template_component.getElement().remove();
            }
          });
      }
    });
  });
  template_component.onClick(function () {
    if (_.CURRENT_TEMPLATE_ID == key) return;
    _.CURRENT_TEMPLATE_ID = key;
    removeAllInteractionElements();
    activeTimelineInVideo(getStateActiveTimelineInVideo());
    resetPanelScore();
    _.MODE_DATA_PANEL.auto_pause.is_executed = false;
    _.TEMPLATE_PANEL_WRAPPER?.querySelector('.tunkit_template_panel_item_selected')?.classList?.remove(
      'tunkit_template_panel_item_selected'
    );
    template_component.getElement().classList.add('tunkit_template_panel_item_selected');
    setCurrentTemplate(_.TIMELINE_NOTE[key].name);
    setCurrentTotalNotes(Object.keys(_.TIMELINE_NOTE[key].timelineNotes).length);
    showPanel('.tunkit_panel.panel_main', 'tunkit_panel_active');
    setDisableItems(_.PANEL_WRAPPER as HTMLElement, '.tunkit_disable_for_template', false);
    setCurrentTotalNotes(Object.keys(_.TIMELINE_NOTE[key].timelineNotes).length);
    _.IS_GET_TIMELINE = false;
  });
}
