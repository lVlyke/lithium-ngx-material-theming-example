import { NgModule } from '@angular/core';
import {
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
    MatProgressSpinnerModule
} from '@angular/material';
import { CommonModule } from '@angular/common';
import { BasicThemeCreatorComponent } from './basic-theme-creator/basic-theme-creator.component';
import { FormsModule } from '@angular/forms';
import { ColorPickerModule } from 'ngx-color-picker';
import { NgxMaterialThemingModule } from '@lithiumjs/ngx-material-theming';
import { ThemePreviewComponent } from './theme-preview/theme-preview.component';

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
        MatProgressSpinnerModule
    ],
    declarations: [
        BasicThemeCreatorComponent,
        ThemePreviewComponent
    ],
    entryComponents: [
        BasicThemeCreatorComponent,
        ThemePreviewComponent
    ],
    exports: [
        ThemePreviewComponent
    ]
})
export class ComponentsModule {}
