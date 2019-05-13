import { Component, DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { IsTableModule } from '../table.module';
import { IsTableService } from '../table.service';
import { IsSortableColumn } from './sortable-column';

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

describe('IsSortableColumn', () => {
  let fixture: ComponentFixture<any>;
  let testComponent;
  let sortableColDebug: DebugElement[];
  let sortableColCmp: IsSortableColumn;
  let sortableCol: HTMLElement;
  let tableService, setPopoverSpy, orderTableSpy;

  function setValues(controller) {
    fixture = TestBed.createComponent(controller);
    fixture.detectChanges();
    testComponent = fixture.componentInstance;

    sortableColDebug = fixture.debugElement.queryAll(By.directive(IsSortableColumn));
    sortableColCmp = sortableColDebug[0].componentInstance;
    sortableCol = sortableColDebug[0].nativeElement;

    tableService = sortableColDebug[0].injector.get(IsTableService);
    setPopoverSpy = spyOn(tableService, 'setPopover');
    orderTableSpy = spyOn(tableService, 'orderTable');
    spyOn(tableService, 'isPropertyFiltered').and.callFake((sortBy) => {
      if (sortBy === 'name') {
        return true;
      } else {
        return false;
      }
    });
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        IsTableModule.forRoot(),
        BrowserAnimationsModule
      ],
      declarations: [
        BasicSortableColumnComponent
      ],
      providers: [ IsTableService ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  describe('BasicSortableColumnComponent', () => {
    beforeEach(() => {
      setValues(BasicSortableColumnComponent);
    });

    it('should emit onSort on sort order change', () => {
      fixture.detectChanges();

      tableService.sortedPropertyChangedSource.next({
        prop: 'lastname'
      });
      expect(sortableColCmp.orderType).toBeUndefined();

      let result;
      sortableColCmp.onSort.subscribe(val => result = val);
      tableService.sortedPropertyChangedSource.next({
        prop: 'name',
        orderType: 'asc',
      });

      expect(result.property).toEqual('name');
      expect(result.order).toEqual('asc');
    });

    it('should update order and emit onSort on click', (done) => {
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        let result;
        sortableColCmp.onSort.subscribe(val => result = val);
        sortableCol.dispatchEvent(new Event('click'));
        fixture.detectChanges();

        fixture.whenStable().then(() => {
          expect(orderTableSpy).toHaveBeenCalledWith('name', 'asc', true, sortableColCmp.tableId);
          expect(result.property).toEqual('name');
          expect(result.order).toEqual('asc');

          done();
        });
      });
    });

    it('should emit onFilterChange event if onFilterChange event is emitted by column filter', (done) => {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        let result;
        sortableColCmp.onFilterChange.subscribe(val => result = val);
        sortableColCmp.filterChanged('test');

        expect(result).toEqual('test');
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
        <th is-sortable-column
            sortBy="name"
            filterable>Name</th>
        <th is-sortable-column
            sortBy="lastname"
            filterable>Lastname</th>
        <th is-sortable-column
            sortBy="title">Title</th>
        <th is-sortable-column
            sortBy="language">Language</th>
        <th is-sortable-column
            sortBy="hobbie">Hobbie</th>
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
class BasicSortableColumnComponent {
  data = tableMockData;
}
