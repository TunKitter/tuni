import { getComponent } from '../utils.js';

export default function getInputTagsComponent() {
  const inputTags = getComponent('.tunkit_input_tags_wrapper', false);
  const input_type_folder = inputTags.querySelector('#tunkit_input_type_folder') as HTMLInputElement;
  const list_folder = inputTags.querySelector('#tunkit_list_folder') as HTMLUListElement;
  let arr = [] as string[];
  inputTags.addEventListener('click', () => input_type_folder.focus());
  input_type_folder!.addEventListener('keyup', function (e) {
    let inp_value = input_type_folder.value;
    if (e.key === 'Enter' && inp_value.length > 0 && !arr.includes(inp_value)) {
      arr.push(inp_value);
      insertData(list_folder, arr, inp_value);
      input_type_folder.value = '';
    }
  });

  return {
    getElement: () => inputTags,
    setData: function (yourData: string[]) {
      setData(list_folder, yourData);
      arr = yourData;
    },
    getData: () => arr,
  };
}
function insertData(ul: HTMLUListElement, arr: string[], text: string) {
  const li = document.createElement('li');
  li.innerText = text;
  const close_icon = getComponent('.tunkit_close_icon_input_tags_wrapper', false);
  li.prepend(close_icon);
  ul.appendChild(li);
  close_icon.addEventListener('click', function () {
    // @ts-ignore
    arr.splice(arr.indexOf(text), 1);
    li.remove();
  });
}
function setData(ul: HTMLUListElement, arr: string[]) {
  ul.querySelectorAll('li:not(#tunkit_input_type_folder_li)').forEach(e => e.remove());
  arr.forEach(e => {
    insertData(ul, arr, e);
  });
}
