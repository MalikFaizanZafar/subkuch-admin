import { ModuleWithProviders, NgModule } from '@angular/core';
import { IsToolTipModule } from '../tooltip';
import { IsInput } from './input';
import { IsNativeInputDirective } from './input.directive';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [CommonModule, IsToolTipModule.forRoot()],
  exports: [IsInput, IsNativeInputDirective],
  declarations: [IsInput, IsNativeInputDirective]
})
export class IsInputModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: IsInputModule,
      providers: []
    };
  }
}
