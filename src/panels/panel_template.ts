import { getTemplateDialogComponent } from '../dialogs/template_dialog';
import { DialogWithOverlayFlow } from '../flows/dialog_with_overlay';
import Template from '../models/Template';
import { TemplateType } from '../types';
import { getComponent, getCurrentYoutubeId } from '../utils';
import _ from '../variables';

export async function handleLoadTemplate() {
  const loader = _.PANEL_WRAPPER?.querySelector('#tunkit_loader.loader_template') as HTMLElement;
  loader.style.display = 'block';
  _.TEMPLATE_PANEL_WRAPPER!.innerHTML = '';
  const templates = await Template.from(getCurrentYoutubeId()).getAll();
  Object.keys(templates).forEach((key: string) => {
    const template_component = getTemplateItemComponent();
    handleClickDetailTemplate(key, template_component, templates[key]);
  });
  loader.style.display = 'none';
}
export function getTemplateItemComponent() {
  const data = { name: '', total_notes: 0, description: '' };
  const template_component = getComponent('.tunkit_template_panel_item', false);
  const template_name = template_component.querySelector('.tunkit_template_panel_item_name')!;
  const template_total_notes = template_component.querySelector('.tunkit_template_panel_item_total_note')!;
  function setNameView(name: string) {
    template_name.textContent = name;
  }
  function setTotalNotesView(total_notes: number) {
    template_total_notes.textContent = `${total_notes} note${total_notes > 1 ? 's' : ''}`;
  }
  return {
    render() {
      _.TEMPLATE_PANEL_WRAPPER!.appendChild(template_component);
    },
    getName: () => data.name,
    getTotalNotes: () => data.total_notes,
    getDescription: () => data.description,
    getNameInputData: () => template_name.textContent,
    getTotalNotesInputData: () => template_total_notes.textContent,
    setName(name: string) {
      data.name = name;
      setNameView(name);
    },
    setDescription(description: string) {
      data.description = description;
    },
    setTotalNotes(total_notes: number) {
      data.total_notes = total_notes;
      setTotalNotesView(total_notes);
    },
    getElement: () => template_component,
    onCLickDetail(callback: Function) {
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
          }
        });
    });
  };
}
function handleClickDetailTemplate(key: string, template_component: any, templates: TemplateType) {
  template_component.setName(templates.name);
  template_component.setDescription(templates.description);
  template_component.setTotalNotes(Object.keys(templates.timelineNotes).length);
  template_component.onCLickDetail(function () {
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
            dialog_flow.removeOverlay();  
            dialog_flow.removeDialog();
          }
        });
    });
    template_dialog.onClickDelete(() => {
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
  template_component.render();
}
