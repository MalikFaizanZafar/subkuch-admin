import {
  ApplicationRef,
  ComponentFactoryResolver,
  Inject,
  Injectable,
  Injector,
  Optional
} from '@angular/core';
import { ComponentPortal, DomPortalHost } from '@angular/cdk/portal';
import { Observable, Subject } from 'rxjs';

import { IsToastContainer } from './toast-container';
import { ToastOptions } from './toast-options';
import { IsToastPosition } from './toast-position';
import { TOAST_CONFIG } from './toast-config';
import { IsToastAction } from './toast-action';
import * as toastConst from './toast.const';
import { IsBaseToastOptions } from './toast-base-options';
import { IsToastType } from './toast-type.model';

/**
 * Defines a IsBaseToastOptions to be used
 * as default config for the snackbar
 * if no additional config is providedIsTreeViewHelper.
 */
const DEFAULT_OPTIONS: IsBaseToastOptions = {
  closeOnClick: true,
  autoCloseTime: 5000,
  hasAutoCloseTime: true,
  showCloseButton: true,
  position: IsToastPosition.TopRight,
  newestFirst: true,
  width: '320px'
};

/**
 * Service to inject toast component to Dom on method call
 */
@Injectable({
  providedIn: 'root'
})
export class IsToasterService {
  /**
   * Reference to Portal.
   * This is the portal we'll use to attach IsToastContainer component.
   */
  private toasterPortal: ComponentPortal<IsToastContainer>;

  /**
   * Reference to Portal Host.
   * We use DOMPortalHost as we'll be using document.body as anchor.
   */
  private bodyPortalHost: DomPortalHost;

  /**
   * Array of toasts to be shown in container
   */
  public toastsArray: any[] = [];

  /**
   * Host container for toasts (Toast components)
   */
  private toastContainerInstance: IsToastContainer;

  /**
   * Variable to hold toast constants
   */
  public toastConstant: any;

  /**
   * Toaster Global Config, that is provided whenever
   * the toast module is declared with it.
   * @var {ToastOptions}
   */
  private toastGlobalConfig: IsBaseToastOptions;

  /**
   * Inject the dependencies needed by the DOMPortalHost constructor
   * @param componentFactoryResolver ComponentFactoryResolver
   * @param appRef ApplicationRef
   * @param injector Injector
   * @param config global configuration for toast component
   */
  constructor( private componentFactoryResolver: ComponentFactoryResolver,
               private appRef: ApplicationRef,
               private injector: Injector,
               @Optional() @Inject(TOAST_CONFIG) private config: IsBaseToastOptions ) {
    this.toasterPortal = new ComponentPortal(IsToastContainer);
    // default config passed through injection
    this.toastGlobalConfig = this.config;
    // Create a PortalHost with document.body as its anchor element
    this.bodyPortalHost = new DomPortalHost(
      document.body,
      this.componentFactoryResolver,
      this.appRef,
      this.injector);
    this.toastConstant = toastConst;
  }

  /**
   * Setter method for container instance
   * @param containerInstance
   */
  setToastContainerInstance( containerInstance: IsToastContainer ) {
    this.toastContainerInstance = containerInstance;
  }

  /**
   * Function that combines default values, with default options passed
   * through the module injection and custom options passed by the user.
   * It firsts writes delay and orientation based on the constants this service
   * has, then if the default options are not null overwrites the previous
   * values by its own. Finally the options that the user passed, overwrites
   * any previous declaration for the attributes.
   * @param options - the custom options passed by the user
   */
  buildToastOptions( options: ToastOptions ): ToastOptions {
    const defaultOptions = Object.assign({}, DEFAULT_OPTIONS);
    return Object.assign(defaultOptions, this.toastGlobalConfig, options);
  }

  /**
   * This method is used to the show the toast
   * @param message message to be shown in toast
   * @param options options for toast
   */
  public pop( message: string, options?: ToastOptions ): Observable<any> {
    // If host container does not exist, we create one
    const subject = new Subject();
    if (!this.toastContainerInstance) {
      this.toastContainerInstance = this.createHostView();
    }
    const newToastOptions = this.buildToastOptions(options);
    this.toastContainerInstance.addToastToContainer(message, newToastOptions)
      .subscribe(( toast ) => {
        toast.onCloseButtonClick.subscribe(() => {
          subject.next({
            action: IsToastAction.CloseButtonClick,
            instance: toast
          });
          subject.complete();
        });

        toast.closeTimeOut.subscribe(() => {
          subject.next({
            action: IsToastAction.AutoClose,
            instance: toast
          });
          subject.complete();
        });

        toast.onClick.subscribe(() => {
          subject.next({
            action: IsToastAction.Click,
            instance: toast
          });
          subject.complete();
        });
      });
    return subject;
  }

  /**
   * Show success toast
   * @param message message that needs to shown
   * @param options options that need to be passed to the toast
   */
  public popSuccess( message: string, options?: ToastOptions ): Observable<any> {
    const successOptions = this.getOptions(IsToastType.Success, options);
    return this.pop(message, Object.assign({}, options, successOptions));
  }

  /**
   * Show error toast
   * @param message message that needs to shown
   * @param options options that need to be passed to the toast
   */
  public popError( message: string, options?: ToastOptions ): Observable<any> {
    const errorOptions = this.getOptions(IsToastType.Error, options);
    return this.pop(message, Object.assign({}, options, errorOptions));
  }

  /**
   * Show info toast
   * @param message that needs to shown
   * @param options that need to be passed to the toast
   */
  public popInfo( message: string, options?: ToastOptions ): Observable<any> {
    const infoOptions = this.getOptions(IsToastType.Info, options);
    return this.pop(message, Object.assign({}, options, infoOptions));
  }

  /**
   * Show warning toast
   * @param message message that needs to shown
   * @param options options that need to be passed to the toast
   */
  public popWarning( message: string, options?: ToastOptions ): Observable<any> {
    const warningOptions = this.getOptions(IsToastType.Warning, options);
    return this.pop(message, Object.assign({}, options, warningOptions));
  }

  /**
   * Get options based on the toast type
   * @param toastType
   * @param options
   */
  public getOptions( toastType: IsToastType, options: ToastOptions ) {
    const optionDetails = this.toastConstant.toastDetails[toastType];
    return {
      title: options && options.title ? options.title : optionDetails.title,
      type: optionDetails.type,
      faIcon: options && options.faIcon ? options.faIcon : optionDetails.faIcon
    };
  }

  /**
   * This function is to create toasts host container inside app content
   * reference
   */
  private createHostView(): IsToastContainer {
    const componentRef = this.bodyPortalHost.attachComponentPortal(this.toasterPortal);
    return componentRef.instance;
  }
}
