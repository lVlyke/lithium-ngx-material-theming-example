import { NgModule } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacySliderModule as MatSliderModule } from '@angular/material/legacy-slider';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { BasicThemeCreatorComponent } from './basic-theme-creator/basic-theme-creator.component';
import { FormsModule } from '@angular/forms';
import { ColorPickerModule } from 'ngx-color-picker';
import { NgxMaterialThemingModule } from '@lithiumjs/ngx-material-theming';
import { ThemePreviewComponent } from './theme-preview/theme-preview.component';
import { AdvancedThemeCreatorComponent } from './advanced-theme-creator/advanced-theme-creator.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ColorPickerModule,
        NgxMaterialThemingModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatGridListModule,
        MatButtonModule,
        MatCheckboxModule,
        MatToolbarModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatRadioModule,
        MatSelectModule,
        MatSliderModule,
        MatListModule,
        MatIconModule,
        MatTabsModule,
        MatBadgeModule,
        MatChipsModule,
        MatProgressSpinnerModule,
        MatExpansionModule
    ],
    declarations: [
        BasicThemeCreatorComponent,
        AdvancedThemeCreatorComponent,
        ThemePreviewComponent
    ],
    exports: [
        ThemePreviewComponent
    ]
})
export class ComponentsModule {}
