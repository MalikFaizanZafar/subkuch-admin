import {
  NgModule,
  ModuleWithProviders
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { IsRevealCarousel } from './reveal-carousel';
import {
  IsRevealCarouselExpandableDirective
} from './reveal-carousel-expandable';
import {
  IsRevealCarouselBodyDirective
} from './reveal-carousel-body';
import {
  IsRevealCarouselItemDirective
} from './reveal-carousel-item';
import { IsRevealCarouselOptions } from './reveal-carousel-options';
import { REVEAL_CAROUSEL_CONFIG } from './reveal-carousel.config';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    IsRevealCarousel,
    IsRevealCarouselBodyDirective,
    IsRevealCarouselItemDirective,
    IsRevealCarouselExpandableDirective
  ],
  declarations: [
    IsRevealCarousel,
    IsRevealCarouselBodyDirective,
    IsRevealCarouselItemDirective,
    IsRevealCarouselExpandableDirective
  ],
})
export class IsRevealCarouselModule {
  static forRoot(revealCarouselDefaultOptions?: IsRevealCarouselOptions): ModuleWithProviders {
    return {
      ngModule: IsRevealCarouselModule,
      providers: [
        { provide: REVEAL_CAROUSEL_CONFIG, useValue: revealCarouselDefaultOptions }
      ]
    };
  }
}
