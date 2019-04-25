import { ModuleWithProviders, NgModule } from '@angular/core';
import {
  IsCard,
  IsCardAvatar,
  IsCardContent,
  IsCardFooter,
  IsCardHeader,
  IsCardHeaderButton,
  IsCardImage,
  IsCardTitle
} from './card';

@NgModule({
  imports: [],
  exports: [
    IsCard,
    IsCardTitle,
    IsCardContent,
    IsCardFooter,
    IsCardHeader,
    IsCardHeaderButton,
    IsCardImage,
    IsCardAvatar
  ],
  declarations: [
    IsCard,
    IsCardTitle,
    IsCardContent,
    IsCardFooter,
    IsCardHeader,
    IsCardHeaderButton,
    IsCardImage,
    IsCardAvatar
  ]
})
export class IsCardModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: IsCardModule,
      providers: []
    };
  }
}
