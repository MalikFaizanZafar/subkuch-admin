import { InjectionToken } from '@angular/core';
import { IsRevealCarouselOptions } from './reveal-carousel-options';

export let REVEAL_CAROUSEL_CONFIG = new InjectionToken<IsRevealCarouselOptions>('reveal-carousel.config');
