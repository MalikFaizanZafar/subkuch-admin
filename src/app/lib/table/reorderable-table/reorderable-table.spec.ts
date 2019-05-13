import { Component, DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { IsTableModule } from '../table.module';
import { IsReorderableTable } from './reorderable-table';

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

describe('IsReorderableTable', () => {
  let fixture: ComponentFixture<any>;
  let testComponent;
  let reorderableTableDebug: DebugElement;
  let reorderableTableCmp: IsReorderableTable;
  let reorderableTable: HTMLElement;

  function setValues(controller) {
    fixture = TestBed.createComponent(controller);
    fixture.detectChanges();
    testComponent = fixture.componentInstance;

    reorderableTableDebug = fixture.debugElement.query(By.directive(IsReorderableTable));
    reorderableTableCmp = reorderableTableDebug.componentInstance;
    reorderableTable = reorderableTableDebug.nativeElement;
  }

  function dispatchMouseEvent(eventType, clientX, clientY, target) {
    const mouseEvent = document.createEvent('MouseEvents');
    mouseEvent.initMouseEvent(
      eventType,
      true,
      false,
      window,
      1,
      clientX,
      clientY,
      clientX,
      clientY,
      false,
      false,
      false,
      false,
      0,
      null
    );

    target.dispatchEvent(mouseEvent);
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        IsTableModule.forRoot(),
        BrowserAnimationsModule
      ],
      declarations: [
        BasicReorderableTableComponent
      ],
      providers: [],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  describe('BasicReorderableTableComponent', () => {
    beforeEach(() => {
      setValues(BasicReorderableTableComponent);
    });

    it('should change order of columns when column is dragged from left to right', fakeAsync(() => {
      fixture.detectChanges();
      tick(200);

      let cols = reorderableTable.querySelectorAll('th');
      const header1 = cols[1].textContent;
      const header2 = cols[2].textContent;

      dispatchMouseEvent('mousedown', 116, 8, cols[1]);
      tick(200);

      dispatchMouseEvent('mousemove', 200, 10, cols[1]);
      tick(200);

      dispatchMouseEvent('mouseup', 200, 10, cols[2]);
      tick(300);

      cols = reorderableTable.querySelectorAll('th');
      expect(cols[1].textContent).toEqual(header2);
      expect(cols[2].textContent).toEqual(header1);
    }));

    it('should not change order of columns when column is dragged from right to left', fakeAsync(() => {
      fixture.detectChanges();
      tick(200);

      let cols = reorderableTable.querySelectorAll('th');
      const header1 = cols[2].textContent;
      const header2 = cols[3].textContent;

      dispatchMouseEvent('mousedown', 492, 8, cols[3]);
      tick(200);

      dispatchMouseEvent('mousemove', 550, 10, cols[3]);
      tick(200);

      dispatchMouseEvent('mouseup', 550, 10, cols[2]);
      tick(300);

      cols = reorderableTable.querySelectorAll('th');
      expect(cols[2].textContent).toEqual(header1);
      expect(cols[3].textContent).toEqual(header2);
    }));

    it('should not change order of columns of dragged and dropped columns are same', fakeAsync(() => {
      let cols = reorderableTable.querySelectorAll('th');
      const header = cols[0].textContent;

      dispatchMouseEvent('mousedown', 0, 10, cols[0]);
      tick(200);

      dispatchMouseEvent('mousemove', 0, 10, cols[0]);
      tick(200);

      dispatchMouseEvent('mouseup', 0, 10, cols[0]);
      tick(300);

      cols = reorderableTable.querySelectorAll('th');
      expect(cols[0].textContent).toEqual(header);
    }));

    it('should not drag component if mouseup is anywhere else on document', fakeAsync(() => {
      let cols = reorderableTable.querySelectorAll('th');
      const header = cols[1].textContent;

      dispatchMouseEvent('mousedown', 116, 8, cols[1]);
      tick(200);

      dispatchMouseEvent('mousemove', 200, 10, cols[1]);
      tick(200);

      document.dispatchEvent(new Event('mouseup'));

      cols = reorderableTable.querySelectorAll('th');
      expect(cols[1].textContent).toEqual(header);
    }));

    it('should not drag component if mouseleave component', fakeAsync(() => {
      let cols = reorderableTable.querySelectorAll('th');
      const header = cols[1].textContent;

      dispatchMouseEvent('mousedown', 116, 8, cols[1]);
      tick(200);

      dispatchMouseEvent('mousemove', 200, 10, cols[1]);
      tick(200);

      cols[1].dispatchEvent(new Event('mouseleave'));

      cols = reorderableTable.querySelectorAll('th');
      expect(cols[1].textContent).toEqual(header);
    }));
  });
});

@Component({
  template: `
  <table is-table
         [data]="data"
         is-reorderable-table>
    <thead>
      <tr is-table-row>
        <th is-reorderable-column>Name</th>
        <th is-reorderable-column>Lastname</th>
        <th is-reorderable-column>Title</th>
        <th is-reorderable-column>Language</th>
        <th is-reorderable-column="false">Hobbie <code>(Non Draggable)</code> </th>
        </tr>
    </thead>
    <tbody>
      <tr *ngFor="let obj of data"
          is-table-row>
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
class BasicReorderableTableComponent {
  data = tableMockData;
}
