import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';

/**
 * Creates Delete button for deletable rows
 * and attach handler to it
 */
@Component({
  selector: 'tr[deletable-row]',
  templateUrl: 'deletable-row.html',
  styleUrls: ['deletable-row.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class IsDeletableRow implements OnInit {
  /**
   * Fontawesome class icon to render
   * @default {fa-trash}
   */
  @Input() deleteIcon = 'fa-trash';

  /**
   * Event triggers when the user clicks the icon
   */
  @Output() deleteIconClick = new EventEmitter();

  /**
   * Constructor method injects element
   * reference in class
   * @param row
   */
  constructor(private row: ElementRef) {}

  /**
   * Append an icon in the last cell of the row and then binds the click event
   */
  ngOnInit() {
    const cells = this.row.nativeElement.cells;
    const td = cells[cells.length - 1];
    const icon = document.createElement('i');
    const classes = [
      'fa',
      this.deleteIcon,
      'isdr__icon',
      'd-flex',
      'justify-content-center',
      'align-items-center'
    ];
    classes.map(iconClass => icon.classList.add(iconClass));
    icon.addEventListener('click', this.onIconClick.bind(this));
    td.classList.add('isdr');
    td.appendChild(icon);
  }

  /**
   * Emit an event if the user clicks the icon
   * @param e
   */
  onIconClick(e: MouseEvent) {
    e.stopPropagation();
    this.deleteIconClick.emit();
  }
}
