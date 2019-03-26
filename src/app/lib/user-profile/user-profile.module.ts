/**
 * Created by egonzalez<edgard.gonzalez@aurea.com> on 06/02/2017.
 */
import { ModuleWithProviders, NgModule } from '@angular/core';

import { IsUserProfile } from './user-profile';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { IsDropdownModule } from '../dropdown';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    NgbDropdownModule,
    IsDropdownModule
  ],
  exports: [
    IsUserProfile
  ],
  declarations: [
    IsUserProfile
  ]
})
export class IsUserProfileModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: IsUserProfileModule,
      providers: []
    };
  }
}
