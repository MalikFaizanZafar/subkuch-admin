import {
  Component,
  DebugElement,
  NO_ERRORS_SCHEMA
} from '@angular/core';
import {
  async,
  ComponentFixture,
  TestBed
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { IsResizableColumn } from './resizable-column';
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

describe('IsResizableColumn', () => {
  let fixture: ComponentFixture<any>;
  let testComponent;
  let resizableColDebug: DebugElement[];
  let resizableCol: HTMLElement;
  let service: IsTableService;

  function setValues(controller) {
    fixture = TestBed.createComponent(controller);
    fixture.detectChanges();
    testComponent = fixture.componentInstance;

    resizableColDebug = fixture.debugElement.queryAll(By.directive(IsResizableColumn));

    service = resizableColDebug[0].injector.get(IsTableService);
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
        BasicResizableColumnComponent
      ],
      providers: [],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  describe('BasicResizableColumnComponent', () => {
    beforeEach(() => {
      setValues(BasicResizableColumnComponent);
    });

    it('should change width to dragged size', (done) => {
      resizableCol = resizableColDebug[0].nativeElement;

      const width = resizableCol.clientWidth;
      const handle = resizableCol.querySelector('.is-resizable-column-drag-handle');
      dispatchMouseEvent('mousedown', 50, 0, handle);
      dispatchMouseEvent('mousemove', 225, 0, document);
      dispatchMouseEvent('mouseup', 0, 0, document);

      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(resizableCol.style.width).toEqual(`${width + 175}px`);
        done();
      });
    });

    it('should change width to max width if max width is given and dragged size is more than max width', (done) => {
      resizableCol = resizableColDebug[2].nativeElement;

      const handle = resizableCol.querySelector('.is-resizable-column-drag-handle');
      dispatchMouseEvent('mousedown', 50, 0, handle);
      dispatchMouseEvent('mousemove', 225, 0, document);
      dispatchMouseEvent('mouseup', 0, 0, document);

      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(resizableCol.style.width).toEqual(`300px`);
        done();
      });
    });

    it('should change width to min width if min width is given and dragged size is less than min width', (done) => {
      resizableCol = resizableColDebug[2].nativeElement;

      const handle = resizableCol.querySelector('.is-resizable-column-drag-handle');
      dispatchMouseEvent('mousedown', 50, 0, handle);
      dispatchMouseEvent('mousemove', -100, 0, document);
      dispatchMouseEvent('mouseup', 0, 0, document);

      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(resizableCol.style.width).toEqual(`200px`);
        done();
      });
    });

    it('should call service.onResize event on resize if delta is not zero', (done) => {
      const onResizeSpy = spyOn(service, 'onResize');
      resizableCol = resizableColDebug[0].nativeElement;

      const handle = resizableCol.querySelector('.is-resizable-column-drag-handle');
      dispatchMouseEvent('mousedown', 50, 0, handle);
      dispatchMouseEvent('mousemove', 225, 0, document);
      dispatchMouseEvent('mouseup', 0, 0, document);

      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(onResizeSpy).toHaveBeenCalled();
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
        <th is-resizable-column>Name</th>
        <th is-resizable-column>Lastname</th>
        <th is-resizable-column
            maxWidth="300"
            minWidth="200">Title</th>
        <th is-resizable-column>Language</th>
        <th is-resizable-column>Hobbie </th>
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
class BasicResizableColumnComponent {
  data = tableMockData;
}
