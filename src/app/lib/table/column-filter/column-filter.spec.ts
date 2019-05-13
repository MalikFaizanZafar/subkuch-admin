import { Component, DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { IsTableModule } from '../table.module';
import { IsTableService } from '../table.service';
import { IsColumnFilter } from './column-filter';

const filters = {
  name: {
    'Don': true,
    'Radha': true,
    'John': true
  }
};

describe('IsColumnFilter', () => {
  let fixture: ComponentFixture<any>;
  let testComponent;
  let filterDebug: DebugElement;
  let filterCmp: IsColumnFilter;
  let filter: HTMLElement;
  let tableService, filterTableSpy;

  function setValues(controller) {
    fixture = TestBed.createComponent(controller);
    testComponent = fixture.componentInstance;

    filterDebug = fixture.debugElement.query(By.directive(IsColumnFilter));
    filterCmp = filterDebug.componentInstance;
    filter = filterDebug.nativeElement;

    tableService = filterDebug.injector.get(IsTableService);
    spyOn(tableService, 'getFilter').and.returnValue(filters);
    filterTableSpy = spyOn(tableService, 'filterTable');
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        IsTableModule.forRoot(),
        BrowserAnimationsModule
      ],
      declarations: [
        BasicColumnFilterComponent
      ],
      providers: [ IsTableService ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  describe('BasicColumnFilterComponent', () => {
    beforeEach(() => {
      setValues(BasicColumnFilterComponent);
    });

    describe('Checkbox Toggle', () => {
      it('should call filterTable from filterService with updated filter', fakeAsync(() => {
        fixture.detectChanges();

        fixture.whenStable().then(() => {
          const checkbox = <HTMLInputElement> filter.querySelector('input[type=checkbox]');

          checkbox.checked = false;
          checkbox.dispatchEvent(new Event('change'));
          fixture.detectChanges();

          tick(10);

          expect(filterCmp.filter[checkbox.value]).toBeFalsy();
          expect(tableService.filterTable).toHaveBeenCalled();
        });
      }));

      it('should emit filterChange event', fakeAsync(() => {
        fixture.detectChanges();

        fixture.whenStable().then(() => {
          const checkbox = <HTMLInputElement> filter.querySelector('input[type=checkbox]');

          checkbox.checked = false;
          checkbox.dispatchEvent(new Event('change'));
          fixture.detectChanges();

          tick(10);

          expect(testComponent.changedFilter.filter).toEqual(filterCmp.filter);
          expect(testComponent.changedFilter.tableId).toEqual(filterCmp.tableId);
          expect(testComponent.changedFilter.filterBy).toEqual(filterCmp.filterBy);
        });
      }));

      it('should clear filter input', fakeAsync(() => {
        fixture.detectChanges();

        fixture.whenStable().then(() => {
          const checkbox = <HTMLInputElement> filter.querySelector('input[type=checkbox]');
          const filterInput = <HTMLInputElement> filter.querySelector('input[type=text]');

          filterInput.value = 'test';
          filterInput.dispatchEvent(new Event('change'));
          fixture.detectChanges();
          tick(10);
          expect(filterInput.value).toEqual('test');

          checkbox.checked = false;
          checkbox.dispatchEvent(new Event('change'));
          fixture.detectChanges();
          tick(10);
          expect(filterInput.value ).toEqual('');
        });
      }));
    });

    describe('Select All', () => {
      it('should call filterTable from filterService with updated filter', () => {
        fixture.detectChanges();

        const filterActions = filter.querySelectorAll('.is-filter-action');
        const selectAllBtn = filterActions[0];
        const clearBtn = filterActions[1];

        clearBtn.dispatchEvent(new Event('click'));
        expect(filterCmp.filter['Don']).toBeFalsy();
        expect(filterCmp.filter['Radha']).toBeFalsy();
        expect(filterCmp.filter['John']).toBeFalsy();

        selectAllBtn.dispatchEvent(new Event('click'));
        expect(filterCmp.filter['Don']).toBeTruthy();
        expect(filterCmp.filter['Radha']).toBeTruthy();
        expect(filterCmp.filter['John']).toBeTruthy();
        expect(tableService.filterTable).toHaveBeenCalled();
      });

      it('should emit filterChange event', () => {
        fixture.detectChanges();

        const filterActions = filter.querySelectorAll('.is-filter-action');
        const selectAllBtn = filterActions[0];

        selectAllBtn.dispatchEvent(new Event('click'));
        expect(testComponent.changedFilter.filter).toEqual(filterCmp.filter);
        expect(testComponent.changedFilter.tableId).toEqual(filterCmp.tableId);
        expect(testComponent.changedFilter.filterBy).toEqual(filterCmp.filterBy);
      });
    });

    describe('Clear All', () => {
      it('should call filterTable from filterService with updated filter', () => {
        fixture.detectChanges();

        const filterActions = filter.querySelectorAll('.is-filter-action');
        const clearBtn = filterActions[1];

        clearBtn.dispatchEvent(new Event('click'));
        expect(filterCmp.filter['Don']).toBeFalsy();
        expect(filterCmp.filter['Radha']).toBeFalsy();
        expect(filterCmp.filter['John']).toBeFalsy();
        expect(tableService.filterTable).toHaveBeenCalled();
      });

      it('should emit filterChange event', () => {
        fixture.detectChanges();

        const filterActions = filter.querySelectorAll('.is-filter-action');
        const clearBtn = filterActions[1];

        clearBtn.dispatchEvent(new Event('click'));
        expect(testComponent.changedFilter.filter).toEqual(filterCmp.filter);
        expect(testComponent.changedFilter.tableId).toEqual(filterCmp.tableId);
        expect(testComponent.changedFilter.filterBy).toEqual(filterCmp.filterBy);
      });
    });

    describe('Input Change', () => {
      it('should call filterTable from filterService with updated filter', () => {
        fixture.detectChanges();

        const filterInput = <HTMLInputElement> filter.querySelector('input[type=text]');
        filterInput.value = 'Don';
        filterInput.dispatchEvent(new Event('keyup'));

        expect(filterCmp.filter['Don']).toBeTruthy();
        expect(tableService.filterTable).toHaveBeenCalled();
      });

      it('should emit filterChange event', () => {
        fixture.detectChanges();

        const filterInput = <HTMLInputElement> filter.querySelector('input[type=text]');
        filterInput.value = 'Don';
        filterInput.dispatchEvent(new Event('keyup'));

        expect(testComponent.changedFilter.filter).toEqual(filterCmp.filter);
      });

      it('should update filter value with new input value', () => {
        fixture.detectChanges();

        const filterInput = <HTMLInputElement> filter.querySelector('input[type=text]');
        filterInput.value = 'Don';
        filterInput.dispatchEvent(new Event('keyup'));

        expect(filterCmp.filter['_filterInput']).toEqual('Don');
      });
    });
  });
});

@Component({
  template: `
  <is-column-filter [filterBy]="filterBy"
                    (onFilterChange)="filterChanged($event)"
                    [tableId]="tableId"></is-column-filter>
  `
})
class BasicColumnFilterComponent {
  filterBy = 'name';
  tableId = 1;
  changedFilter: any;

  filterChanged(event) {
    this.changedFilter = event;
  }
}
