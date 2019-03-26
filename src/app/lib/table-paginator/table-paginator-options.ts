export class IsTablePaginatorOptions {
  /**
   * Whether or not to show excel export button.
   */
  showExcel?: boolean;

  /**
   * Whether or not to show pis export button.
   */
  showPis?: boolean;

  /**
   * Whether or not to show print button.
   */
  showPrint?: boolean;

  /**
   * Whether or not to show pagination.
   */
  showPaginator?: boolean;

  /**
   * Whether or not to show search input.
   */
  showSearchInput?: boolean;

  /**
   * Whether or not to show search input's match case.
   */
  showMatchCase?: boolean;

  constructor() {
    this.showPis = true;
    this.showPrint = true;
    this.showPaginator = true;
    this.showSearchInput = true;
    this.showMatchCase = true;
  }
}
