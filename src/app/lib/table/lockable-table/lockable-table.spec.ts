import { Component, DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { getNewLockedData, tableMockData } from '../../../app/module/components/pages/table/table-mock-data';
import { IsResizeService } from '../../core/index';
import { IsTableModule } from '../table.module';
import { IsTableService } from '../table.service';
import { IsLockableTable } from './index';

describe('IsLockableTable', () => {
  let fixture: ComponentFixture<any>;
  let testComponent;
  let lockableTableDebug: DebugElement;
  let lockableTableCmp: IsLockableTable;
  let lockableTable: HTMLElement;
  let tableService;
  const heightError = 0.5;
  let originalTimeout;

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

  function setValues(controller) {
    fixture = TestBed.createComponent(controller);
    testComponent = fixture.componentInstance;

    lockableTableDebug = fixture.debugElement.query(By.directive(IsLockableTable));
    lockableTableCmp = lockableTableDebug.componentInstance;
    lockableTable = lockableTableDebug.nativeElement;
  }

  beforeAll(() => {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 120000;
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        IsTableModule.forRoot(),
        BrowserAnimationsModule
      ],
      declarations: [
        BasicLockableTableComponent
      ],
      providers: [
        IsResizeService
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  afterAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });

  describe('BasicLockableTableComponent', () => {
    beforeEach(() => {
      setValues(BasicLockableTableComponent);

      tableService = lockableTableDebug.injector.get(IsTableService);
    });

    describe('Reorder Columns', () => {
      let th, thLockBtn, tableRows, thWidth, top;
      beforeEach((done) => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          th = <HTMLElement> lockableTable.querySelector('th');
          tableRows = lockableTable.querySelectorAll('tr');

          thLockBtn = th.querySelector('.is-lockable-button');
          thLockBtn.dispatchEvent(new Event('click'));
          thWidth = th.style.width;
          top = tableRows[0].offsetHeight + 4;

          done();
        });
      });

      it('should create padding if any of the column is locked', (done) => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          // Assuming first row is header row
          const paddingTh = <HTMLElement> tableRows[0].querySelector('[id=\'paddingTh\']');
          expect(paddingTh).not.toEqual(null);
          expect(paddingTh.style.width).toEqual(thWidth);
          expect(paddingTh.style.minWidth).toEqual(thWidth);
          expect(paddingTh.style.maxWidth).toEqual(thWidth);

          let paddingTd;
          for (let i = 1; i < tableRows.length; i++) {
            paddingTd = <HTMLElement> tableRows[i].querySelector('[id=\'paddingTd\']');
            expect(paddingTd).not.toEqual(null);
            expect(paddingTd.style.width).toEqual(thWidth);
            expect(paddingTd.style.minWidth).toEqual(thWidth);
            expect(paddingTd.style.maxWidth).toEqual(thWidth);
          }

          done();
        });
      });

      it('should adjust boundaries of locked header column', (done) => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          const height = tableRows[0].offsetHeight;

          expect(th.style.top).toEqual('0px');
          expect(th.style.left).toEqual('0px');
          expect(th.style.width).toEqual(thWidth);
          expect(th.style.minWidth).toEqual(thWidth);
          expect(th.style.height).toEqual(`${height - heightError}px`);

          done();
        });
      });

      it('should adjust boundaries of data columns associated with locked header column', (done) => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          for (let i = 1; i < tableRows.length; i++) {
            const height = tableRows[i].offsetHeight;
            const td = <HTMLElement> tableRows[i].querySelectorAll('td')[1]; // Skip paddingTd

            expect(td.style.top).toEqual(`${top}px`);
            expect(td.style.left).toEqual('0px');
            expect(td.style.width).toEqual(thWidth);
            expect(td.style.minWidth).toEqual(thWidth);
            expect(td.style.height).toEqual(`${height - heightError}px`);

            top += (height + 4);
          }

          done();
        });
      });

      it('should sort locked columns if columns are reorderable', (done) => {
        let headerColumns = lockableTable.querySelectorAll('th');
        dispatchMouseEvent('mousedown', 116, 8, headerColumns[5]);
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          dispatchMouseEvent('mousemove', 200, 10, headerColumns[5]);
          fixture.detectChanges();
          fixture.whenStable().then(() => {
            dispatchMouseEvent('mouseup', 200, 10, headerColumns[3]);
            fixture.detectChanges();
            fixture.whenStable().then(() => {
              headerColumns = lockableTable.querySelectorAll('th');

              headerColumns[3].querySelector('.is-lockable-button').dispatchEvent(new Event('click'));
              headerColumns[5].querySelector('.is-lockable-button').dispatchEvent(new Event('click'));
              headerColumns[4].querySelector('.is-lockable-button').dispatchEvent(new Event('click'));
              fixture.detectChanges();
              fixture.whenStable().then(() => {
                const lockedColumns = lockableTable.querySelectorAll('.is-lockable-column--locked');
                expect(lockedColumns[0].textContent).toContain('Name');
                expect(lockedColumns[1].textContent).toContain('Title');
                expect(lockedColumns[2].textContent).toContain('Hobbie');
                expect(lockedColumns[3].textContent).toContain('Language');

                done();
              });
            });
          });
        });
      });

      it('should remove extra padding from header and data rows', (done) => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          thLockBtn.dispatchEvent(new Event('click'));
          fixture.detectChanges();
          fixture.whenStable().then(() => {
            // Assuming first row is header row
            const paddingTh = <HTMLElement> tableRows[0].querySelector('[id=\'paddingTh\']');
            expect(paddingTh).toEqual(null);

            let paddingTd;
            for (let i = 1; i < tableRows.length; i++) {
              paddingTd = <HTMLElement> tableRows[i].querySelector('[id=\'paddingTd\']');
              expect(paddingTd).toEqual(null);
            }
            done();
          });
        });
      });
    });

    describe('Column resize', () => {
      let th, thWidth, handle, tableRows, thLockBtn;
      beforeEach((done) => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          th = <HTMLElement> lockableTable.querySelector('th');
          tableRows = lockableTable.querySelectorAll('tr');
          thWidth = th.offsetWidth;

          handle = th.querySelector('.is-resizable-column-drag-handle');
          dispatchMouseEvent('mousedown', 50, 0, handle);
          dispatchMouseEvent('mousemove', 225, 0, document);
          dispatchMouseEvent('mouseup', 0, 0, document);

          done();
        });
      });

      it('should adjust the width of resized column header', (done) => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          expect(th.style.width).toEqual(`${thWidth + 175}px`);
          done();
        });
      });

      it('should reorder columns', (done) => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          thLockBtn = th.querySelector('.is-lockable-button');
          thLockBtn.dispatchEvent(new Event('click'));
          fixture.detectChanges();
          fixture.whenStable().then(() => {

            thWidth = th.style.width;

            // Assuming first row is header row
            const paddingTh = <HTMLElement> tableRows[0].querySelector('[id=\'paddingTh\']');
            expect(paddingTh).not.toEqual(null);
            expect(paddingTh.style.width).toEqual(thWidth);
            expect(paddingTh.style.minWidth).toEqual(thWidth);
            expect(paddingTh.style.maxWidth).toEqual(thWidth);

            let paddingTd;
            for (let i = 1; i < tableRows.length; i++) {
              paddingTd = <HTMLElement> tableRows[i].querySelector('[id=\'paddingTd\']');
              expect(paddingTd).not.toEqual(null);
              expect(paddingTd.style.width).toEqual(thWidth);
              expect(paddingTd.style.minWidth).toEqual(thWidth);
              expect(paddingTd.style.maxWidth).toEqual(thWidth);
            }

            done();
          });
        });
      });
    });

    describe('On data columns change', () => {
      let th, thWidth, tableRows, thLockBtn;
      beforeEach((done) => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          th = <HTMLElement> lockableTable.querySelector('th');
          tableRows = lockableTable.querySelectorAll('tr');
          thWidth = th.offsetWidth;

          thLockBtn = th.querySelector('.is-lockable-button');
          thLockBtn.dispatchEvent(new Event('click'));
          fixture.detectChanges();

          fixture.whenStable().then(() => {
            testComponent.data.push(getNewLockedData());
            done();
          });
        });
      });

      it('should adjust the styles of data columns associated with locked column', (done) => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          let td;
          for (let i = 1; i < tableRows.length; i++) {
            td = tableRows[i].querySelectorAll('td')[1];
            expect(td.style.position).toEqual('absolute');
          }

          thLockBtn.dispatchEvent(new Event('click'));
          fixture.detectChanges();
          fixture.whenStable().then(() => {
            tableRows = lockableTable.querySelectorAll('tr');
            for (let i = 1; i < tableRows.length; i++) {
              td = tableRows[i].querySelectorAll('td')[1];
              expect(td.style.position).toBe('');
            }

            done();
          });
        });
      });

      it('should reorder columns', (done) => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          thWidth = th.style.width;

          // Assuming first row is header row
          const paddingTh = <HTMLElement> tableRows[0].querySelector('[id=\'paddingTh\']');
          expect(paddingTh).not.toEqual(null);
          expect(paddingTh.style.width).toEqual(thWidth);
          expect(paddingTh.style.minWidth).toEqual(thWidth);
          expect(paddingTh.style.maxWidth).toEqual(thWidth);

          let paddingTd;
          for (let i = 1; i < tableRows.length; i++) {
            paddingTd = <HTMLElement> tableRows[i].querySelector('[id=\'paddingTd\']');
            expect(paddingTd).not.toEqual(null);
            expect(paddingTd.style.width).toEqual(thWidth);
            expect(paddingTd.style.minWidth).toEqual(thWidth);
            expect(paddingTd.style.maxWidth).toEqual(thWidth);
          }

          done();
        });
      });
    });

    describe('On lock/unlock of header column', () => {
      let th, thWidth, tableRows, thLockBtn;
      beforeEach((done) => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          th = <HTMLElement> lockableTable.querySelector('th');
          tableRows = lockableTable.querySelectorAll('tr');
          thWidth = th.offsetWidth;

          thLockBtn = th.querySelector('.is-lockable-button');
          thLockBtn.dispatchEvent(new Event('click'));
          done();
        });
      });

      it('should adjust the styles of data columns associated with locked column', (done) => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          let td;
          for (let i = 1; i < tableRows.length; i++) {
            td = tableRows[i].querySelectorAll('td')[1];
            expect(td.style.position).toEqual('absolute');
          }

          thLockBtn.dispatchEvent(new Event('click'));
          fixture.detectChanges();
          fixture.whenStable().then(() => {
            tableRows = lockableTable.querySelectorAll('tr');
            for (let i = 1; i < tableRows.length; i++) {
              td = tableRows[i].querySelectorAll('td')[1];
              expect(td.style.position).toEqual('');
            }
            done();
          });
        });
      });

      it('should reorder columns', (done) => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          thWidth = th.style.width;

          // Assuming first row is header row
          const paddingTh = <HTMLElement> tableRows[0].querySelector('[id=\'paddingTh\']');
          expect(paddingTh).not.toEqual(null);
          expect(paddingTh.style.width).toEqual(thWidth);
          expect(paddingTh.style.minWidth).toEqual(thWidth);
          expect(paddingTh.style.maxWidth).toEqual(thWidth);

          let paddingTd;
          for (let i = 1; i < tableRows.length; i++) {
            paddingTd = <HTMLElement> tableRows[i].querySelector('[id=\'paddingTd\']');
            expect(paddingTd).not.toEqual(null);
            expect(paddingTd.style.width).toEqual(thWidth);
            expect(paddingTd.style.minWidth).toEqual(thWidth);
            expect(paddingTd.style.maxWidth).toEqual(thWidth);
          }

          done();
        });
      });
    });

    describe('On parent wrapper scroll', () => {
      let th, tableRows, thLockBtn;
      beforeEach((done) => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          th = <HTMLElement> lockableTable.querySelector('th');
          tableRows = lockableTable.querySelectorAll('tr');

          thLockBtn = th.querySelector('.is-lockable-button');
          thLockBtn.dispatchEvent(new Event('click'));
          fixture.detectChanges();

          fixture.whenStable().then(() => {
            const parentWrapper = document.querySelector('.lockable-table');
            parentWrapper.dispatchEvent(new Event('scroll'));
            fixture.detectChanges();
            done();
          });
        });
      });

      it('should adjust left position of locked header columns and their respective data columns', (done) => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          expect(th.style.left).toEqual('0px');
          let td;
          for (let i = 1; i < tableRows.length; i++) {
            td = tableRows[i].querySelectorAll('td')[1];
            expect(td.style.left).toEqual('0px');
          }
          done();
        });
      });
    });
  });
});

