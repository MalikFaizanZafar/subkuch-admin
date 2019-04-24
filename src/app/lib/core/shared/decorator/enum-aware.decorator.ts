/**
 * Allows the use of enum inside a component's template, without the need of
 * defining a variable to use the enum
 * @param enums object with key as enum name and value as enum definition
 *
 * @example
 *
 * export enum SomeEnumName {
 *   Foo,
 *   Bar
 * }
 *
 * @IsEnumAware({'SomeEnumName': SomeEnumName})
 * @Component({
 *  template: `<div *ngIf="selected === SomeEnumName.Foo">It's works</div>`
 * })
 * export class SomeComponent {
 *   selected: SomeEnumName = SomeEnumName.Foo;
 * }
 *
 */
export function IsEnumAware( enums: { [id: string]: { [id: number]: string } } ): any {
  return ( constructor: () => {} ): void => {
    for (const key of Object.keys(enums)) {
      constructor.prototype[key] = enums[key];
    }
  };
}
