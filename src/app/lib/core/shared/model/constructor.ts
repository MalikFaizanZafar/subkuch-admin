/**
 * Represents a type that has a constructor function
 */
export type Constructor<T = {}> = new(...args: any[]) => T;
