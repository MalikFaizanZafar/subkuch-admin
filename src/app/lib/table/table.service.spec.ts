import { IsTableService } from './table.service';
import { IsTableOrderingType } from './table';
import { BreakpointObserver } from '@angular/cdk/layout/typings/breakpoints-observer';
import { cold } from 'jasmine-marbles';
import { IsTableConfiguration } from 'lib/table/table-configuration';

describe('IsTableService', () => {
  let service: IsTableService;
  let breakpointObserver: BreakpointObserver;
  let configuration: IsTableConfiguration;

  beforeEach(() => {
    configuration = {
      mediaQueryToOmitFeatures: '(max-width: 1200px)',
    };

    breakpointObserver = {
      observe: () => cold('a', { a: true })
    } as any;

    service = new IsTableService(configuration, breakpointObserver);
  });

  describe('onResize', () => {
    it('should emit resizeSource change', () => {
      let isResizeSourceChanged = false;
      service.$columnResize.subscribe(() => isResizeSourceChanged = true);
      service.onResize(null);

      expect(isResizeSourceChanged).toBeTruthy();
    });
  });

  describe('orderTable', () => {
    it('should emit sortedPropertyChanged', () => {
      let expectedValue;
      const order = {
        prop: 'name',
        orderType: <IsTableOrderingType> 'asc',
        alterTable: true,
        tableId: 1,
      };
      service.$sortedPropertyChanged.subscribe((value) => expectedValue = value);

      service.orderTable(order.prop, order.orderType, order.alterTable, order.tableId);

      expect(expectedValue).toEqual(order);
    });
  });

  describe('filterTable', () => {
    it('should emit filterChanged', () => {
      let expectedValue;
      const tableId = 0;
      service.filters[tableId] = {
        name: {
          'Radha': true,
          'John': true,
          'Mayor': false,
        },
      };
      service.$filterChanged.subscribe((value) => expectedValue = value);

      service.filterTable(tableId);

      expect(expectedValue.tableId).toEqual(tableId);
      expect(expectedValue.filter).toEqual(service.filters[tableId]);
    });
  });

  describe('isPropertyFiltered', () => {
    it('should return true if property is filtered', () => {
      const tableId = 0;
      service.filters = [];
      service.filters[tableId] = {
        name: {
          'Radha': true,
          'John': true,
          'Mayor': false,
        },
      };

      const result = service.isPropertyFiltered('name', tableId);

      expect(result).toBeTruthy();
    });

    it('should return false if property is not filtered', () => {
      const tableId = 0;
      service.filters = [];
      service.filters[tableId] = {
        name: {
          'Radha': true,
          'John': true,
          'Mayor': true,
        },
      };

      const result = service.isPropertyFiltered('name', tableId);

      expect(result).toBeFalsy();
    });

    it('should return false if prop doesn\'t exist in filters', () => {
      const tableId = 0;
      service.filters = [];
      service.filters[tableId] = {
        name: {
          'Radha': true,
          'John': true,
          'Mayor': true,
        },
      };

      const result = service.isPropertyFiltered('title', tableId);

      expect(result).toBeFalsy();
    });
  });

  describe('registerTable', () => {
    it('should increments numTables counter and returns incremented value', () => {
      expect(service.numTables).toEqual(0);

      const result = service.registerTable();

      expect(service.numTables).toEqual(1);
      expect(result).toEqual(1);
    });
  });

  describe('saveFilter', () => {
    it('should save filter', () => {
      expect(service.filters).toEqual([]);

      const filter = {
        name: {
          'Radha': true,
          'John': true,
          'Mayor': false,
        },
      };
      const tableId = 0;
      service.saveFilter(filter, tableId);

      expect(service.filters.length).toEqual(1);
      expect(service.filters[tableId]).toEqual(filter);
    });
  });

  describe('getFilter', () => {
    it('should get filter for given table id', () => {
      const filter = {
        name: {
          'Radha': true,
          'John': true,
          'Mayor': false,
        },
      };
      const tableId = 0;
      service.saveFilter(filter, tableId);

      const result = service.getFilter(tableId);

      expect(result).toEqual(filter);
    });
  });

  describe('setOpenedRow', () => {
    it('should set opened row for row\'s table id', () => {
      expect(service.openedRows).toEqual([]);

      const row = {
        tableId: 0,
        data: []
      };
      service.setOpenedRow(row);

      expect(service.openedRows.length).toEqual(1);
      expect(service.openedRows[row.tableId]).toEqual(row);
    });
  });

  describe('getOpenedRow', () => {
    it('should get opened row for given table id', () => {
      const row = {
        tableId: 0,
        data: []
      };
      service.setOpenedRow(row);

      const result = service.getOpenedRow(row.tableId);

      expect(result).toEqual(row);
    });
  });

  describe('setPopover', () => {
    it('should set popover for given table id', () => {
      const popover = 'test popover';
      const tableId = 0;
      service.setPopover(popover, tableId);

      expect(service.popovers[tableId].length).toEqual(1);
      expect(service.popovers[tableId][0]).toEqual(popover);
    });
  });

  describe('getPopovers', () => {
    it('should get all popovers for given table id', () => {
      const popover = 'test popover';
      const tableId = 0;
      service.setPopover(popover, tableId);

      const result = service.getPopovers(tableId);

      expect(result.length).toEqual(1);
      expect(result[tableId]).toEqual(popover);
    });
  });
});
