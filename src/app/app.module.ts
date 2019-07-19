import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgxMaterialThemingModule } from '@lithiumjs/ngx-material-theming';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { OverlayHelpers } from './services/overlay-helpers';
import { OverlayModule } from '@angular/cdk/overlay';
import { ComponentsModule } from './components/components.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserAnimationsModule,
    AppRoutingModule,

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
