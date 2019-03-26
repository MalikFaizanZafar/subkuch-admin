import { IsCheckbox } from './checkbox';

/** Change event object emitted by IsCheckbox. */
export class IsCheckboxChange {
  /** The source IsCheckbox of the event. */
  source: IsCheckbox;
  /** The new `checked` value of the checkbox. */
  checked: boolean;
}

export enum IsCheckboxState {
  Checked,
  UnChecked,
  Indeterminate
}
