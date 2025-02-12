export function ErrorMessageWithElementValidation(message: string, element: HTMLElement) {
  element
    .parentElement!.querySelectorAll(`.${element.className.split(' ').join('.')} ~ .tunkit_error_validate_message`)
    .forEach(e => e.remove());
  const error_element = document.createElement('div');
  error_element.className = 'tunkit_error_validate_message';
  error_element.innerText = message;
  element.insertAdjacentElement('afterend', error_element);
}
