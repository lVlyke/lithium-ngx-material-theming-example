import { Component, ChangeDetectionStrategy, Injector, ChangeDetectorRef } from '@angular/core';
import { BaseComponent } from '../base-component';

@Component({
    selector: 'app-theme-preview',
    templateUrl: './theme-preview.component.html',
    styleUrls: ['./theme-preview.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class ThemePreviewComponent extends BaseComponent {

    public sliderValue = 50;

    constructor(injector: Injector, cdRef: ChangeDetectorRef) {
        super(injector, cdRef);
    }
}
