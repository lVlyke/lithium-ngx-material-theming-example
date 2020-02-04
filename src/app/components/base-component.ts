import { AutoPush, LiComponent } from '@lithiumjs/angular';
import { Injector, ChangeDetectorRef } from '@angular/core';

export class BaseComponent extends LiComponent {

    constructor(
        protected readonly injector: Injector,
        cdRef?: ChangeDetectorRef
    ) {
        super();

        if (cdRef) {
            AutoPush.enable(this, cdRef);
        }
    }
}