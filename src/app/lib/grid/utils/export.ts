
import { IsGridColumn } from '../shared/column';
import { ObjectUtils } from '../utils/object-utils';

/**
 * Helper class that manages the Export to CSV feature on the grid
 */
export class IsGridExportHandler {

  /**
   * Utilities to do object manipulation
   */
  objectUtils: ObjectUtils;

  /**
   * Creates an instance of IsGridExportHandler.
   * @param objectUtils utils to do object manipulation
   */
  constructor(objectUtils: ObjectUtils) {
    this.objectUtils = objectUtils;
  }

  /**
   * Exports data to CSV format
   * @param data data
   * @param csvSeparator CSV separator
   * @param exportFilename export file name
   * @param columns grid columns
   */
  exportCSV(
    data: any[],
    csvSeparator,
    exportFilename,
    columns: IsGridColumn[]
  ) {
    let csv = '\ufeff';

    // headers
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.exportable && column.field) {
        csv += '"' + (column.header || column.field) + '"';

        if (i < columns.length - 1) {
          csv += csvSeparator;
        }
      }
    }

    // body
    data.forEach((record) => {
      csv += '\n';
      for (let i = 0; i < columns.length; i++) {
        const column = columns[i];
        if (column.exportable && column.field) {
          let cellData = this.objectUtils.resolveFieldData(
            record,
            column.field
          );

          if (cellData != null) {
            cellData = String(cellData).replace(/'/g, '""');
          } else {
            cellData = '';
          }

          csv += '"' + cellData + '"';

          if (i < columns.length - 1) {
            csv += csvSeparator;
          }
        }
      }
    });

    const blob = new Blob([csv], {
      type: 'text/csv;charset=utf-8;'
    });

    if (window.navigator.msSaveOrOpenBlob) {
      navigator.msSaveOrOpenBlob(blob, exportFilename + '.csv');
    } else {
      const link = document.createElement('a');
      link.style.display = 'none';
      document.body.appendChild(link);
      if (link.download !== undefined) {
        link.setAttribute('href', URL.createObjectURL(blob));
        link.setAttribute('download', exportFilename + '.csv');
        link.click();
      } else {
        csv = 'data:text/csv;charset=utf-8,' + csv;
        window.open(encodeURI(csv));
      }
      document.body.removeChild(link);
    }
  }
}
