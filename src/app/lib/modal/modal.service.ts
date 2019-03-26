import { ComponentPortal, DomPortalHost } from '@angular/cdk/portal';
import {
  ApplicationRef,
  ComponentFactoryResolver,
  Injectable,
  Injector,
  TemplateRef
} from '@angular/core';

import { IsActiveModal } from './active-modal';
import { IsModal } from './modal';
import { IsModalOptions } from './modal-options';
import { IsModalRef } from './modal-ref';

/**
 * Modal Service
 */
@Injectable()
export class IsModalService {

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
   * Modal instance
   */
  private modalInstance: IsModal;

  /**
   * Constructor
   * @param componentFactoryResolver
   * @param appRef
   * @param injector
   */
  constructor( private componentFactoryResolver: ComponentFactoryResolver,
               private appRef: ApplicationRef,
               private injector: Injector ) {}

  /**
   * Opens a modal
   * @param content - Required param representing modal content
   * @param [options={}] - Optional modal options
   * @memberof IsModalService
   */
  public open( content: any, options: IsModalOptions = {} ): IsModalRef {
    this.modalInstance = this.createModalInstance();
    this.modalInstance.modalOptions = options;

    const activeModal = this.createActiveModalInstance(this.modalInstance);
    let componentInstance;
    // Content instantiation. It differs if the content is a TemplateRef or a
    // component.
    if (content instanceof TemplateRef) {
      this.createTemplateModal(this.modalInstance, activeModal, content);
    } else {
      componentInstance = this.createComponentModal(this.modalInstance, activeModal, content);
    }

    // The IsModal instance needs a function to destroy itself. The component
    // should not know the details of the implementation, it only needs to know
    // what method to call.
    const contentPortal = this.contentPortal;
    this.modalInstance.destroyFn = () => contentPortal.detach();

    return new IsModalRef(this.modalInstance.onClose, componentInstance);
  }

  /**
   * Creates modal instance
   */
  createModalInstance(): IsModal {
    this.contentPortal = new ComponentPortal(IsModal);
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
   * Creates active modal instance
   * @param isModalInstance
   */
  createActiveModalInstance( isModalInstance: IsModal ): IsActiveModal {
    // Create an instance of the active modal. This instance will have:
    //   - close: the method used to close the modal
    //   - data: optional data passed from the source available via DI
    const activeModal = new IsActiveModal();
    activeModal.close = isModalInstance.close.bind(isModalInstance);
    activeModal.data = isModalInstance.modalOptions.data;
    return activeModal;
  }

  /**
   * Create modal based on a TempalteRef
   * @param isModalInstance
   * @param activeModal
   * @param content
   * @memberof IsModalService
   */
  createTemplateModal( isModalInstance: IsModal, activeModal: IsActiveModal, content ) {
    const view = isModalInstance.content.vcr.createEmbeddedView(content);

    // set the context of the templateRef so that the user can do
    // let-close="close" and let-data="data"
    Object.assign(view.context, activeModal);
  }

  /**
   * Creates modal depending on the component passed on the parameters.
   * @param isModalInstance
   * @param activeModal
   * @param content
   * @memberof IsModalService
   */
  createComponentModal( isModalInstance: IsModal, activeModal: IsActiveModal, content ) {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(content);

    // Create a custom injector which will provide the IsActiveModal
    // dependency with the activeModal instance previously created
    const modalInjector = Injector
      .create([
        {
          provide: IsActiveModal,
          useValue: activeModal
        }
      ], this.injector);

    // Create the component inside the isModalInstance using the custom injector
    return isModalInstance
      .content
      .vcr
      .createComponent(componentFactory, undefined, modalInjector)
      .instance;
  }

}
