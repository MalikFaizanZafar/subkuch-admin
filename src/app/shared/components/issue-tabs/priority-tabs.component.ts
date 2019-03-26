import { Overlay, OverlayRef, PositionStrategy } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  QueryList,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewChildren,
  ViewContainerRef,
} from '@angular/core';
import { NavigationTab } from '@app/shared/components/navigation-tabs/navigation-tab';

@Component({
  selector: 'app-priority-tabs',
  templateUrl: './priority-tabs.component.html',
  styleUrls: ['./priority-tabs.component.scss'],
})
export class PriorityTabsComponent implements OnChanges {
  private overlayRef: OverlayRef;

  @Input() tabs: NavigationTab[] = [];
  @Input() dragging: boolean = false;
  @Input() tooltipIndex: number = 0;
  @Input() tooltipMessage: string = '';

  @Output() tabClick: EventEmitter<NavigationTab> = new EventEmitter();
  @Output() tabDrop: EventEmitter<NavigationTab> = new EventEmitter();

  @ViewChild('tooltip') tooltip: TemplateRef<null>;
  @ViewChildren('tooltips') tooltips: QueryList<ElementRef>;

  constructor(private overlay: Overlay, private viewContainerRef: ViewContainerRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('dragging') && this.tooltip && this.tooltips) {
      if (changes.dragging.currentValue) {
        const tab: ElementRef = this.tooltips.find((_, i) => i === this.tooltipIndex);
        const positionStrategy: PositionStrategy = this.overlay
          .position()
          .flexibleConnectedTo(tab.nativeElement)
          .withPositions([
            {
              offsetX: 0,
              offsetY: -5,
              originX: 'center',
              originY: 'top',
              overlayX: 'center',
              overlayY: 'bottom',
            },
          ]);

        this.overlayRef = this.overlay.create({ positionStrategy });
        const portal: TemplatePortal = new TemplatePortal(this.tooltip, this.viewContainerRef);
        this.overlayRef.attach(portal);
      } else {
        this.overlayRef.detach();
      }
    }
  }

  onTabClick(tab: NavigationTab): void {
    if (tab.id !== this.tabs.find(i => i.active).id) {
      this.tabClick.emit(tab);
    }
  }

  onDragOver(event: DragEvent, tab: NavigationTab): void {
    if (!tab.disabled) {
      event.preventDefault();
    }
  }

  onDragEnter(tab: NavigationTab): void {
    if (!tab.disabled && !tab.active) {
      tab.over = true;
    }
  }

  onDragLeave(tab: NavigationTab): void {
    if (!tab.disabled && !tab.active) {
      tab.over = false;
    }
  }

  onDrop(tab: NavigationTab): void {
    tab.over = false;

    if (!tab.active) {
      this.tabDrop.emit(tab);
    }
  }

  trackByFn(index: number): number {
    return index;
  }
}