@Component({
  template: `
  <div class="col-12 p-0 lockable-table">
  <table is-table
         [data]="data"
         is-reorderable-table
         is-lockable-table>
    <thead>
      <tr is-table-row
          type="header">
        <th is-lockable-column
            is-reorderable-column
            is-resizable-column>
          Name
        </th>
        <th is-lockable-column
            is-reorderable-column
            is-resizable-column>
          Lastname
        </th>
        <th is-lockable-column
            is-reorderable-column
            is-resizable-column>
          Title
        </th>
        <th is-lockable-column
            is-reorderable-column
            is-resizable-column>
          Language
        </th>
        <th is-lockable-column
            is-reorderable-column
            is-resizable-column>
          Hobbie
        </th>
        <th is-lockable-column
            is-reorderable-column
            is-resizable-column>
          City
        </th>
        <th is-lockable-column
            is-reorderable-column
            is-resizable-column>
          Prefix
        </th>
        <th is-lockable-column
            is-reorderable-column
            is-resizable-column>
          Favorite Fruit
        </th>
        <th is-lockable-column
            is-reorderable-column
            is-resizable-column>
          Computer
        </th>
        <th is-lockable-column
            is-reorderable-column
            is-resizable-column>
          OS
        </th>
        <th is-lockable-column
            is-reorderable-column
            is-resizable-column>
          coffee
        </th>
        <th is-lockable-column
            is-reorderable-column
            is-resizable-column>
          Band
        </th>
      </tr>
    </thead>
    <tbody>
      <tr *ngFor="let obj of data"
          is-table-row
          type="data">
        <td is-lockable-data>{{ obj.name }}</td>
        <td is-lockable-data>{{ obj.lastname }}</td>
        <td is-lockable-data>{{ obj.title }}</td>
        <td is-lockable-data>{{ obj.language }}</td>
        <td is-lockable-data>{{ obj.hobbie }}</td>
        <td is-lockable-data>{{ obj.city }}</td>
        <td is-lockable-data>{{ obj.prefix }}</td>
        <td is-lockable-data>{{ obj.favoriteFruit }}</td>
        <td is-lockable-data>{{ obj.computer }}</td>
        <td is-lockable-data>{{ obj.OS }}</td>
        <td is-lockable-data>{{ obj.coffee }}</td>
        <td is-lockable-data>{{ obj.band }}</td>
      </tr>
    </tbody>
  </table>
</div>
  `
})
class BasicLockableTableComponent {
  data = tableMockData.slice(0, 4);
}
