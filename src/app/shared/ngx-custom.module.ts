import { ModuleWithProviders, NgModule } from '@angular/core';
import { IsButtonModule, 
  IsRevealCarouselModule, 
  IsCoreModule, 
  IsCardModule, 
  IsTimePickerModule, 
  IsBadgeModule, 
  IsDropdownModule, 
  IsSlideToggleModule, 
  IsTableModule,
  IsDatepickerModule
} from '../lib';
import { NgbDropdownModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { IsSidebarModule } from 'app/lib/sidebar';
import { IsTopbarModule } from 'app/lib/topbar';
import { IsInputModule } from '../lib/input';
import { IsCheckboxModule } from '../lib/checkbox';
import { IsUserProfileModule } from '../lib/user-profile';
import { IsModalModule } from 'app/lib/modal';
import { IsGridModule } from 'app/lib/grid';
import { IsToasterModule } from '../lib/toaster';

const NGX_IS_MODULES: any[] = [
  IsCoreModule,
  IsButtonModule,
  IsRevealCarouselModule,
  IsSidebarModule,
  IsTopbarModule,
  IsInputModule,
  IsCheckboxModule,
  IsUserProfileModule,
  IsModalModule,
  IsGridModule,
  IsToasterModule,
  IsCardModule,
  IsTimePickerModule,
  IsBadgeModule,
  IsDropdownModule,
  IsSlideToggleModule,
  IsUserProfileModule,
  IsTableModule,
  IsCheckboxModule,
  NgbModule,
  IsDatepickerModule
];

@NgModule({
  imports: [
    IsCoreModule.forRoot(),
    IsButtonModule.forRoot(),
    IsRevealCarouselModule.forRoot(),
    IsButtonModule.forRoot(),
    IsTopbarModule.forRoot(),
    IsInputModule.forRoot(),
    IsCheckboxModule.forRoot(),
    IsSidebarModule.forRoot(),
    IsUserProfileModule.forRoot(),
    IsModalModule.forRoot(),
    IsGridModule.forRoot(),
    IsCardModule.forRoot(),
    IsTimePickerModule.forRoot(),
    IsBadgeModule.forRoot(),
    IsDropdownModule.forRoot(),
    IsSlideToggleModule.forRoot(),
    IsUserProfileModule.forRoot(),
    IsTableModule.forRoot(),
    IsCheckboxModule.forRoot(),
    NgbModule.forRoot(),
    IsDatepickerModule.forRoot()
  ],
  exports: NGX_IS_MODULES,
})
export class NgxDfRootModule {}

@NgModule({
  imports: NGX_IS_MODULES,
  exports: NGX_IS_MODULES,
})
export class NgxDfCustom {
  static forRoot(): ModuleWithProviders {
    return { ngModule: NgxDfRootModule };
  }
}
