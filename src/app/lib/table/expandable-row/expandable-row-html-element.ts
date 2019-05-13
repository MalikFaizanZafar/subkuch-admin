/**
 * IsExpandableRowHTMLElement interface is a simple extension of {HTMLElement}
 * just adding expandableRowAvoider property to get IsExpandableRowAvoider
 * working properly.
 */
export interface IsExpandableRowHTMLElement extends HTMLElement {
  expandableRowAvoider: boolean;
}
