import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ThemeContainer } from '@lithiumjs/ngx-material-theming';
import { BaseComponent } from './components/base-component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        RouterModule,
        ThemeContainer
    ]
})
export class AppComponent extends BaseComponent {

  constructor(cdRef: ChangeDetectorRef) {
      super(cdRef);
  }
}
