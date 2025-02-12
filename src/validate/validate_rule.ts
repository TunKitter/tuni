import { ErrorMessageWithElementValidation } from './interface/error_message_with_element';

export default class Validate {
  private text: string = undefined as any;
  private rules: Function[] = [];
  private element: HTMLElement = undefined as any;
  constructor(element: HTMLElement, text?: string) {
    this.element = element;
    if (text != undefined) this.text = text;
  }
  getElement() {
    return this.element;
  }
  customValidate(handler: Function) {
    this.rules.push(handler);
    return this;
  }
  notEmpty() {
    const _this = this;
    this.rules.push(function () {
      if (_this.text.trim().length == 0) throw new Error('The text is not empty');
    });
    return this;
  }
  minLen(length: number) {
    const _this = this;
    this.rules.push(function () {
      if (_this.text.length < length) throw new Error(`The text too short. Required at least ${length}`);
    });
    return this;
  }
  maxLen(length: number) {
    const _this = this;
    this.rules.push(function () {
      if (_this.text.length > length) throw new Error(`The text too long. The length not more than ${length}`);
    });
    return this;
  }

  notIncludeNumber() {
    const _this = this;
    this.rules.push(function () {
      if (/\d/.test(_this.text)) throw new Error("The text don't include numbers");
    });
    return this;
  }

  notIncludeCharacter() {
    const _this = this;
    this.rules.push(function () {
      if (/[^\w\s]/.test(_this.text)) throw new Error("The text don't include invalid characters");
    });
    return this;
  }
  validate() {
    if (this.text == undefined || this.element == undefined) throw new Error('You are not set value to validate');
    let is_valid = true;
    for (let i = 0; i < this.rules.length; i++) {
      try {
        this.rules[i]();
      } catch (error) {
        is_valid = false;
        //@ts-ignore
        ErrorMessageWithElementValidation(error.message, this.getElement());
        break;
      }
    }
    if (is_valid) ErrorMessageWithElementValidation('', this.getElement());
    return is_valid;
  }
  setValue(text: string) {
    this.text = text;
    return this;
  }
}
