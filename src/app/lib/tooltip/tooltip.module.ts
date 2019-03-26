import { ModuleWithProviders, NgModule } from '@angular/core';
import { BODY_TOKEN, DOCUMENT_TOKEN } from '../core/index';
import { IsToolTip, IsToolTipContainer } from './tooltip';
import { IsToolTipDirective } from './tooltip.directive';
import { IsMouseUpService } from '../core/shared/service/index';
import { CommonModule } from '@angular/common';
import { IsTooltipOptions } from './tooltip.options';
import { TOOLTIP_CONFIG } from './tooltip.config';

@NgModule({
  imports: [CommonModule],
  exports: [
    IsToolTipDirective,
    IsToolTip
  ],
  declarations: [
    IsToolTipDirective,
    IsToolTip,
    IsToolTipContainer
  ],
  entryComponents: [IsToolTip]
})
export class IsToolTipModule {
  static forRoot(tooltipDefaultOptions?: IsTooltipOptions): ModuleWithProviders {
    return {
      ngModule: IsToolTipModule,
      providers: [
        IsMouseUpService,
        { provide: TOOLTIP_CONFIG, useValue: tooltipDefaultOptions },
        { provide: BODY_TOKEN, useValue: document.body },
        { provide: DOCUMENT_TOKEN, useValue: document }
      ]
    };
  }
}
