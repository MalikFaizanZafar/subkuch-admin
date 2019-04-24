import { ModuleWithProviders, NgModule } from '@angular/core';
import { IsButtonModule, IsRevealCarouselModule, IsCoreModule } from '../lib';
import { IsSidebarModule } from 'app/lib/sidebar';
import { IsTopbarModule } from 'app/lib/topbar';
import { IsInputModule } from '../lib/input';
import { IsCheckboxModule } from '../lib/checkbox';
import { IsUserProfileModule } from '../lib/user-profile';
import { IsModalModule } from 'app/lib/modal';
import { IsGridModule } from 'app/lib/grid';
import { IsToasterModule } from '../lib/toaster';

const NGX_DF_MODULES: any[] = [
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
  IsToasterModule
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
    IsGridModule.forRoot()
  ],
  exports: NGX_DF_MODULES,
})
export class NgxDfRootModule {}

@NgModule({
  imports: NGX_DF_MODULES,
  exports: NGX_DF_MODULES,
})
export class NgxDfCustom {
  static forRoot(): ModuleWithProviders {
    return { ngModule: NgxDfRootModule };
  }
}
