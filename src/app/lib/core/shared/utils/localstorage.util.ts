export class IsLocalStorage {

  /**
   * Writes an object in localstorage
   */
  static set( key: string, value: any ): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  /**
   * Retrieves an object from the localstorage
   */
  static get( key: string ): any {
    return JSON.parse(localStorage.getItem(key));
  }

  /**
   * Clears the localstorage
   */
  static clear(): void {
    localStorage.clear();
  }
}
