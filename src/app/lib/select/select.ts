import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { BACKSPACE, DOWN_ARROW, ENTER, ESCAPE, UP_ARROW } from '@angular/cdk/keycodes';
import { BreakpointObserver } from '@angular/cdk/layout';
import { CdkConnectedOverlay, ConnectionPositionPair, Overlay, ScrollStrategy } from '@angular/cdk/overlay';
import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  DoCheck,
  ElementRef,
  EmbeddedViewRef,
  EventEmitter,
  forwardRef,
  HostBinding,
  HostListener,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  QueryList,
  Renderer2,
  Self,
  TemplateRef,
  ViewChild,
  ViewChildren,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, FormGroupDirective, NgControl, NgForm } from '@angular/forms';
import { startWith, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs'; // tslint:disable-line

import {
  BREAKPOINT_CONFIG,
  IsImplicitContext,
  IsKey,
  IsResizeService,
  DomHandler,
  isEmptyString,
  isNullOrUndefined,
  POSITION_PAIRS,
} from '../core';
import { IsErrorStateMatcher } from '../core/shared/model/error-state-matcher';
import { DF_ERROR_STATE_MATCHER } from '../core/shared/tokens/error-state-matcher.token';
import { runWhenStable } from '../core/shared/utils/run-when-stable';
import { IsCanDisable, IsCanUpdateErrorState, IsDestructable, mixinDestructable, mixinResizable } from '../core/ts-mixins';
import { mixinDisabled } from '../core/ts-mixins/disabled.mixin';
import { mixinErrorState } from '../core/ts-mixins/error-state.mixin';
import { IsPortalOptions, IsPortalService } from '../portal';
import { IsOptionTemplate } from './option-template';
import { IsSelectBackground } from './select-background';
import { IsSelectNode } from './select-node';
import { IsSelectPlacement } from './select-placement';
import { optionsAnimation } from './select.animation';
import { IsSelectState, IsSelectType } from './select.model';

/**
 * Class set on the selected options
 */
const SELECTED_OPTION_CLASS = 'is-option--selected';

/**
 * Temporary class set on the selected options, used in situations which the selection isn't completed yet
 * just like the arrow navigation
 */
const TEMPORARY_SELECTED_OPTION_CLASS = 'is-option--temporary-selected';

/**
 * The base select class in order to apply the used mixins
 */
export class IsSelectBase {

  /**
   * Creates an instance of IsSelectBase.
   * @param  _resizeService The resize service
   * @param  _defaultErrorStateMatcher The default error state matcher to use
   * @param  _parentForm The parent ngform if any
   * @param  _parentFormGroup The parent form group if any
   * @param  ngControl The ngcontrol associated with this select
   */
  constructor(public _resizeService: IsResizeService,
              @Inject(DF_ERROR_STATE_MATCHER) public _defaultErrorStateMatcher: IsErrorStateMatcher,
              public _parentForm: NgForm,
              public _parentFormGroup: FormGroupDirective,
              public ngControl: NgControl) {}
}

/**
 * The base select class with mixins applied
 */
export const _IsSelectBase = mixinResizable(mixinDestructable(mixinDisabled(mixinErrorState(IsSelectBase))));

/**
 * Class for option for select component
 */
@Component({
  selector: 'is-option',
  templateUrl: './option.html',
  styleUrls: ['./option.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.is-option]': 'true'
  }
})
export class IsOption implements AfterViewInit, OnInit {

  /**
   * To be used to get the inner HTML of the option.
   */
  public innerHtml = '';

  /**
   * Whether or not display text is initialized
   */
  private isDisplayTextInitialized = false;

  /**
   * Whether or not there is any implicit innerHTML
   */
  private noInnerHTML = false;

  /**
   * Template reference for custom template
   */
  template: TemplateRef<IsImplicitContext<IsSelectNode>>;

  /**
   * Whether or not to show the option,
   * depending on the filtering criteria.
   */
  @HostBinding('class.is-option--invisible')
  isHidden = false;

  /**
   * Whether or not the option is selected.
   */
  @HostBinding(`class.${SELECTED_OPTION_CLASS}`)
  isSelected = false;

  /**
   * Whether or not the option is temporary selected.
   * used in situations which the selection isn't completed yet
   */
  @HostBinding(`class.${TEMPORARY_SELECTED_OPTION_CLASS}`)
  isTemporarySelected = false;

  /**
   * Text to be used to access the specific option.
   */
  @Input()
  value: any;

  /**
   * Node associate with current option
   */
  @Input()
  associatedNode: IsSelectNode;

  /**
   * Text to be used as label for the option.
   */
  private _displayText = '';

  /**
   * Text to be used as label for the option.
   */
  @Input()
  get displayText(): string {
    return this._displayText;
  }

  /**
   * Setter for displayText
   * @param value
   */
  set displayText(value: string) {
    if (value === null || value === undefined) {
      this._displayText = '';
    } else {
      this._displayText = value.toString();
    }
    if (this.isDisplayTextInitialized) {
      this.updateInnerHTML();
      this.parentSelect.updateDisplayText();
      this.cdr.detectChanges();
    }
    this.isDisplayTextInitialized = true;
  }

  /**
   * Whether or not the option is pre-selected.
   */
  @Input()
  selected = false;

  /**
   * Element reference for div wrapping the content
   */
  @ViewChild('contentWrapper') contentWrapper: ElementRef;

  /**
   * Whether or not parentSelect is nested
   */
  isParentSelectNested: boolean | string;

  /**
   * EventEmitter that will be triggered when any
   * option is clicked.
   * @param e
   */
  @HostListener('click', ['$event'])
  onOptionClick(e: MouseEvent) {
    const options = this.parentSelect.isSelectOptions.toArray();

    // If shift key is pressed in multiselect select
    // select all options from startOptionIndex to endOptionIndex
    if (e.shiftKey && this.parentSelect.multiselect && this.parentSelect.bulkSelection) {
      const startOptionIndex = this.parentSelect.startOptionIndex;
      const endOptionIndex = options.indexOf(this);
      if (startOptionIndex < endOptionIndex) {
        for (let i = startOptionIndex + 1; i < endOptionIndex; i++) {
          this.selectOption(options[i]);
        }
      } else {
        for (let i = startOptionIndex - 1; i > endOptionIndex; i--) {
          this.selectOption(options[i]);
        }
      }
    }

    // If shift key is NOT pressed and it's multiselect
    // save clicked option index in parent slect`s
    // startOptionIndex variable
    if (!e.shiftKey && this.parentSelect.multiselect) {
      this.parentSelect.startOptionIndex = options.indexOf(this);
    }

    this.selectOption(this);
  }

  /**
   * Element reference
   */
  get elementRef() {
    return this.elRef;
  }

  /**
   * Constructor for IsOption
   * @param parentSelect parentSelect for the option
   * @param elRef element reference
   */
  constructor(@Inject(forwardRef(() => IsSelect)) protected parentSelect: IsSelect,
              protected elRef: ElementRef,
              private cdr: ChangeDetectorRef) {
  }

  /**
   * Updates initial selected state based on parent's value
   *
   * @memberof IsOption
   */
  ngOnInit() {
    if (typeof this.parentSelect.isSelectValue !== 'undefined') {
      if (this.parentSelect.multiselect) {
        const value = this.parentSelect.isSelectValue;
        this.isSelected = value && Array.isArray(value) && value.indexOf(this.value) !== -1;
      } else {
        this.isSelected = this.value === this.parentSelect.isSelectValue;
      }
    }
    this.isParentSelectNested = this.parentSelect.nested;
  }

  /**
   * Callback method after view initialization
   */
  ngAfterViewInit() {
    // Apply inner HTML as display text if `displayText` input is not presented
    if (!this.parentSelect.nested) {
      if (this.contentWrapper && isEmptyString(this.displayText)) {
        this.displayText = this.elRef.nativeElement.innerText.trim();
      }

      this.innerHtml = this.contentWrapper ?
        this.contentWrapper.nativeElement.innerHTML.trim() :
        '';

      if (this.innerHtml.trim() === '') {
        this.contentWrapper.nativeElement.innerHTML = this._displayText;
        this.noInnerHTML = true;
      }
    } else {
      this.innerHtml = this.elementRef.nativeElement.innerText.trim();
      if (typeof this.parentSelect.isSelectValue !== 'undefined') {
        if (this.parentSelect.multiselect) {
          const value = this.parentSelect.isSelectValue;
          this.isSelected = value && Array.isArray(value) && value.indexOf(this.value) !== -1;
        } else {
          this.isSelected = this.value === this.parentSelect.isSelectValue;
        }
      }
    }

    // Default selected option
    if (this.selected) {
      // only use timeout here because this triggers a change in the ng model
      setTimeout(() => {
        if (!this.isParentSelectNested) {
          this.parentSelect.selectOption(this, false);
        } else {
          this.parentSelect.selectOptionNested(this, false);
        }
      });
    }

    if (this.parentSelect.nested &&
        this.parentSelect.optionTemplate) {
      this.template = this.parentSelect.optionTemplate.template;
      this.cdr.detectChanges();
    }
  }

  /**
   * Update inner html of the option with the changed displayText
   */
  updateInnerHTML() {
    if (!this.parentSelect.nested) {
      if (this.noInnerHTML) {
        this.contentWrapper.nativeElement.innerHTML = this._displayText;
        this.innerHtml = this._displayText;
      }
    }
  }

  /**
   * EventEmitter to be used to trigger
   * the parent selectOption event.
   * @param option
   */
  private selectOption(option: IsOption) {
    this.parentSelect.onOptionClick(option);
  }
}

/**
 * Class for select component
 */
@Component({
  selector: 'is-select',
  templateUrl: 'select.html',
  styleUrls: ['select.scss'],
  animations: [optionsAnimation],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[tabindex]': '0',
    '[class.is-select--inline]': 'isInline',
    '[class.is-select--disabled]': 'disabled',
    '[class.is-select-wrapper]': 'true',
    '[class.is-select--invalid]': 'errorState',
  },
  inputs: ['disabled'],
  providers: [
    DomHandler
  ]
})
export class IsSelect
  extends _IsSelectBase
  implements ControlValueAccessor, OnInit, OnDestroy, AfterContentInit, AfterViewInit, DoCheck,
  IsCanDisable, IsCanUpdateErrorState, IsDestructable {

  /**
   * To be used as the display text for the option.
   */
  isSelectDisplayText = '';

  /**
   * To be used to get the filter criteria.
   */
  isSelectFilterText = '';

  /**
   * To be used to get all the selected
   * options in the options list.
   */
  selectedOptions: IsOption[] = [];

  /**
   * To be used to save clicked option index.
   * This variable is used in shift key
   * multiselect feature
   */
  startOptionIndex = 0;

  /**
   * Portal options
   */
  portalOptions: IsPortalOptions;

  /**
   * Content children for option templates
   */
  @ContentChild(IsOptionTemplate)
  optionTemplate: IsOptionTemplate;

  /**
   * To be used to get the options list.
   */
  @ContentChildren(IsOption)
  isSelectOptions: QueryList<IsOption>;

  /**
   * Nested Options
   */
  @ViewChildren('nestedOptions')
  nestedOptions: QueryList<IsOption>;

  /**
   * Filter Input
   */
  @ViewChild('filterInput')
  filterInput: ElementRef;

  /**
   * Last filter value
   */
  lastFilterValue = '';

  /**
   * To be used to show the hint.
   */
  @Input()
  placeholder = '';

  /**
   * Empty message to display when there is no result
   */
  @Input()
  emptyMessage: string;

  /**
   * To be used to adjust the size of the component
   * depending on the content inside it.
   */
  protected _autoSize = true;

  /**
   * Whether or not select is type inline
   */
  get isInline(): boolean {
    return this.selectType === 'inline';
  }

  /**
   * To be used to adjust the size of the component
   * depending on the content inside it.
   */
  @Input()
  get autoSize(): string | boolean {
    return this._autoSize;
  }

  /**
   * Setter for autoSize
   * @param value
   */
  set autoSize(value: string | boolean) {
    this._autoSize = coerceBooleanProperty(value);
  }

  /**
   * To be used to set the css styling depending on the
   * type selected.
   */
  @Input()
  selectType: IsSelectType = 'dropdown';

  /**
   * Whether or not to allow filtering.
   */
  protected _filterable = false;

  /**
   * Whether or not to allow filtering.
   */
  @Input()
  get filterable(): boolean {
    return this._filterable;
  }

  /**
   * Setter for filterable property
   * @param value
   */
  set filterable(value: boolean) {
    this._filterable = coerceBooleanProperty(value);
  }

  /**
   * Whether or not to allow multiselect.
   */
  protected _multiselect = false;

  /**
   * Whether or not to allow multiselect.
   */
  @Input()
  get multiselect(): boolean | string {
    return this._multiselect;
  }

  /**
   * Setter for multiselect property
   * @param value
   */
  set multiselect(value: boolean | string) {
    this._multiselect = coerceBooleanProperty(value);
  }

  /**
   * To be used to set the position of the component.
   */
  @Input()
  set placement(value: IsSelectPlacement) {
    this._placement = value;
    if (value === IsSelectPlacement.Top) {
      // favor top positions, falling back to bottom positions
      this.connectedOverlayPositions = [
        POSITION_PAIRS.topLeft,
        POSITION_PAIRS.topRight,
        POSITION_PAIRS.bottomLeft,
        POSITION_PAIRS.bottomRight
      ];
    } else {
      // favor bottom positions, falling back to top positions
      this.connectedOverlayPositions = [
        POSITION_PAIRS.bottomLeft,
        POSITION_PAIRS.bottomRight,
        POSITION_PAIRS.topLeft,
        POSITION_PAIRS.topRight
      ];
    }
  }

  /**
   * Getter method for placement variable
   */
  get placement(): IsSelectPlacement {
    return this._placement || IsSelectPlacement.Bottom;
  }

  /**
   * Select placement
   */
  protected _placement: IsSelectPlacement;

  /**
   * Whether or not the select popup renders with backdrop. Not rendering backdrop
   * will enable scrolling when the select is opened and will disable close on blur.
   */
  @Input()
  hasBackdrop = true;

  /**
   * Preferred positions settings to use from most preferable to least preferable
   */
  connectedOverlayPositions: ConnectionPositionPair[] = [
    POSITION_PAIRS.bottomLeft,
    POSITION_PAIRS.bottomRight,
    POSITION_PAIRS.topLeft,
    POSITION_PAIRS.topRight
  ];

  /**
   * To be used to change the background theme.
   */
  @Input()
  background: IsSelectBackground = IsSelectBackground.Dark;

  /**
   * To be used to add a "select all" option, can be
   * used only when multiselect property is active.
   */
  protected _showSelectAll = false;

  /**
   * To be used to add a "select all" option, can be
   * used only when multiselect property is active.
   */
  @Input()
  get showSelectAll(): string | boolean {
    return this._showSelectAll;
  }

  /**
   * Setter for showSelectAll attribute
   * @param value
   */
  set showSelectAll(value: string | boolean) {
    console.warn(`showSelectAll feature is not supported when 'nested' attribute is true`);
    this._showSelectAll = coerceBooleanProperty(value);
  }

  /**
   * To be used to show the hint text
   * as placeholder for filter input.
   */
  @Input()
  filterPlaceholder = 'Filter options';

  /**
   * To modify the behavior when using the keyword when searching options.
   * TRUE: only matches the beginning of the option's innerHTML
   * FALSE: matches anywhere in the option's innerHTML
   */
  @Input()
  strictSelect = true;

  /**
   * Allow user to make bulk selection
   * with shift key pressed
   */
  _bulkSelection = true;

  /**
   * Allow user to make bulk selection
   * with shift key pressed
   */
  @Input()
  get bulkSelection(): string | boolean {
    return this._bulkSelection;
  }

  /**
   * Setter for bulkSelection attribute
   * @param value
   */
  set bulkSelection(value: string | boolean) {
    this._bulkSelection = coerceBooleanProperty(value);
  }

  /**
   * Whether or not portal is to be shown on mobile
   */
  _showPortalOnMobile = true;

  /**
   * Whether or not to show portal on mobile
   */
  @Input()
  get showPortalOnMobile(): boolean {
    return this._showPortalOnMobile;
  }

  /**
   * Setter for showPortalOnMobile
   * @param value
   */
  set showPortalOnMobile(value: boolean) {
    this._showPortalOnMobile = coerceBooleanProperty(value);
  }

  /**
   * To be used to get the selected option.
   */
  protected _isSelectValue: any = null;

  /**
   * To be used to get selected option value.
   */
  get isSelectValue(): any {
    return this._isSelectValue;
  }

  /**
   * To be used to set the option as selected.
   * @param value
   */
  set isSelectValue(value: any) {
    if (this._isSelectValue !== value) {
      this._isSelectValue = value;
      this.propagateChange(this._isSelectValue);
      // emit event, change the display text and color the selected option
      this.updateOptionsAndDisplay();
      this.change.emit(value);
    }
  }

  /**
   * EventEmitter that will be triggered
   * when an option will be selected.
   */
  @Output()
  change = new EventEmitter();

  /**
   * The scroll strategy to use for the overlay
   */
  overlayScrollStrategy: ScrollStrategy;

  /**
   * Whether or not the selected all checkbox
   * has been clicked.
   */
  isSelectedAll = false;

  /**
   * State of the option block.
   */
  state: IsSelectState = 'closed';

  /**
   * Buffer to store the keys that the user has typed so far
   * when the select is in opened state.
   */
  selectionString = '';

  /**
   * Saves the timer ID to reset the selectorString.
   */
  selectionTimer: any;

  /**
   * selectionString will reset after this amount of milliseconds.
   */
  selectionTimeout = 800;

  /**
   * Temporary saves the index of the selected option when using the keyboard.
   */
  temporarySelectionIndex: number = null;

  /**
   * Reference to the options list wrapper.
   * This will be used to calculate the correct scroll position
   * when navigating the options using the arrow keys and by
   * typing characters.
   */
  @ViewChild('optionList')
  optionList: ElementRef;

  /**
   * Template reference for option item
   */
  @Input()
  customInputContent: TemplateRef<any> = null;

  /**
   * Whether or not select is nested
   */
  private _nested = false;

  /**
   * Whether or not select is nested
   */
  @Input()
  get nested(): string | boolean {
    return this._nested;
  }

  /**
   * Setter for autoSize
   * @param value
   */
  set nested(value: string | boolean) {
    this._nested = coerceBooleanProperty(value);
  }

  /**
   * Data to be used in case of nested select
   */
  @Input()
  data: IsSelectNode[];

  /**
   * Event emitted when dropdown is opened
   */
  @Output()
  dropdownOpen: EventEmitter<void> = new EventEmitter<void>();

  /**
   * Flag that disables filtering options to enable server side filtering
   */
  @Input()
  asyncFilter = false;

  /**
   * Event emitted filter text is changed
   */
  @Output()
  filterChange: EventEmitter<string> = new EventEmitter<string>();

  /**
   * Flag to retian filter text
   */
  @Input()
  preserveFilterText = false;

  /**
   * Flag to show/hide loading spinner (useful when fetching options async)
   */
  @Input()
  loading = false;

  /**
   * Message to show when loading options
   */
  @Input()
  loadingMessage = 'Loading data...';

  /**
   * Custom template placeholder for isSelect input
   */
  @ViewChild('isSelectInputContainer', { read: ViewContainerRef })
  isSelectInputContainer: ViewContainerRef;

  /**
   * Current tree data that is being display for nested select
   */
  currentTreeData: IsSelectNode[];

  /**
   * Parent tree data of the current select data
   */
  nestedIterationPath: IsSelectNode[][] = [];

  /**
   * Embed Template for input
   */
  private inputEmbeddedTemplate: EmbeddedViewRef<any>;

  /**
   * Whether or not to use mobile options
   */
  useMobileOptions = false;

  /**
   * Array of Selected Nodes
   */
  selectedNodes: IsSelectNode[] = [];

  /**
   * The rectangle area of this component
   */
  triggerRect: ClientRect | undefined;

  /**
   * Template reference for select options list
   * to be opened in portal
   *
   */
  @ViewChild('selectOptions')
  template: TemplateRef<any>;

  /** Overlay pane containing the options. */
  @ViewChild(CdkConnectedOverlay) overlayDir: CdkConnectedOverlay;

  /**
   * Constructor of the component
   * @param ref reference to DOM element that represents this
   *   component
   * @param renderer to be used to listen to keyboard events
   *   when the options panel is open
   * @param resizeService object for resizeService
   * @param cdr change detector reference
   * @param breakpointObserver breakpoint observer
   * @param domHandler dom handler object
   * @param portalService portal service
   * @param overlay overlay service
   */
  constructor(protected ref: ElementRef,
              protected renderer: Renderer2,
              protected resizeService: IsResizeService,
              protected cdr: ChangeDetectorRef,
              protected breakpointObserver: BreakpointObserver,
              protected domHandler: DomHandler,
              protected portalService: IsPortalService,
              public overlay: Overlay,
              protected ngZone: NgZone,
              @Inject(DF_ERROR_STATE_MATCHER) errorStateMatcher: IsErrorStateMatcher,
              @Optional() parentForm: NgForm,
              @Optional() parentFormGroup: FormGroupDirective,
              @Self() @Optional() ngControl: NgControl
            ) {
    super(resizeService, errorStateMatcher, parentForm, parentFormGroup, ngControl);
    this.overlayScrollStrategy = overlay.scrollStrategies.reposition({
      autoClose: false,
      scrollThrottle: 20
    });

    if (this.ngControl) {
      // Note: we provide the value accessor through here, instead of
      // the `providers` to avoid running into a circular import.
      this.ngControl.valueAccessor = this;
    }
  }

  /**
   * Detect whether mobile options need to be enabled or not
   */
  private detectBreakpoint() {
    this.breakpointObserver
      .observe(BREAKPOINT_CONFIG)
      .pipe(takeUntil(this._destroy$))
      .subscribe(result => {
        this.useMobileOptions = result.matches;
        this.state = 'closed';
        this.removeKeyboardListeners();
      });
  }

  /**
   * EventEmitter that will be used to stop bubbling up
   * the click event.
   * @param e
   */
  @HostListener('click', ['$event'])
  onComponentClick(e: MouseEvent) {
    e.stopPropagation();
  }

  /**
   * Handles blur event to notify control has been touched
   * @param e
   */
  @HostListener('blur')
  onBlur() {
    if (!this.disabled && this.state !== 'opened') {
      this.propagateTouched();
    }
  }

  /**
   * Passes on the change to host component.
   */
  propagateChange = (_: any) => { };

  /**
   * Propagates that the component has been touched
   */
  propagateTouched = () => { };

  /**
   * Dummy function that will be overwritten by the renderer.
   * It will be used to remove the event listener when the option list
   * wrapper is closed.
   */
  keydownListener = () => { };

  /**
   * Dummy function that will be overwritten by the renderer.
   * It will be used to remove the event listener when the option list
   * wrapper is closed.
   */
  keyupListener = () => { };

  /**
   * Dummy function that will be overwritten by the renderer.
   * It will be used to remove the event listener when the option list
   * wrapper is closed.
   */
  keypressListener = () => { };
  
  /**
   * Subject that emits when component is destroyed
   */
  readonly _destroy$: Subject<void>;
  errorState: any;
  disabled: boolean;
  errorStateMatcher: any;
  updateErrorState: any;
  
  ngOnInit(){

  }

  ngOnDestroy(){

  }

  /**
   * After view initialization
   */
  ngAfterViewInit() {
    if (this.nested) {
      const displayText = this.selectedNodes
        .map(option => option.displayText)
        .join(', ');
      this.isSelectDisplayText = this.selectedNodes.length !== 0 ?
        displayText :
        null;
      const selectedOptionsValues: string[] = [];
      this.selectedNodes.forEach(node => {
        selectedOptionsValues.push(node.value);
      });
      if (selectedOptionsValues.length > 0) {
        this._isSelectValue = this.multiselect ?
          selectedOptionsValues :
          selectedOptionsValues[0];
      }
      this.cdr.markForCheck();
      this.cdr.detectChanges();
    }
  }

  /**
   * Do check lifecycle necessary to update the error state
   */
  ngDoCheck() {
    // We need to re-evaluate this on every change detection cycle, because there are some
    // error triggers that we can't subscribe to (e.g. parent form submissions). This means
    // that whatever logic is in here has to be super lean or we risk destroying the performance.
    if (this.ngControl) {
      this.updateErrorState();
    }
  }

  /**
   * Set Selected nested data
   * @param treeData
   */
  setSelectedNestedData(treeData: IsSelectNode[]) {
    for (let i = 0; i < treeData.length; i++) {
      const currentNode = treeData[i];
      if (currentNode.nodes) {
        // Recurse into children
        this.setSelectedNestedData(currentNode.nodes);
      }
    }
  }

  /**
   * After content init life cycle
   */
  ngAfterContentInit(): void {
    if (this.customInputContent) {
      this.inputEmbeddedTemplate = this.isSelectInputContainer
        .createEmbeddedView(this.customInputContent);
    }
    if (this.nested) {
      this.setIterationData();
    }
    if (this.showPortalOnMobile) {
      this.detectBreakpoint();
    }
    this.isSelectOptions.changes
      .pipe(startWith(null))
      .subscribe(() => {
        this.selectedOptions = this.isSelectOptions.filter(option => option.isSelected);
        this.updateDisplayText();
      });
  }

  /**
   * Set the iteration data
   * @param treeData
   */
  setIterationData() {
    this.currentTreeData = this.data;
    for (let j = 0; j < this.data.length; j++) {
      const node = this.data[j];
      if (this.traverse(this.data, node)) {
        this.temporarySelectionIndex = j;
        return;
      }
    }
  }

  /**
   * Traverse the treedata to set iteration path
   * @param treeData
   * @param node
   */
  traverse(treeData: IsSelectNode[], node: IsSelectNode): boolean {
   const currentNode = node;
    if (currentNode.selected) {
      this.currentTreeData = treeData;
      this.selectedNodes.push(node);
      return true;
    }
    if (currentNode.nodes) {
      for (let j = 0; j < currentNode.nodes.length; j++) {
        const childNode = currentNode.nodes[j];
        this.nestedIterationPath.push(treeData);
        if (this.traverse(currentNode.nodes, childNode)) {
          this.temporarySelectionIndex = j;
          return true;
        }
      }
    }
    this.nestedIterationPath.pop();
    return false;
  }

  /**
   * Callback function on window resize
   */
  onResize() {
    if (!this.useMobileOptions) {
      this.resetPortalOptions();
      this.portalService.close();
       /** Recalculate the boundaries of the element if we have the overlay opened */
      if (this.isOpened) {
        this.calculateBoundaries();
        /** We need to call update size manually on the overlay for it to update the width because it has already been attached */
        this.updateOverlaySize();
      }
    }
  }

  /**
   * Used to refresh the trigger rect
   */
  protected calculateBoundaries(): void {
    this.triggerRect = (this.ref.nativeElement as HTMLElement).getBoundingClientRect();
  }

  /**
   * Forces an update of the overlay ref size
   */
  protected updateOverlaySize() {
    this.overlayDir.overlayRef.updateSize({ minWidth: this.triggerRect.width });
  }

  /**
   * Whether or not to show portal animations on mobile
   */
  get hidePortalAnimations(): boolean {
    return this.useMobileOptions && this.showPortalOnMobile;
  }

  /**
   * Changes the display text and colors the selected option(s)
   */
  protected updateOptionsAndDisplay() {
    let selectedValue: Array<any>;

    if (this._multiselect) {
      selectedValue = Array.isArray(this._isSelectValue) ? this._isSelectValue : [];
    } else {
      selectedValue = [this._isSelectValue];
    }

    if (this.nested) {
      this.selectedNodes = this.getSelectedNodes(selectedValue);
    } else if (this.isSelectOptions) {
      this.selectedOptions = [];
      this.isSelectOptions.forEach(option => {
        option.isSelected = selectedValue.indexOf(option.value) !== -1;
        if (option.isSelected) {
          this.selectedOptions.push(option);
        }
      });
    }

    this.updateDisplayText();
  }

  /**
   * To be used to get the class for
   * the position of options list.
   */
  get isOptionsPlacementClass(): string {
    return this.useMobileOptions ?
      '' :
      `is-select__options--${this.placement.toString()}`;
  }

  /**
   * To be used the get the class for
   * the background of the options list.
   */
  get isSelectBackgroundTheme(): string {
    return `is-select__options--${this.background.toString()}`;
  }

  /**
   * To be used the get the class for
   * the background of the options list.
   */
  get isPortalBackgroundTheme(): string {
    return `is-portal--${this.background.toString()}`;
  }

  /**
   * Whether or not to show the SelectAll
   * options for multiselect.
   */
  get allowSelectAll(): boolean {
    return this._multiselect && this._showSelectAll && !this.nested;
  }

  /**
   * Whether or not the options block is open.
   */
  get isOpened(): boolean {
    return this.state === 'opened';
  }

  /**
   * To be used to update the model value.
   * @param value
   */
  writeValue(value: any) {
    this._isSelectValue = value;
    this.updateOptionsAndDisplay();
  }

  /**
   * To be used to register ControlValueAccessor change.
   * @param fn
   */
  registerOnChange( fn: any ) {
    this.propagateChange = fn;
  }

  /**
   * To be used to register ControlValueAccessor on touch.
   */
  registerOnTouched(fn: any) {
    this.propagateTouched = fn;
  }

  /**
   * Implemented as a part of ControlValueAccessor.
   * @param isDisabled
   */
  setDisabledState( isDisabled: boolean ): void {
    this.disabled = isDisabled;
    this.cdr.markForCheck();
  }

  /**
   * EventEmitter that will be triggered
   * on clicking the option.
   * @param option
   */
  public onOptionClick(option: IsOption) {
    let childNodes: IsSelectNode[] = [];
    if (this.nested) {
      const currentNode = this.currentTreeData
        .find((item: IsSelectNode) => item.value === option.value);
      if (currentNode.nodes && currentNode.nodes.length !== 0) {
        this.nestedIterationPath.push(this.currentTreeData);
        this.currentTreeData = currentNode.nodes;
        childNodes = currentNode.nodes;
      }
      this.isSelectOptions = this.nestedOptions;
    }

    if (childNodes.length === 0) {
      this.selectOption(option, false);

      if (!this._multiselect) {
        this.toggleOptionsBlock(true);
      }
    }
  }

  /**
   * EventEmitter that will be triggered
   * on clicking the select all option.
   */
  onSelectAll() {
    this.isSelectedAll = !this.isSelectedAll;
    this.resetSelection();

    this.isSelectOptions.forEach(option => {
      option.isSelected = !this.isSelectedAll;
      this.selectOption(option, this.isSelectedAll);
    });
  }

  /**
   * EventEmitter that will be triggered
   * on clicking the option and will set
   * the css for the selected option.
   * @param option
   * @param selectedAll
   */
  public selectOption(option: IsOption, selectedAll: boolean) {
    if (this.nested) {
      this.selectOptionNested(option, true);
    } else {
      if (this._multiselect) {
        this.isSelectedAll = selectedAll;
        option.isSelected = !option.isSelected;
        // Remove option for selectedoptions
        if (!option.isSelected) {
          const i = this.selectedOptions.indexOf(option);
          this.selectedOptions.splice(i, 1);
        } else {
          this.selectedOptions.push(option);
        }
        // Generating selected options value array for ngModel
        const selectedOptionsValues: string[] = [];
        this.selectedOptions.forEach(element => {
          selectedOptionsValues.push(element.value);
        });
        this.isSelectValue = selectedOptionsValues;
      } else {
        // To change class of selected option
        this.isSelectValue = option.value;
      }
    }
    /** check if we also need to update the overlay */
    if (this._autoSize && this.isOpened && !this.useMobileOptions && this._multiselect) {
      runWhenStable(this.ngZone, () => {
          this.calculateBoundaries();
          this.updateOverlaySize();
        });
    }
  }

  /**
   * EventEmitter that will be triggered
   * on clicking the option and will set
   * the css for the selected option.
   * @param option
   * @param isOptionClick
   */
  public selectOptionNested(option: IsOption, isOptionClick: boolean) {
    if (this._multiselect) {
      if (isOptionClick) {
        option.isSelected = !option.isSelected;
        if (!option.isSelected) {
          const i = this.selectedOptions.indexOf(option);
          this.selectedOptions.splice(i, 1);
          const index = this.selectedNodes
            .findIndex((node: IsSelectNode) => node.value === option.value);
          this.selectedNodes.splice(index, 1);
        } else {
          this.selectedOptions.push(option);
          this.selectedNodes.push(option.associatedNode);
        }
      }
      // Generating selected options value array for ngModel
      const selectedOptionsValues: string[] = [];
      this.selectedNodes.forEach(element => {
        selectedOptionsValues.push(element.value);
      });
      this.isSelectValue = selectedOptionsValues;
    } else {
      this.selectedNodes = [];
      this.selectedNodes.push(option.associatedNode);
      this.isSelectValue = option.value;
    }
  }

  /**
   * Whether or not nested option is selected
   * @param option
   */
  isNestedOptionSelected(option: IsSelectNode) {
    if (option.selected) {
      return true;
    } else {
      return this.selectedNodes
        .filter((node: IsSelectNode) => node.value === option.value).length > 0;
    }
  }

  /**
   * To be used to decide the value of display text,
   * depending on autoSize property.
   */
  updateDisplayText() {
    let selectedOptions: IsOption[] | IsSelectNode[];
    if (this.nested) {
      selectedOptions = this.selectedNodes;
    } else {
      selectedOptions = this.selectedOptions;
    }
    if (this._autoSize === true) {
      this.isSelectDisplayText = this.nested ?
        this.selectedNodes
          .map(option => option.displayText)
          .join(', ') :
        this.selectedOptions
          .map(option => option.displayText)
          .join(', ');
    } else {
      if (this.selectedOptions.length > 1) {
        this.isSelectDisplayText = selectedOptions.length + ' Selected';
      } else {
        this.isSelectDisplayText = selectedOptions[0] ? selectedOptions[0].displayText : '';
      }
    }

    if (this.inputEmbeddedTemplate) {
      this.inputEmbeddedTemplate.context.data = selectedOptions;
    }

    this.cdr.markForCheck();
  }

  /**
   * EventEmitter that should be used to show and hide options.
   * @param close
   */
  public toggleOptionsBlock(close?: boolean) {
    if (this.disabled) {
      return;
    }

    if (close || this.isOpened) {
      this.state = 'closed';
      this.propagateTouched();

      if (this.isSelectOptions.length > 0 && !this._multiselect) {
        this.removeKeyboardListeners();
        this.temporarySelectionIndex = null;
        this.isSelectOptions
          .forEach((option: IsOption) => option.isTemporarySelected = false);
      }

      if (this.useMobileOptions) {
        this.resetPortalOptions();
        this.portalService.close();
      }
    } else {
      this.calculateBoundaries();
      if (!this.preserveFilterText) {
        this.clearFilter();
      }
      this.state = 'opened';
      this.cdr.detectChanges();
      this.processOpenBlock();
      this.onDropdownOpen();
    }
  }

  /**
   * Run when dropdown is opened
   */
  onDropdownOpen() {
    this.dropdownOpen.emit();
  }

  /**
   * Run when filter value is changed
   */
  onFilterChange() {
    this.filterChange.emit(this.isSelectFilterText);
  }

  /**
   * Process open block
   */
  processOpenBlock() {
    if (this.nested) {
      this.isSelectOptions = this.nestedOptions;
      this.cdr.markForCheck();
      this.selectedOptions = this.isSelectOptions.filter(option => option.isSelected);
    }
    if (this.isSelectOptions.length > 0 && !this._multiselect) {
      this.addKeyboardListeners();
      if (this.selectedOptions[0]) {
        this.temporarySelectionIndex = this.isSelectOptions.toArray()
          .findIndex(option => option === this.selectedOptions[0]);
      }
      if (!isNullOrUndefined(this.temporarySelectionIndex)) {
        this.updateOptionListScroll(this.isSelectOptions.toArray()[this.temporarySelectionIndex]);
      }
    }
    if (this.useMobileOptions) {
      this.setPortalOptions();
      this.portalService.open(this.template, this.portalOptions);
    }
  }

  /**
   * Set portal options
   */
  setPortalOptions() {
    this.portalOptions = new IsPortalOptions();
    if (this.filterable) {
      this.portalOptions.height = 280;
    }

    this.portalOptions.animationsOn = this.hidePortalAnimations;
    this.portalOptions.data = this;
    this.portalOptions.classNames = [
      'is-select-portal',
      'is-portal--auto-height',
      this.isPortalBackgroundTheme
    ];

    if (this.isInline) {
      this.portalOptions.classNames.push('is-select-portal-inline');
    }
  }

  /**
   * Reset portal options
   */
  resetPortalOptions() {
    this.portalOptions = null;
  }

  /**
   * Callback to process user interaction with the component by using the arrow keys.
   * @param event
   */
  onKeyup(event: KeyboardEvent): void {
    // Backspace
    if (event.code === IsKey.Backspace || event.keyCode === BACKSPACE) {
      const isTargetInput = this.domHandler.hasClass(event.target, 'is-select__filter-input__input');
      const filterValue = this.filterInput ?
        this.filterInput.nativeElement.value :
        '';
      const isFilterInputEmpty = !isEmptyString(filterValue);
      if (this.nested && this.showBackButton()
          && !(isTargetInput && isFilterInputEmpty) &&
          this.lastFilterValue.length === 0) {
        this.goBack();
      }
      this.lastFilterValue = filterValue;
    // Arrow Down
    } else if (event.code === IsKey.ArrowDown || event.keyCode === DOWN_ARROW) {
      const nextAvailableSelectionIndex = this.nextAvailableSelectionIndex;
      this.selectListItem(nextAvailableSelectionIndex);
      this.updateOptionListScroll(this.isSelectOptions.toArray()[nextAvailableSelectionIndex]);
    // Arrow Up
    } else if (event.code === IsKey.ArrowUp || event.keyCode === UP_ARROW) {
      const previousAvailableSelectionIndex = this.previousAvailableSelectionIndex;
      this.selectListItem(previousAvailableSelectionIndex);
      this.updateOptionListScroll(this.isSelectOptions.toArray()[previousAvailableSelectionIndex]);
    // Enter
    } else if (event.code === IsKey.Enter || event.keyCode === ENTER) {
      if (!isNullOrUndefined(this.temporarySelectionIndex)) {
        this.onOptionClick(this.isSelectOptions.toArray()[this.temporarySelectionIndex]);
      } else {
        this.toggleOptionsBlock();
      }
    // Escape
    } else if (event.code === IsKey.Esc || event.keyCode === ESCAPE) {
      this.toggleOptionsBlock(true);
    }
  }

  /**
   * Callback to process user interaction with the component by typing on the keyboard.
   * @param event
   */
  onKeypress(event: KeyboardEvent): void {
    const key = event.key.toLowerCase();
    this.selectionString = `${this.selectionString}${key}`;

    this.controlFilterMemory();

    const newTemporarySelectedIndex = this.getFirstMatchingOptionIndex(this.selectionString, this.strictSelect);

    if (!isNullOrUndefined(newTemporarySelectedIndex)) {
      this.selectListItem(newTemporarySelectedIndex);
      // Scroll the list to the first matching option
      this.updateOptionListScroll(this.isSelectOptions.toArray()[newTemporarySelectedIndex]);
    }
  }

  /**
   * Method for controlling filter memory, selectionString must be kept for a defined
   * amount of time (while the user is typing). When this time has passed,
   * then selectionString must be cleaned up.
   */
  controlFilterMemory() {
    if (this.selectionTimer !== null) {
      clearTimeout(this.selectionTimer);
    }

    this.selectionTimer = setTimeout(() => {
      this.selectionString = '';
    }, this.selectionTimeout);
  }

  /**
   * Receives a string and search the first matching option to select.
   * Matching configuration might be affected by the param `strictSelect`
   * @param searchText
   * @param strictSearch if true only matches beginning of the option's innerHTML, if false matches anywhere
   */
  getFirstMatchingOptionIndex(searchText: string, strictSearch: boolean = false): number | null {
    let optionIndex = null;

    const options = this.isSelectOptions.toArray();
    for (let i = 0; i < options.length; i++) {
      const optionDispayText = options[i].innerHtml || options[i].displayText;
      const name = optionDispayText.toLowerCase().trim();
      const index = name.indexOf(searchText);

      const foundStrictSearch = (!strictSearch && index > -1);
      const foundNonStrictSearch = (strictSearch && index === 0);

      if (foundStrictSearch || foundNonStrictSearch) {
        optionIndex = i;
        break;
      }
    }

    return optionIndex;
  }

  /**
   * Callback used to disable the scrolling of the window
   * when the arrow keys are pressed.
   * @param event
   */
  onKeydown(event: KeyboardEvent) {
    if (event.code === IsKey.ArrowUp || event.code === IsKey.ArrowDown ||
        event.keyCode === UP_ARROW || event.keyCode === DOWN_ARROW) {
      event.preventDefault();
    }
  }

  /**
   * Updates the scroll position of the option list wrapper
   * when the user interacts with the component using the keyboard.
   * @param option
   */
  updateOptionListScroll(option: IsOption) {
    setTimeout(() => {
      if (!isNullOrUndefined(option) && !isNullOrUndefined(this.optionList)) {
        const listHeight = this.optionList.nativeElement.clientHeight;
        const listScroll = this.optionList.nativeElement.scrollTop;
        const optionHeight = option.elementRef.nativeElement.scrollHeight;
        const optionPosition = option.elementRef.nativeElement.offsetTop;

        if (optionHeight + optionPosition > listHeight + listScroll) {
          this.optionList.nativeElement.scrollTop = optionPosition + optionHeight - listHeight;
        } else if (optionPosition < listScroll) {
          this.optionList.nativeElement.scrollTop = optionPosition;
        }
      }
    });
  }

  /**
   * Selects a particular item when using the keyboard.
   * This selections will only change the styling of the item
   * but won't trigger an event unless Enter key is pressed to
   * confirm the selection.
   * @param newTemporarySelectedIndex
   */
  selectListItem(newTemporarySelectedIndex: number | null) {
    const oldTemporarySelectedIndex = this.temporarySelectionIndex;

    if (!isNullOrUndefined(oldTemporarySelectedIndex)) {
      this.isSelectOptions.toArray()[oldTemporarySelectedIndex].isTemporarySelected = false;
    }

    if (!isNullOrUndefined(newTemporarySelectedIndex)) {
      this.isSelectOptions.toArray()[newTemporarySelectedIndex].isTemporarySelected = true;
    }

    this.temporarySelectionIndex = newTemporarySelectedIndex;
  }

  /**
   * Adds all the keyboard listeners.
   */
  addKeyboardListeners() {
    this.keydownListener = this.renderer.listen('document', 'keydown', this.onKeydown.bind(this));
    this.keyupListener = this.renderer.listen('document', 'keyup', this.onKeyup.bind(this));

    if (!this.filterable) {
      this.keypressListener = this.renderer.listen('document', 'keypress', this.onKeypress.bind(this));
    }
  }

  /**
   * Removes all the keyboard listeners.
   */
  removeKeyboardListeners() {
    this.keydownListener();
    this.keyupListener();

    if (!this.filterable) {
      this.keypressListener();
    }
  }

  /**
   * EventEmitter to be used to hide those element
   * that doesn't match the filter criteria.
   */
  filterOptions() {
    if (this.asyncFilter) {
      return;
    }

    const filterText = this.isSelectFilterText || '';

    if (this.optionList && filterText && !this.multiselect) {
      this.selectListItem(this.getFirstMatchingOptionIndex(filterText));
    }

    this.isSelectOptions.forEach(option => {
      option.isHidden = option.displayText
        .toLowerCase()
        .indexOf(filterText.toLowerCase()) === -1;
    });
  }

  /**
   * EventEmitter that will be used to
   * clear the filtering criteria.
   */
  clearFilter() {
    this.isSelectFilterText = '';
    this.filterOptions();
    this.onFilterChange();
  }

  /**
   * Get hidden options
   */
  get hiddenOptions(): IsOption[] {
    return this.isSelectOptions.filter((option) => option.isHidden === true);
  }

  /**
   * Show empty message block
   */
  showEmptyMessageBlock(): boolean {
    return this.emptyMessage && this.hiddenOptions.length === this.isSelectOptions.length;
  }

  /**
   * Show options block
   */
  showOptionsBlock(): boolean {
    return !this.nested && this.hiddenOptions.length !== this.isSelectOptions.length;
  }

  /**
   * Show nested options
   */
  showNestedBlock(): boolean {
    return this._nested;
  }

  /**
   * Show Back button
   */
  showBackButton(): boolean {
    return this.nested && this.nestedIterationPath.length > 0;
  }

  /**
   * Get tree data
   */
  goBack() {
    this.currentTreeData = this.nestedIterationPath.length !== 0 ?
      this.nestedIterationPath[this.nestedIterationPath.length - 1] :
      this.currentTreeData;
    this.nestedIterationPath.pop();
  }

  /**
   * Get selected nested nodes based on an array of selected values
   */
  getSelectedNodes(values: string[]): IsSelectNode[] {
    const nodes: IsSelectNode[] = [];

    values.forEach(value => {
      const node = this.getNodeByValue(value, this.data);

      if (node) {
        nodes.push(node);
      }
    });

    return nodes;
  }

  /**
   * Get a nested node using a value
   */
  getNodeByValue(value: string, data: IsSelectNode[]): IsSelectNode | undefined {
    const parent: IsSelectNode | undefined = data.find(item => item.value === value);

    if (parent) {
      return parent;
    } else {
      for (let i = 0; i < data.length; i++) {
        if (data[i].nodes) {
          const child = this.getNodeByValue(value, data[i].nodes);

          if (child) {
            return child;
          }
        }
      }
    }
  }

  /**
   * Stops event bubbling
   * @param e
   */
  preventChangeFromBubbling(e: Event) {
    e.stopPropagation();
  }

  /**
   * EventEmitter that will be triggered
   * to deselect all the selected options.
   */
  private resetSelection() {
    this.isSelectDisplayText = null;
    this.selectedOptions = [];
  }

  /**
   * The next index on list which isn't filtered out and can be selected
   */
  protected get nextAvailableSelectionIndex(): number | null {
    const availableIndexes = this.availablesIndexesForSelection;
    if (!availableIndexes.length) {
      return null;
    }

    const temporaryPositionInAvailables = availableIndexes.indexOf(this.temporarySelectionIndex);
    const temporaryIsntAvailable = (temporaryPositionInAvailables === -1);
    const temporaryIsTheLastOneAvailable = (temporaryPositionInAvailables === (availableIndexes.length - 1));

    if (temporaryIsntAvailable || temporaryIsTheLastOneAvailable) {
      return availableIndexes[0];
    }

    return availableIndexes[temporaryPositionInAvailables + 1];
  }

  /**
   * Get options' indexes which weren't hidden by filters
   */
  protected get availablesIndexesForSelection(): number[] {
    return this.isSelectOptions
      .reduce((acc, item, idx) => {
        if (!item.isHidden) {
          acc.push(idx);
        }

        return acc;
      }, []);
  }

  /**
   * The previous index on list which isn't filtered out and can be selected
   */
  protected get previousAvailableSelectionIndex(): number | null {
    const availableIndexes = this.availablesIndexesForSelection;
    if (!availableIndexes.length) {
      return null;
    }

    const temporaryPositionInAvailables = availableIndexes.indexOf(this.temporarySelectionIndex);
    const temporaryIsntAvailable = (temporaryPositionInAvailables === -1);
    const temporaryIsTheFirstOneAvailable = (temporaryPositionInAvailables === 0);

    if (temporaryIsTheFirstOneAvailable || temporaryIsntAvailable) {
      return availableIndexes[availableIndexes.length - 1];
    }

    return availableIndexes[temporaryPositionInAvailables - 1];
  }
}
