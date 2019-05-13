import {
  Component,
  DebugElement,
  NO_ERRORS_SCHEMA
} from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { IsTable } from './index';
import { IsTableService } from './table.service';
import { IsTableModule } from './table.module';

const tableMockData = [
  {
    name: 'Don',
    lastname: 'Bakr',
    title: 'QA Engineer',
    language: 'Clojure',
    hobbie: 'Poker',
    age: 10,
    expanded: false
  }, {
    name: 'Anibal',
    lastname: 'Samuel',
    title: 'UI Designer',
    language: 'C#',
    hobbie: 'Poker',
    age: 20,
    expanded: false
  }, {
    name: 'Radha',
    lastname: 'Dawa',
    title: 'Backend Developer',
    language: 'JavaScript',
    hobbie: 'Poker',
    age: 7,
    expanded: false
  }
];

describe('IsTable', () => {
  let fixture: ComponentFixture<any>;
  let testComponent;
  let tableDebug: DebugElement;
  let tableCmp: IsTable;
  let table: HTMLElement;
  let tableService, registerTableSpy, saveFilterSpy, isPropertyFilteredSpy;

  function setValues(controller) {
    fixture = TestBed.createComponent(controller);
    testComponent = fixture.componentInstance;

    tableDebug = fixture.debugElement.query(By.directive(IsTable));
    tableCmp = tableDebug.componentInstance;
    table = tableDebug.nativeElement;
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        IsTableModule.forRoot(),
        BrowserAnimationsModule
      ],
      declarations: [
        BasicTableComponent,
        TableWithDefaultSortOrderComponent,
        TableWithDefaultSortOrderObjComponent,
        TableWithResponsivenessComponent
      ],
      providers: [
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  describe('BasicTableComponent', () => {
    beforeEach(() => {
      setValues(BasicTableComponent);

      tableService = tableDebug.injector.get(IsTableService);
      registerTableSpy = spyOn(tableService, 'registerTable').and.returnValue(1);
      saveFilterSpy = spyOn(tableService, 'saveFilter');
      isPropertyFilteredSpy = spyOn(tableService, 'isPropertyFiltered').and.returnValue(false);
    });

    it('should create dataCopy after view init', (done) => {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(tableCmp['dataCopy'].length).toEqual(tableCmp.data.length);
        done();
      });
    });

    it('should register table in table service', () => {
      fixture.detectChanges();
      expect(registerTableSpy).toHaveBeenCalled();
    });

    it('should set class and table id attribute on id', () => {
      fixture.detectChanges();
      expect(table.classList).toContain('is-table__id-1');
      expect(table.getAttribute('is-table-id')).toEqual('1');
    });

    it('should set table id attribute on all header columns', () => {
      fixture.detectChanges();
      const ths = table.querySelectorAll('th');

      for (let i = 0; i < ths.length; i++) {
        expect(ths[i].getAttribute('table-id')).toEqual('1');
      }
    });

    it('should set table id attribute on all rows', () => {
      fixture.detectChanges();
      const rows = table.querySelectorAll('tr');

      for (let i = 0; i < rows.length; i++) {
        expect(rows[i].getAttribute('table-id')).toEqual('1');
      }
    });

    it('should init filters with columns having [filterable] and register them to table service', (done) => {
      expect(tableCmp.filter).toEqual({});
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        const props = Object.keys(tableCmp.filter);
        expect(props.length).toEqual(4);
        for (let i = 0; i < props.length; i++) {
          const innerProps = Object.keys(tableCmp.filter[props[i]]);
          const uniqueData = tableCmp.data
            .map(row => row[props[i]])
            .reduce((result, val) => {
              if (result.indexOf(val) === -1) {
                result.push(val);
              }
              return result;
            }, []);
          expect(innerProps.length).toEqual(uniqueData.length);
          for (let j = 0; j < innerProps.length; j++) {
            expect(innerProps[j]).toEqual(uniqueData[j]);
            expect(tableCmp.filter[props[i]][innerProps[j]]).toBeTruthy();
          }
        }

        expect(saveFilterSpy).toHaveBeenCalledWith(tableCmp.filter, 1);
        done();
      });
    });

    it('should subscribe to sortedPropertyChanged observable that orders the table data and saves the order', (done) => {
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        const order = {
          prop: 'name',
          orderType: 'asc',
          alterTable: true,
          tableId: 1,
        };
        tableService.sortedPropertyChangedSource.next(order);

        expect(tableCmp.data[0][order.prop]).toEqual('Anibal');
        expect(tableCmp.data[1][order.prop]).toEqual('Don');
        expect(tableCmp.data[2][order.prop]).toEqual('Radha');

        expect(tableCmp['currentOrder'].prop).toEqual(order.prop);
        expect(tableCmp['currentOrder'].orderType).toEqual(order.orderType);

        done();
      });
    });

    it('should subscribe to filterChanged observable that filters the table data with given payload', (done) => {
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        const payload = {
          filter: tableCmp.filter,
          tableId: 1
        };
        payload.filter['name']['Don'] = false;

        tableService.filterChangedSource.next(payload);

        const names = tableCmp.data.map(row => row.name);
        expect(tableCmp.data.length).toEqual(2);
        expect(names).not.toContain('Don');

        done();
      });
    });

    it('should close all popovers on document click if click is outside filter body', (done) => {
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        const popover = {
          isOpen: jasmine.createSpy('isOpen').and.returnValue(true),
          close: jasmine.createSpy('close')
        };
        spyOn(tableService, 'getPopovers').and.returnValue([popover]);

        document.dispatchEvent(new Event('click'));
        expect(popover.close).toHaveBeenCalled();

        done();
      });
    });

    describe('ngOnChange', () => {
      const newRow = {
        name: 'Keshav',
        lastname: 'Mihar',
        title: 'Frontend Developer',
        language: 'Angular',
        hobbie: 'Dance',
        age: 15,
        expanded: false
      };
      let newData, initFilterSpy, prepareForResponsivenessSpy;

      beforeEach(() => {
        newData = tableMockData.concat([newRow]);
        // using any because we're spying a private method here, so typescript isn't able to include it in the keyof IsTable param
        initFilterSpy = spyOn(tableCmp, 'initFilter' as any);
        prepareForResponsivenessSpy = spyOn(tableCmp, 'prepareForResponsiveness');
      });

      it('should re init the filters and registers them to table service', fakeAsync(() => {
        fixture.detectChanges();
        tick(100);

        testComponent.data = newData.slice();
        fixture.detectChanges();
        tick(100);
        expect(initFilterSpy).toHaveBeenCalled();
        expect(saveFilterSpy).toHaveBeenCalled();
      }));

      it('should recreate data copy', fakeAsync(() => {
        fixture.detectChanges();
        tick(100);
        expect(tableCmp['dataCopy'].length).toEqual(tableMockData.length);

        testComponent.data = newData.slice();
        fixture.detectChanges();
        tick(100);
        expect(tableCmp['dataCopy'].length).toEqual(tableMockData.length + 1);
      }));

      it('should prepare table for responsiveness if responsive property is set', fakeAsync(() => {
        fixture.detectChanges();
        tick(100);

        testComponent.data = newData.slice();
        fixture.detectChanges();
        tick(100);
        expect(prepareForResponsivenessSpy).toHaveBeenCalled();
      }));
    });
  });

  describe('TableWithDefaultSortOrderComponent', () => {
    beforeEach(() => {
      setValues(TableWithDefaultSortOrderComponent);
      isPropertyFilteredSpy = spyOn(tableService, 'isPropertyFiltered').and.returnValue(false);
    });
    it('should sort table data with with default order', (done) => {
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        expect(tableCmp.data[0]['language']).toEqual('JavaScript');
        expect(tableCmp.data[1]['language']).toEqual('Clojure');
        expect(tableCmp.data[2]['language']).toEqual('C#');

        done();
      });
    });
  });

  describe('TableWithDefaultSortOrderObjComponent', () => {
    beforeEach(() => {
      setValues(TableWithDefaultSortOrderObjComponent);
    });
    it('should sort table data with with default order', (done) => {
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        expect(tableCmp.data[0]['language']).toEqual('C#');
        expect(tableCmp.data[1]['language']).toEqual('Clojure');
        expect(tableCmp.data[2]['language']).toEqual('JavaScript');

        done();
      });
    });
  });

  describe('TableWithResponsivenessComponent', () => {
    beforeEach(() => {
      setValues(TableWithResponsivenessComponent);
    });

    it('should prepare table for responsiveness if responsive property is set', (done) => {
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        const tds = table.querySelectorAll('td');
        const headerTexts = [
          'Name',
          'Lastname',
          'Title',
          'Language',
          'Hobbie'
        ];

        for (let i = 0; i < tds.length; i++) {
          expect(tds[i].getAttribute('data-header')).toEqual(headerTexts[i % 5]);
          expect(tds[i].getAttribute('aria-label')).toEqual(headerTexts[i % 5]);
        }

        done();
      });
    });
  });
});

