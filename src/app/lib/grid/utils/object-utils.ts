import { Injectable } from '@angular/core';

@Injectable()
export class ObjectUtils {

  /**
   * Returns the value inside `data` given its deep path via `field` param.
   * e.g. it's a shortcut to retrieve things like data[deep.field.path]
   * @param data - the object where the value must be retrieved from
   * @param field - deep path to the value requested
   * @returns data[field]
   */
  resolveFieldData(data: any, field: string): any {
    if (data && field) {
      if (field.indexOf('.') === -1) {
        return data[field];
      } else {
        const fields: string[] = field.split('.');
        let value = data;
        for (let i = 0; i < fields.length; ++i) {
          if (value == null) {
            return null;
          }
          value = value[fields[i]];
        }
        return value;
      }
    } else {
      return null;
    }
  }

  /**
   * Moves value[from] in front of value[to]. This method mutates the array.
   * @param value - the array which must be changed
   * @param from - the origin position
   * @param to - the source position
   */
  reorderArray(value: any[], from: number, to: number) {
    let target: number;
    if (value && from !== to) {
      if (to >= value.length) {
        target = to - value.length;
        while (target-- + 1) {
          value.push(undefined);
        }
      }
      value.splice(to, 0, value.splice(from, 1)[0]);
    }
  }

  /**
   * Evaluates two objects for equality. If `field` is specified,
   * the evaluation is done over the specified field. Deep paths
   * are acceptable as `field`.
   * @param obj1
   * @param obj2
   * @param [field] - optional field to compare the objects agains
   * @returns true of the objects are equal, false otherwise
   */
  equals(obj1: any, obj2: any, field?: string): boolean {
    if (field) {
      return (
        this.resolveFieldData(obj1, field) ===
        this.resolveFieldData(obj2, field)
      );
    } else {
      return this.equalsByValue(obj1, obj2);
    }
  }

  /**
   * Evaluates two objects for equality.
   * @param obj1
   * @param obj2
   * @returns true of the objects are equal, false otherwise
   */
  equalsByValue(obj1: any, obj2: any): boolean {
    if (obj1 == null && obj2 == null) {
      return true;
    }
    if (obj1 == null || obj2 == null) {
      return false;
    }

    if (obj1 === obj2) {
      delete obj1._$visited;
      return true;
    }

    if (typeof obj1 === 'object' && typeof obj2 === 'object') {
      obj1._$visited = true;
      for (const p in obj1) {
        if (p === '_$visited') {
          continue;
        }
        if (obj1.hasOwnProperty(p) !== obj2.hasOwnProperty(p)) {
          return false;
        }

        switch (typeof obj1[p]) {
          case 'object':
            if (
              (obj1[p] && obj1[p]._$visited) ||
              !this.equals(obj1[p], obj2[p])
            ) {
              return false;
            }
            break;

          case 'function':
            if (
              typeof obj2[p] === 'undefined' ||
              (p !== 'compare' && obj1[p].toString() !== obj2[p].toString())
            ) {
              return false;
            }
            break;

          default:
            if (obj1[p] !== obj2[p]) {
              return false;
            }
            break;
        }
      }

      for (const p2 in obj2) {
        if (typeof obj1[p2] === 'undefined') {
          return false;
        }
      }

      delete obj1._$visited;
      return true;
    }

    return false;
  }
}
