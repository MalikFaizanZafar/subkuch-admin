import { Component, DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { IsTableModule } from '../table.module';
import { IsDeletableRow } from './deletable-row';

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

describe('IsDeletableRow', () => {
  let fixture: ComponentFixture<any>;
  let testComponent;
  let deletableRowDebug: DebugElement;
  let deletableRowCmp: IsDeletableRow;
  let deletableRow: HTMLElement;

  function setValues(controller) {
    fixture = TestBed.createComponent(controller);
    testComponent = fixture.componentInstance;

    fixture.detectChanges();

    deletableRowDebug = fixture.debugElement.queryAll(By.directive(IsDeletableRow))[0];
    deletableRowCmp = deletableRowDebug.componentInstance;
    deletableRow = deletableRowDebug.nativeElement;
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        IsTableModule.forRoot(),
        BrowserAnimationsModule
      ],
      declarations: [
        BasicDeletableRowComponent
      ],
      providers: [
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  describe('BasicDeletableRowComponent', () => {
    beforeEach(() => {
      setValues(BasicDeletableRowComponent);
    });

    it('should add delete icon to the last cell', () => {
      const lastTd = deletableRow.querySelector('td:last-child');
      const icon = lastTd.querySelector('i');

      expect(lastTd.classList).toContain('isdr');

      expect(icon).not.toBe(null);
      expect(icon.classList).toContain('fa');
      expect(icon.classList).toContain(deletableRowCmp.deleteIcon);
      expect(icon.classList).toContain('isdr__icon');
    });

    it('should emit deleteIconClick on clicking icon', () => {
      const lastTd = deletableRow.querySelector('td:last-child');
      const icon = lastTd.querySelector('i');

      icon.dispatchEvent(new Event('click'));

      expect(testComponent.deletedRow).toEqual(testComponent.data[0]);
    });
  });
});

@Component({
  template: `
  <table is-table [data]="data">
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
      <tr *ngFor="let obj of data"
          deletable-row
          [icon]="'fa-times'"
          (deleteIconClick)="onRowDelete(obj)">
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
class BasicDeletableRowComponent {
  data = tableMockData.slice();
  deletedRow;

  onRowDelete( obj ) {
    this.deletedRow = obj;
  }
}
