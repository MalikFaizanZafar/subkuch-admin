import { AbstractControl } from '@angular/forms';
import { TypedValidatorFunction } from '../model/typed-validator-function';

/**
 * Generates a comparison validator function to be used with FormGroups.
 * @param firstKey First control name
 * @param secondKey Second control name
 * @param validationKey The name to be used for the validation error key
 * @param compareFn The comparator function which returns true when valid
 * @param skipWhenNull if it should skip validation when values are null, defaults to true
 */
export function compareValidatorGenerator<K extends string>(
  firstKey: string,
  secondKey: string,
  validationKey: K,
  compareFn: (firstValue: any, secondValue: any) => boolean,
  skipWhenNull: boolean = true
): TypedValidatorFunction<K, true> {
  return (control: AbstractControl): Record<K, true> => {
    const value: Record<string, any | undefined> = control.value;
    const first: any = value[firstKey];
    const second: any = value[secondKey];
    if (first === undefined || second === undefined) {
      throw new Error(
        `Compare validator couldn't find control(s) with name(s) ${firstKey}/${secondKey}`
      );
    }
    if (skipWhenNull && (first === null || second === null)) {
      return null;
    }
    if (!compareFn(first, second)) {
      // casting to any here because Typescript does not correctly check this as a valid Record<K, true>
      return { [validationKey as string]: true } as any;
    }
    return null;
  };
}
