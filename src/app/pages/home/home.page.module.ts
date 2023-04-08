import { NgModule } from '@angular/core';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HomePageComponent } from './home.page';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from '../../../app/components/components.module';
import { NgxMaterialThemingModule } from '@lithiumjs/ngx-material-theming';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,

        MatCardModule,
        MatButtonModule,
        MatSidenavModule,
        MatToolbarModule,
        MatIconModule,
        MatListModule,
        MatRadioModule,
        MatSelectModule,
        MatFormFieldModule,
        NgxMaterialThemingModule,
        MatExpansionModule,

        ComponentsModule,

        RouterModule.forChild([{ path: '', component: HomePageComponent }])
    ],
    declarations: [HomePageComponent],
    exports: [HomePageComponent]
})
export class HomePageModule {}
