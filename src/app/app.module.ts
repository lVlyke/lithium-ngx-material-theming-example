import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgxMaterialThemingModule } from '@lithiumjs/ngx-material-theming';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatIconModule } from '@angular/material/icon';
import { OverlayHelpers } from './services/overlay-helpers';
import { OverlayModule } from '@angular/cdk/overlay';
import { ComponentsModule } from './components/components.module';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,

    OverlayModule,
    MatButtonModule,
    MatIconModule,

    NgxMaterialThemingModule,

    ComponentsModule
  ],
  providers: [
    OverlayHelpers
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
