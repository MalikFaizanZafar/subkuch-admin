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

import { IsResizableColumnDragHandle } from './drag-handle';
import { IsTableModule } from '../../table.module';

describe('IsColumnFilter', () => {
  let fixture: ComponentFixture<any>;
  let testComponent;
  let resizableHandleDebug: DebugElement;
  let resizableHandleCmp: IsResizableColumnDragHandle;
  let resizableHandle: HTMLElement;

  function setValues(controller) {
    fixture = TestBed.createComponent(controller);
    testComponent = fixture.componentInstance;

    resizableHandleDebug = fixture.debugElement.query(By.directive(IsResizableColumnDragHandle));
    resizableHandleCmp = resizableHandleDebug.componentInstance;
    resizableHandle = resizableHandleDebug.nativeElement;
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
        IsTableModule,
        BrowserAnimationsModule
      ],
      declarations: [
        TestComponent
      ],
      providers: [],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  describe('Resizable Drag Handle', () => {
    beforeEach(() => {
      setValues(TestComponent);
    });

    it('should emit dragStart on mouse down', (done) => {
      fixture.detectChanges();

      let dragStart = false;
      resizableHandleCmp.dragStart.subscribe(() => {
        dragStart = true;
      });

      const handle = resizableHandle.querySelector('.is-resizable-column-drag-handle');
      dispatchMouseEvent('mousedown', 50, 0, handle);

      fixture.detectChanges();

      fixture.whenStable().then(() => {
        expect(resizableHandleCmp['dragging']).toEqual(true);
        expect(dragStart).toEqual(true);
        expect(resizableHandleCmp['startX']).toEqual(50);

        done();
      });
    });

    it('should emit drag on mouse move', (done) => {
      fixture.detectChanges();

      let delta = 0;
      resizableHandleCmp.drag.subscribe(res => {
        delta = res;
      });

      const handle = resizableHandle.querySelector('.is-resizable-column-drag-handle');
      dispatchMouseEvent('mousedown', 50, 0, handle);
      dispatchMouseEvent('mousemove', 125, 0, document);
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        expect(delta).toEqual(75);

        done();
      });
    });

    it('should emit dragEnd on mouse up', (done) => {
      fixture.detectChanges();

      let dragEnd = false;
      resizableHandleCmp.dragEnd.subscribe(() => {
        dragEnd = true;
      });

      const handle = resizableHandle.querySelector('.is-resizable-column-drag-handle');
      dispatchMouseEvent('mousedown', 50, 0, handle);
      dispatchMouseEvent('mouseup', 0, 0, document);

      fixture.detectChanges();

      fixture.whenStable().then(() => {
        expect(resizableHandleCmp['dragging']).toEqual(false);
        expect(dragEnd).toEqual(true);

        done();
      });
    });

    it('should not emit any event on click', (done) => {
      fixture.detectChanges();

      let dragStart = false, dragEnd = false;
      resizableHandleCmp.dragStart.subscribe(() => {
        dragStart = true;
      });
      resizableHandleCmp.dragEnd.subscribe(() => {
        dragEnd = true;
      });

      const handle = resizableHandle.querySelector('.is-resizable-column-drag-handle');
      dispatchMouseEvent('click', 0, 0, handle);

      fixture.detectChanges();

      fixture.whenStable().then(() => {
        expect(resizableHandleCmp['dragging']).toEqual(false);
        expect(dragStart).toEqual(false);
        expect(dragEnd).toEqual(false);

        done();
      });
    });
  });
});

@Component({
  template: `
  <is-resizable-column-drag-handle></is-resizable-column-drag-handle>
  `
})
class TestComponent {
}