@Component({
  template: `
  <table is-table
         [data]="data">
    <thead>
      <tr>
        <th is-sortable-column sortBy="name" filterable>Name</th>
        <th is-sortable-column sortBy="lastname" filterable>Lastname</th>
        <th is-sortable-column sortBy="title" filterable>Title</th>
        <th is-sortable-column sortBy="language" filterable>Language</th>
        <th>Hobbie</th>
      </tr>
    </thead>
    <tbody>
      <tr *ngFor="let obj of data">
        <td>{{obj.name}}</td>
        <td>{{obj.lastname}}</td>
        <td>{{obj.title}}</td>
        <td>{{obj.language}}</td>
        <td>{{obj.hobbie}}</td>
      </tr>
    </tbody>
  </table>
  `
})
class BasicTableComponent {
  data = tableMockData.slice();
}

@Component({
  template: `
  <table is-table
         [data]="data"
         defaultOrder="language">
    <thead>
      <tr>
        <th>Name</th>
        <th>Lastname</th>
        <th>Title</th>
        <th>Language</th>
        <th>Hobbie</th>
      </tr>
    </thead>
    <tbody>
      <tr *ngFor="let obj of data">
        <td>{{obj.name}}</td>
        <td>{{obj.lastname}}</td>
        <td>{{obj.title}}</td>
        <td>{{obj.language}}</td>
        <td>{{obj.hobbie}}</td>
      </tr>
    </tbody>
  </table>
  `
})
class TableWithDefaultSortOrderComponent {
  data = tableMockData.slice();
}

