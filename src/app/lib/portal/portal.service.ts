import { ComponentPortal, DomPortalHost } from '@angular/cdk/portal';
import {
  ApplicationRef,
  ComponentFactoryResolver,
  Injectable,
  Injector,
  TemplateRef,
  StaticProvider,
  Type
} from '@angular/core';

import { IsActivePortal } from './active-portal';
import { IsPortal } from './portal';
import { IsPortalOptions } from './portal-options';
import { IsPortalRef } from './portal-ref';

/**
 * Portal Service
 */
@Injectable({
  providedIn: 'root'
})
export class IsPortalService {

  /**
   * Content portal that is to be attached
   * It can be a component or template
   */
  private contentPortal: ComponentPortal<any>;

  /**
   * Dom portal host where content is to be attached
   */
  private bodyPortalHost: DomPortalHost;

  /**
   * Portal instance
   */
  private portalInstance: IsPortal;

  /**
   * Constructor
   * @param componentFactoryResolver ComponentFactoryResolver
   * @param appRef reference to application
   * @param injector Injector
   */
  constructor( private componentFactoryResolver: ComponentFactoryResolver,
               private appRef: ApplicationRef,
               private injector: Injector ) {
  }

  /**
   * Opens a portal
   * @param content
   * @param options
   * @param mobileOptions
   * @param serviceInjector
   */
  public open<T = any>(
    content: any,
    options?: IsPortalOptions,
    mobileOptions?: IsPortalOptions,
    serviceInjector?: StaticProvider): IsPortalRef<T> {
    this.portalInstance = this.createPortalInstance();
    this.portalInstance.mobileOptions = mobileOptions;
    this.portalInstance.options = options;
    this.portalInstance.isTemplateProvided = true;
    this.portalInstance.closing = false;
    this.portalInstance.showPortal = true;
    let componentInstance: T;
    const activePortal = this.createActivePortalInstance(this.portalInstance);
    // Content instantiation. It differs if the content is a TemplateRef or a
    // component.
    if (content instanceof TemplateRef) {
      this.createTemplatePortal(this.portalInstance, activePortal, content);
    } else {
      componentInstance = this.createComponentPortal(this.portalInstance, activePortal, content, serviceInjector);
    }

    // The IsPortal instance needs a function to destroy itself. The component
    // should not know the details of the implementation, it only needs to know
    // what method to call.
    const contentPortal = this.contentPortal;
    this.portalInstance.destroyFn = () => {
      if (this.contentPortal.isAttached) {
        contentPortal.detach();
      }
    };
    return new IsPortalRef<T>(this.portalInstance.onClose, componentInstance);
  }

  /**
   * Removes the latest instance of portal
   */
  remove() {
    if (this.contentPortal.isAttached) {
      this.contentPortal.detach();
    }
  }

  /**
   * Close portal using closePortal
   * method from portal instance
   */
  close() {
    if (this.portalInstance && this.contentPortal.isAttached) {
      this.portalInstance.closePortal();
    }
  }

  /**
   * Creates active portal instance
   * @param isPortalInstance
   */
  createActivePortalInstance( isPortalInstance: IsPortal ): IsActivePortal {
    // Create an instance of the active portal. This instance will have:
    //   - close: the method used to close the portal
    //   - data: optional data passed from the source available via DI

    const activePortal = new IsActivePortal();
    activePortal.close = isPortalInstance.closePortal.bind(isPortalInstance);
    activePortal.data = isPortalInstance.useMobileOptions ?
                          this.getPortalOptionsData(isPortalInstance.mobileOptions || isPortalInstance.options) :
                          this.getPortalOptionsData(isPortalInstance.options);
    return activePortal;
  }

  /**
   * Get the portal options data
   * @param options
   */
  private getPortalOptionsData(options: IsPortalOptions) {
    return options ? options.data : {};
  }

  /**
   * Creates portal instance
   */
  private createPortalInstance(): IsPortal {
    this.contentPortal = new ComponentPortal(IsPortal);
    this.bodyPortalHost = new DomPortalHost(
      document.body,
      this.componentFactoryResolver,
      this.appRef,
      this.injector
    );

    const componentRef = this.contentPortal.attach(this.bodyPortalHost);
    return componentRef.instance;
  }

  /**
   * Create portal based on a TemplateRef
   * @param isPortalInstance
   * @param activePortal
   * @param content
   */
  private createTemplatePortal( isPortalInstance: IsPortal, activePortal: IsActivePortal, content: TemplateRef<any> ) {
    const view = isPortalInstance.content.vcr.createEmbeddedView(content);

    // set the context of the templateRef so that the user can do
    // let-close="close" and let-data="data"
    Object.assign(view.context, activePortal);
  }

  /**
   * Creates portal depending on the component passed on the parameters.
   * @param isPortalInstance
   * @param activePortal
   * @param content
   * @param serviceInjector
   */
  private createComponentPortal<T = any>(
    isPortalInstance: IsPortal,
    activePortal: IsActivePortal,
    content: Type<T>,
    serviceInjector?: StaticProvider) {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(content);
    // Create a custom injector which will provide the IsActivePortal
    // dependency with the activePortal instance previously created
    const portalInjector = Injector
    .create([
      {
        provide: IsActivePortal,
        useValue: activePortal
      },
      serviceInjector
    ], this.injector);

  // Create the component inside the isPortalInstance using the custom injector
  return isPortalInstance
    .content
    .vcr
    .createComponent(componentFactory, undefined, portalInjector)
    .instance;
  }
}
