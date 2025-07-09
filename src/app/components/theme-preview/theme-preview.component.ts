import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatInput } from '@angular/material/input';
import { MatFabButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatActionList, MatListItemIcon } from '@angular/material/list';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { MatSlider, MatSliderThumb } from '@angular/material/slider';
import { MatChipListbox, MatChipOption } from '@angular/material/chips';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker';
import { MatSpinner } from '@angular/material/progress-spinner';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatIconButton, MatButton } from "@angular/material/button";
import { MatToolbar } from "@angular/material/toolbar";
import { MatIcon } from "@angular/material/icon";
import { MatListItem } from "@angular/material/list";
import { MatRadioButton } from "@angular/material/radio";
import { MatFormField, MatLabel, MatOption, MatSelect, MatSuffix } from "@angular/material/select";
import { MatBadge } from "@angular/material/badge";
import { BaseComponent } from '../base-component';

@Component({
    selector: 'app-theme-preview',
    templateUrl: './theme-preview.component.html',
    styleUrls: ['./theme-preview.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        FormsModule,

        RouterLink,
        MatSuffix,
        MatBadge,
        MatToolbar,
        MatIconButton,
        MatButton,
        MatFabButton,
        MatIcon,
        MatRadioButton,
        MatActionList,
        MatListItem,
        MatListItemIcon,
        MatFormField,
        MatLabel,
        MatSelect,
        MatOption,
        MatCheckbox,
        MatChipListbox,
        MatChipOption,
        MatDatepicker,
        MatDatepickerInput,
        MatDatepickerToggle,
        MatInput,
        MatSlider,
        MatSliderThumb,
        MatTabGroup,
        MatTab,
        MatSpinner,
    ],
    providers: [
        provideNativeDateAdapter()
    ]
})
export class ThemePreviewComponent extends BaseComponent {

    public sliderValue = 50;

    constructor(readonly cdRef: ChangeDetectorRef) {
        super(cdRef);
    }
}
