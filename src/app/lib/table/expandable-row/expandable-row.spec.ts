import {
  Component,
  DebugElement,
  NO_ERRORS_SCHEMA
} from '@angular/core';
import {
  async,
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { IsExpandableRow } from './expandable-row';
import { IsTableModule } from '../table.module';
import { IsTableService } from '../table.service';

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

describe('IsExpandableRow', () => {
  let fixture: ComponentFixture<any>;
  let testComponent;
  let expandableRowDebug: DebugElement[];
  let expandableRow: HTMLElement;
  let service;

  function setValues(controller) {
    fixture = TestBed.createComponent(controller);
    testComponent = fixture.componentInstance;

    fixture.detectChanges();

    expandableRowDebug = fixture.debugElement.queryAll(By.directive(IsExpandableRow));
    expandableRow = expandableRowDebug[0].nativeElement;

    service = expandableRowDebug[0].injector.get(IsTableService);
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        IsTableModule.forRoot(),
        BrowserAnimationsModule
      ],
      declarations: [
        BasicExpandableRowComponent,
        ExpandableRowWithCustomExpandComponent,
        ExpandableRowWithExpandEventsComponent
      ],
      providers: [
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  describe('BasicExpandableRowComponent', () => {
    beforeEach(() => {
      setValues(BasicExpandableRowComponent);
    });

    it('should set cursor, tableId and default state of row', () => {
      expect(expandableRow.style.cursor).toEqual('pointer');
      expect(expandableRow.getAttribute('table-id')).toEqual('1');
      expect(expandableRow.classList).toContain('is-expandable-row');
    });

    it('should expand row if it is collapsed now', () => {
      const setOpenedRowSpy = spyOn(service, 'setOpenedRow');
      expandableRow.dispatchEvent(new Event('click'));

      fixture.detectChanges();

      expect(setOpenedRowSpy).toHaveBeenCalled();

      const userDetail = document.body.querySelector('.user-detail');
      expect(userDetail).not.toBe(null);
      expect(userDetail.textContent).toContain(testComponent.data[0].name);
      expect(userDetail.textContent).toContain(testComponent.data[0].lastname);
      expect(userDetail.textContent).toContain(testComponent.data[0].title);
    });

    it('should close row if it is expanded now', () => {
      expandableRow.dispatchEvent(new Event('click'));
      fixture.detectChanges();
      expandableRow.dispatchEvent(new Event('click'));

      expect(expandableRow.classList).toContain('is-expandable-row--closed');

      fixture.detectChanges();

      const userDetail = document.body.querySelector('.user-detail');
      expect(userDetail).not.toBe(null);
    });
  });

  describe('Expandable Row With Custom Expand Component', () => {
    beforeEach(() => {
      setValues(ExpandableRowWithCustomExpandComponent);
    });

    it('should not show user detail on clicking row', () => {
      expandableRow.dispatchEvent(new Event('click'));

      const userDetail = document.body.querySelector('.user-detail');
      expect(userDetail).toBe(null);
    });

    it('should expand row on clicking custom icon', () => {
      const icon = expandableRow.querySelector('.fa-chevron-right');
      icon.dispatchEvent(new Event('click'));

      fixture.detectChanges();

      const userDetail = document.body.querySelector('.user-detail');
      expect(userDetail).not.toBe(null);
    });

    it('should collapse row on clicking custom icon', () => {
      const icon = expandableRow.querySelector('.fa-chevron-down');
      icon.dispatchEvent(new Event('click'));
      icon.dispatchEvent(new Event('click'));

      fixture.detectChanges();

      const userDetail = document.body.querySelector('.user-detail');
      expect(userDetail).toBe(null);
    });
  });

  describe('Expandable Row With Expand Events Component', () => {
    beforeEach(() => {
      setValues(ExpandableRowWithExpandEventsComponent);
    });

    it('should emit onExpandStart', (done) => {
      expandableRow.dispatchEvent(new Event('click'));

      fixture.detectChanges();

      fixture.whenStable().then(() => {
        const obj = testComponent.data[0];
        expect(testComponent.history).toContain(`expand start: ${obj.name} ${obj.lastname}`);

        done();
      });
    });

    it('should emit onExpandEnd', (done) => {
      expandableRow.dispatchEvent(new Event('click'));
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        const obj = testComponent.data[0];
        expect(testComponent.history).toContain(`expand end: ${obj.name} ${obj.lastname}`);

        done();
      });
    });

    it('should emit onCollapseStart', (done) => {
      expandableRow.dispatchEvent(new Event('click'));
      expandableRow.dispatchEvent(new Event('click'));
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        const obj = testComponent.data[0];
        expect(testComponent.history).toContain(`collapse start: ${obj.name} ${obj.lastname}`);
        console.log('hw');
        done();
      });
    });

    it('should emit onCollapseEnd', (done) => {
      expandableRow.dispatchEvent(new Event('click'));
      expandableRow.dispatchEvent(new Event('click'));
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        const obj = testComponent.data[0];
        expect(testComponent.history).toContain(`collapse end: ${obj.name} ${obj.lastname}`);

        done();
      });
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
          is-expandable-row
          [expandableContent]="userDetail"
          [data]="obj">
        <td>{{obj.name}}</td>
        <td>{{obj.lastname}}</td>
        <td>{{obj.title}}</td>
        <td>{{obj.language}}</td>
        <td>{{obj.hobbie}}</td>
      </tr>
    </tbody>
  </table>

  <ng-template #userDetail
               let-data="data">
    <div is-row-detail
        class="user-detail">
      <h2>Details</h2>
      <h5>{{data.name}}</h5>
      <h5>{{data.lastname}}</h5>
      <h5>{{data.title}}</h5>
    </div>
  </ng-template>
  `
})
class BasicExpandableRowComponent {
  data = tableMockData.slice();
}

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
          [autoexpand]="false"
          [(expanded)]="obj.expanded"
          is-expandable-row
          [expandableContent]="userDetail"
          [data]="obj">
        <td>
          <i *ngIf="!obj.expanded"
             (click)="obj.expanded = !obj.expanded"
             class="fa fa-chevron-right mr-2">
          </i>
          <i *ngIf="obj.expanded"
             (click)="obj.expanded = !obj.expanded"
             class="fa fa-chevron-down mr-2">
          </i>
          {{obj.name}}
        </td>
        <td>{{obj.lastname}}</td>
        <td>{{obj.title}}</td>
        <td>{{obj.language}}</td>
        <td>{{obj.hobbie}}</td>
      </tr>
    </tbody>
  </table>

  <ng-template #userDetail
               let-data="data">
    <div is-row-detail
         class="user-detail">
      <h2>Details</h2>
      <h5>{{data.name}}</h5>
      <h5>{{data.lastname}}</h5>
      <h5>{{data.title}}</h5>
    </div>
  </ng-template>
  `
})
class ExpandableRowWithCustomExpandComponent {
  data = tableMockData.slice();
}

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
          (onExpandStart)="onExpandStart(obj)"
          (onExpandEnd)="onExpandEnd(obj)"
          (onCollapseStart)="onCollapseStart(obj)"
          (onCollapseEnd)="onCollapseEnd(obj)"
          is-expandable-row
          [expandableContent]="userDetail"
          [data]="obj">
        <td>{{obj.name}}</td>
        <td>{{obj.lastname}}</td>
        <td>{{obj.title}}</td>
        <td>{{obj.language}}</td>
        <td>{{obj.hobbie}}</td>
      </tr>
    </tbody>
  </table>

  <ng-template #userDetail
               let-data="data">
    <div is-row-detail
         class="user-detail">
      <h2>Details</h2>
      <h5>{{data.name}}</h5>
      <h5>{{data.lastname}}</h5>
      <h5>{{data.title}}</h5>
    </div>
  </ng-template>
  `
})
class ExpandableRowWithExpandEventsComponent {
  data = tableMockData.slice();
  history = [];

  onExpandStart( obj ) {
    console.log('onExpandStart');
    this.history.push('expand start: ' + obj.name + ' ' + obj.lastname);
  }

  onExpandEnd( obj ) {
    console.log('onExpandEnd');
    this.history.push('expand end: ' + obj.name + ' ' + obj.lastname);
  }

  onCollapseStart( obj ) {
    console.log('onCollapseStart');
    this.history.push('collapse start: ' + obj.name + ' ' + obj.lastname);
  }

  onCollapseEnd( obj ) {
    console.log('onCollapseEnd');
    this.history.push('collapse end: ' + obj.name + ' ' + obj.lastname);
  }
}
