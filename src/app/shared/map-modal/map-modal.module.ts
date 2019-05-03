import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapModalComponent } from './components/map-modal/map-modal.component';
import { GoogleMapService } from '@app/shared/services/google-map.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';
import { NgxDfCustom } from '@app/shared/ngx-custom.module';
import { environment } from 'environments/environment';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDfCustom,
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyB-EsaismaaJDTBDg0F2l-28Z-7zsVCTWU ",
      libraries: ["places"]
    }),
  ],
  declarations: [MapModalComponent],
  entryComponents: [MapModalComponent],
  providers:[GoogleMapService]
})
export class MapModalModule { }
