import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AotAware } from '@lithiumjs/angular';

@Component({
    selector: 'app-theme-preview',
    templateUrl: './theme-preview.component.html',
    styleUrls: ['./theme-preview.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThemePreviewComponent extends AotAware {

    public sliderValue = 50;
}
