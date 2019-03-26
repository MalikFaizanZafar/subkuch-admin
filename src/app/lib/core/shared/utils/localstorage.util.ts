/**
 * Created by egonzalez<edgard.gonzalez@aurea.com> on 08/05/2017.
 */

export class IsLocalStorage {

  /**
   * Writes an object in localstorage
   */
  static set( key: string, value: any ) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  /**
   * Retrieves an object from the localstorage
   */
  static get( key: string ) {
    return JSON.parse(localStorage.getItem(key));
  }

  /**
   * Clears the localstorage
   */
  static clear() {
    localStorage.clear();
  }
}
