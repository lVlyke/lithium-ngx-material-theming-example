import { Component, ChangeDetectionStrategy, Injector, ChangeDetectorRef } from '@angular/core';
import { BaseComponent } from './components/base-component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class AppComponent extends BaseComponent {

  constructor(injector: Injector, cdRef: ChangeDetectorRef) {
      super(injector, cdRef);
  }
}
