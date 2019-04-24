import { IsKey } from '../model/key';

/**
 * Whether the key is escape key or not.
 * @param key
 */
export function isEscapeKey(key: string): boolean {
  return key === IsKey.Esc || key === IsKey.EscIE;
}

/**
 * Whether the key is arrow down key or not.
 * @param key
 */
export function isArrowDownKey(key: string): boolean {
  return key === IsKey.Down || key === IsKey.DownIE;
}

/**
 * Whether the key is arrow up key or not.
 * @param key
 */
export function isArrowUpKey(key: string): boolean {
  return key === IsKey.Up || key === IsKey.UpIE;
}

/**
 * Whether the key is arrow left key or not.
 * @param key
 */
export function isArrowLeftKey(key: string): boolean {
  return key === IsKey.ArrowLeft || key === IsKey.LeftIE;
}

/**
 * Whether the key is arrow right key or not.
 * @param key
 */
export function isArrowRightKey(key: string): boolean {
  return key === IsKey.RightIE || key === IsKey.ArrowRight;
}

/**
 * Whether the key is enter key or not.
 * @param key
 */
export function isEnterKey(key: string): boolean {
  return key === IsKey.Enter;
}
