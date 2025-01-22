import { getTemplateDialogComponent } from '../dialogs/template_dialog';
import { DialogWithOverlayFlow } from '../flows/dialog_with_overlay';
import Template from '../models/Template';
import { TemplateItemComponent, TemplateType } from '../types';
import { getComponent, getCurrentYoutubeId } from '../utils';
import _ from '../variables';
import { setCurrentTemplate, setCurrentTotalNotes, setDisableItems, showPanel } from './panel';

export async function handleLoadTemplate() {
  const loader = _.PANEL_WRAPPER?.querySelector('#tunkit_loader.loader_template') as HTMLElement;
  loader.style.display = 'block';
  _.TEMPLATE_PANEL_WRAPPER!.innerHTML = '';
  const templates = await Template.from(getCurrentYoutubeId()).getAll();
  Object.keys(templates).forEach((key: string) => {
    const template_component = getTemplateItemComponent();
    handleClickDetailTemplate(key, template_component, templates[key]);
    template_component.render();
  });
  loader.style.display = 'none';
}
export function getTemplateItemComponent(): TemplateItemComponent {
  const data: TemplateType = { name: '', timelineNotes: {}, description: '' };
  const template_component = getComponent('.tunkit_template_panel_item', false);
  const template_name = template_component.querySelector('.tunkit_template_panel_item_name')!;
  const template_total_notes = template_component.querySelector('.tunkit_template_panel_item_total_note')!;
  function setNameView(name: string) {
    template_name.textContent = name;
  }
  function setTotalNotesView() {
    const note_len = Object.keys(data.timelineNotes).length;
    template_total_notes.textContent = `${note_len} note${note_len > 1 ? 's' : ''}`;
  }
  return {
    render() {
      _.TEMPLATE_PANEL_WRAPPER!.appendChild(template_component);
    },
    getName: () => data.name,
    getTimelineNotes: () => data.timelineNotes,
    getDescription: () => data.description,
    setName(name: string) {
      data.name = name;
      setNameView(name);
    },
    setDescription(description: string) {
      data.description = description;
    },
    setTimelineNote(timelineNotes: {}) {
      data.timelineNotes = timelineNotes;
      setTotalNotesView();
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
    DialogWithOverlayFlow(template_dialog.getElement(), {
      close_selector: ['.tunkit_close_template', '.tunkit_save_template'],
      overlay_z_index: 2201,
    });
    //@ts-ignore
    template_dialog.getElement().querySelector('.tunkit_title_template_dialog')?.innerText = 'Create Template';
    template_dialog.getElement().querySelector('.tunkit_delete_template')!.remove();
    template_dialog.render();
    template_dialog.onClickSubmit(function () {
      const name = template_dialog.getInputNameData();
      const description = template_dialog.getInputDescriptionData();
      const payload = { name, description, timelineNotes: {} };
      Template.from(getCurrentYoutubeId())
        .insert(payload)
        .then(data => {
          if (data.status == 'success' && data.id) {
            const template_component = getTemplateItemComponent();
            handleClickDetailTemplate(data.id, template_component, payload);
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
          }
        });
    });
  };
}
function handleClickDetailTemplate(key: string, template_component: TemplateItemComponent, templates: TemplateType) {
  template_component.setName(templates.name);
  template_component.setDescription(templates.description);
  template_component.setTimelineNote(templates.timelineNotes);
  template_component.onClickDetail(function () {
    const template_dialog = getTemplateDialogComponent();
    template_dialog.setName(template_component.getName());
    template_dialog.setDescription(template_component.getDescription());
    template_dialog.render();
    const dialog_flow = DialogWithOverlayFlow(template_dialog.getElement(), {
      close_selector: ['.tunkit_close_template', '.tunkit_save_template'],
      overlay_z_index: 2201,
    });
    template_dialog.onClickSubmit(function () {
      Template.from(getCurrentYoutubeId())
        .update(key, {
          name: template_dialog.getInputNameData(),
          description: template_dialog.getInputDescriptionData(),
        })
        .then(data => {
          if (data.status == 'success') {
            template_component.setName(template_dialog.getInputNameData());
            template_component.setDescription(template_dialog.getInputDescriptionData());
            if (_.CURRENT_TEMPLATE_ID == key) setCurrentTemplate(template_dialog.getInputNameData());
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
              dialog_flow.removeOverlay();
              dialog_flow.removeDialog();
              template_component.getElement().remove();
            }
          });
      }
    });
  });
  template_component.onClick(function () {
    _.PANEL_WRAPPER?.querySelector('.tunkit_template_panel_item_selected')?.classList?.remove(
      'tunkit_template_panel_item_selected'
    );
    template_component.getElement().classList.add('tunkit_template_panel_item_selected');
    _.CURRENT_TEMPLATE_ID = key;
    setCurrentTemplate(template_component.getName());
    setCurrentTotalNotes(Object.keys(template_component.getTimelineNotes()).length);
    showPanel('.tunkit_panel.panel_main', 'tunkit_panel_active');
    setDisableItems(_.PANEL_WRAPPER as HTMLElement, '.tunkit_disable_for_template', false);
    _.CURRENT_TEMPLATE_PANEL_ITEM = template_component;
  });
}