@Component({
  template: `
  <table is-table
         [data]="data"
         [defaultOrder]="defaultOrder">
    <thead>
      <tr>
        <th>Name</th>
        <th>Lastname</th>
        <th>Title</th>
        <th>Language</th>
        <th>Hobbie</th>
      </tr>
    </thead>
    <tbody>
      <tr *ngFor="let obj of data">
        <td>{{obj.name}}</td>
        <td>{{obj.lastname}}</td>
        <td>{{obj.title}}</td>
        <td>{{obj.language}}</td>
        <td>{{obj.hobbie}}</td>
      </tr>
    </tbody>
  </table>
  `
})
class TableWithDefaultSortOrderObjComponent {
  data = tableMockData.slice();
  defaultOrder = {
    property: 'age',
    tableId: 1
  };
}

@Component({
  template: `
  <table is-table
         [data]="data"
         class="is-table--responsive">
    <thead>
      <tr>
        <th>Name</th>
        <th>Lastname</th>
        <th>Title</th>
        <th>Language</th>
        <th>Hobbie</th>
      </tr>
    </thead>
    <tbody>
      <tr *ngFor="let obj of data">
        <td>{{obj.name}}</td>
        <td>{{obj.lastname}}</td>
        <td>{{obj.title}}</td>
        <td>{{obj.language}}</td>
        <td>{{obj.hobbie}}</td>
      </tr>
    </tbody>
  </table>
  `
})
class TableWithResponsivenessComponent {
  data = tableMockData.slice();
}
